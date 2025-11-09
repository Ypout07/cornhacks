from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
from database import SessionLocal, Batch, LedgerBlock, create_db_and_tables
from utils import calculate_hash, haversine_audit_logic, confirm_chain
from datetime import datetime, timezone
import os
import io
import qrcode
from fpdf import FPDF
import traceback


# Inits
app = Flask(__name__)
CORS(app)

# Makes file
with app.app_context():
    create_db_and_tables()

# Gets a session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.route("/")
def home():
    return jsonify({"message" : "LMAO OK"})

@app.route("/api/batch", methods=["POST"])
def init_batch():
    batch_data = request.get_json()

    # Create ID
    id = batch_data["farm_name"][0] + batch_data["harvest_date"][0] + str(batch_data["quantity_kg"])[0]
    id += str(batch_data["latitude"])[0] + str(batch_data["longitude"])[0] + batch_data["grade"][0] + batch_data["produce"][0]
    id += str(random.randint(0,9)) + str(random.randint(0,9)) + str(random.randint(0,9)) + str(random.randint(0,9))

    db = next(get_db())

    try:
        print(f"--- RECEIVED DATA: {batch_data} ---")

        # Create the Batch object
        new_batch = Batch(
            batch_uuid=id,
            farm_name=batch_data['farm_name'],
            harvest_date=batch_data['harvest_date'],
            quantity_kg=batch_data['quantity_kg'],
            crate_count=batch_data['crate_count']
        )

        # Add the batch to the database
        db.add(new_batch)
        db.commit()
        db.refresh(new_batch)

        # Create the first Block object in the chain

        genesis_data = f"{id}{batch_data['farm_name']}{batch_data['harvest_date']}"
        previous_hash = "0"*64 # since this is the first block, this is an empty hash

        current_hash = calculate_hash(
            data_to_hash=genesis_data,
            previous_hash=previous_hash
        )

        genesis_block = LedgerBlock(
            actor_name=batch_data['farm_name'],
            action="Harvested",
            timestamp=datetime.now(timezone.utc),
            latitude=batch_data['latitude'],
            longitude=batch_data['longitude'],
            previous_hash=previous_hash,
            current_hash=current_hash,
            batch_id=new_batch.id, # Connects block to batch
            crate_id=None
        )   

        db.add(genesis_block)

        pdf = FPDF()
        crate_count = int(batch_data['crate_count'])
        
        # Create the 'qrcodes' directory if it doesn't exist
        os.makedirs("qrcodes", exist_ok=True)

        for i in range(1, crate_count + 1):
            # Create the forked UUID
            crate_uuid = f"{id}-CRATE_{i}"
            
            qr_img = qrcode.make(crate_uuid)
            img_buffer = io.BytesIO()
            qr_img.save(img_buffer, format='PNG')
            img_buffer.seek(0)

            pdf.add_page()
            
            pdf.image(img_buffer, x=55, y=30, w=100, type='PNG')
            
            # Add the text labels
            pdf.set_font("Helvetica", size=16)
            pdf.set_xy(0, 140) # Position for the text
            pdf.cell(0, 10, txt=crate_uuid, ln=True, align='C')
            
            pdf.set_font("Arial", size=14)
            pdf.cell(0, 10, txt=f"Crate {i} of {crate_count}", ln=True, align='C')

        pdf_filename = f"{id}_qrcodes.pdf"
        pdf_path = os.path.join("qrcodes", pdf_filename)
        pdf.output(pdf_path)

        # HARD CODED FOR LOCAL
        pdf_url = f"http://127.0.0.1:5000/qrcodes/{pdf_filename}"

        db.commit()

        return jsonify({
            "message" : "Batch has been initialized",
            "batch_uuid" : id,
            "pdf_url": pdf_url
        })
    
    except Exception as e:
        db.rollback() # If there is an error: UNDO!!  
        print("---!!! AN ERROR OCCURRED IN init_batch !!!---")
        print(traceback.format_exc()) # This prints the FULL error traceback
        return jsonify({"error": str(e)}), 400
    finally:
        db.close() # Make sure to close up the database

    
@app.route("/api/transfer", methods=["POST"])
def transfer_batch():
    transfer_data = request.get_json()
    db = next(get_db()) # Start session again

    try:
        # Get Batch using UUID
        batch_uuid = transfer_data['batch_uuid']
        batch = db.query(Batch).filter(Batch.batch_uuid == batch_uuid).first() # Gets correct Batch from table

        if not batch:
            return jsonify({"error": "Batch not found"}), 404

        # Finds last block in the chain
        last_block = db.query(LedgerBlock).filter(
            LedgerBlock.batch_id == batch.id
        ).order_by(LedgerBlock.id.desc()).first()

        if not last_block:
            # Ensures init_batch worked
            return jsonify({"error": "Genesis block missing, chain is broken"}), 500

        previous_hash = last_block.current_hash

        # NEW hash from data
        new_data_string = (
            f"{transfer_data['actor_name']}{transfer_data['action']}"
            f"{float(transfer_data['latitude'])}{float(transfer_data['longitude'])}"
        )
        
        current_hash = calculate_hash(
            data_to_hash=new_data_string,
            previous_hash=previous_hash
        )

        # Create the new LedgerBlock object
        new_block = LedgerBlock(
            actor_name=transfer_data['actor_name'],
            action=transfer_data['action'],
            timestamp=datetime.now(timezone.utc),
            latitude=transfer_data['latitude'],
            longitude=transfer_data['longitude'],
            previous_hash=previous_hash, 
            current_hash=current_hash,    
            batch_id=batch.id # To connect to proper batch
        )

        db.add(new_block)
        db.commit()

        return jsonify({"message": f"Transfer recorded"})

    except Exception as e:
        db.rollback() # Undo if there's an error
        print(f"--- ERROR IN /api/transfer ---: {e}")
        return jsonify({"error": str(e)}), 400
    finally:
        db.close() # Close up


@app.route("/api/batch/<batch_uuid>", methods=["GET"])
def get_data(batch_uuid):

    db = next(get_db())
    
    try:
        # Again, finds batch
        batch = db.query(Batch).filter(Batch.batch_uuid == batch_uuid).first()

        if not batch:
            return jsonify({"error": "Batch not found"}), 404

        # Gives the list of all LedgerBlocks
        blocks = db.query(LedgerBlock).filter(
            LedgerBlock.batch_id == batch.id
        ).order_by(LedgerBlock.id.asc()).all() # .asc() = ascending, 1, 2, 3...

        # Format
        history_list = []
        for block in blocks:
            history_list.append({
                "actor_name": block.actor_name,
                "action": block.action,
                "timestamp": block.timestamp.isoformat() + "Z", # Format as ISO string
                "latitude": block.latitude,
                "longitude": block.longitude
            })
            
        # Return entire list
        return jsonify(history_list)

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@app.route("/api/batch/<batch_uuid>/audit", methods=["GET"])
def get_audit_data(batch_uuid):
    db = next(get_db())
    try:
        batch = db.query(Batch).filter(Batch.batch_uuid == batch_uuid).first()
        if not batch:
            return jsonify({"error": "Batch not found"}), 404

        blocks = db.query(LedgerBlock).filter(
            LedgerBlock.batch_id == batch.id
        ).order_by(LedgerBlock.id.asc()).all()

        last_block = db.query(LedgerBlock).filter(
            LedgerBlock.batch_id == batch.id
        ).order_by(LedgerBlock.id.desc()).first()
        
        has_stable_table = haversine_audit_logic(blocks)
        has_stable_chain = confirm_chain(last_block, batch)
        
        # Make into front-end readable JSON
        warnings = []
        trust_score = "Verified"
        if not has_stable_chain:
            trust_score = "Not Verified"
            warnings.append("Block chain has been tampered.")
        if not has_stable_table:
            trust_score += " with Warnings"
            warnings.append("Suspicious travel detected in chain.")

        return jsonify({"trust_score": trust_score, "warnings": warnings})

    except Exception as e:
        print(f"--- ERROR IN /api/batch/audit ---: {e}")
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

# This route allows the frontend to download the generated files
@app.route('/qrcodes/<path:filename>')
def download_file(filename):
    # This serves files from a new folder called 'qrcodes'
    return send_from_directory('qrcodes', filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, port=5000)