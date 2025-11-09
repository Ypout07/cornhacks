from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
from .database import SessionLocal, Batch, LedgerBlock, create_db_and_tables
from .utils import calculate_hash, haversine_audit_logic, confirm_chain, parse_crate_string
from datetime import datetime, timezone
import os
import io
import qrcode
from qrcode import constants
from fpdf import FPDF
import traceback
from PIL import Image

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
    return jsonify({"message" : "Welcome to Banana Blockchain"})

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

        try:
            # Put a 'banana_logo.png' file in your /backend folder
            logo = Image.open("banana_logo.webp") 
            
            # Resize logo to be small
            logo_w, logo_h = logo.size
            logo_max_size = 60 # max width/height in pixels
            logo.thumbnail((logo_max_size, logo_max_size))
            logo_w, logo_h = logo.size # Get new, smaller size
            
        except FileNotFoundError:
            print("WARNING: banana_logo.png not found. QR codes will be plain.")
            logo = None

        for i in range(1, crate_count + 1):
            crate_uuid = f"{id}-CRATE_{i}"
            
            qr = qrcode.QRCode(
                error_correction=constants.ERROR_CORRECT_H,
                box_size=10,
                border=4,
            )
            qr.add_data(crate_uuid)
            qr.make(fit=True)
            
            qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
            
            if logo:
                qr_w, qr_h = qr_img.size
                # Calculate position to paste logo
                pos = ((qr_w - logo_w) // 2, (qr_h - logo_h) // 2)
                qr_img.paste(logo, pos)
            
            img_buffer = io.BytesIO()
            qr_img.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            
            pdf.add_page()
            
            pdf.image(img_buffer, x=55, y=30, w=100)
            
            pdf.set_font("Helvetica", size=16)
            pdf.set_xy(0, 140)
            pdf.cell(0, 10, text=crate_uuid, new_x="LMARGIN", new_y="NEXT", align='C')
            
            pdf.set_font("Helvetica", size=14)
            pdf.cell(0, 10, text=f"Crate {i} of {crate_count}", new_x="LMARGIN", new_y="NEXT", align='C')
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
    """
    Receives a string of crate numbers (e.g., "1, 2, 5-10"),
    parses it, and creates a new LedgerBlock for each one.
    """
    data = request.get_json()
    db = next(get_db())

    try:
        batch_uuid = data['batch_uuid']
        crate_string = data['crate_numbers_string']
        actor_name = data['actor_name']
        action = data['action']
        latitude = data['latitude']
        longitude = data['longitude']

        # Find the parent Batch
        batch = db.query(Batch).filter(Batch.batch_uuid == batch_uuid).first()
        if not batch:
            return jsonify({"error": "Batch not found"}), 404

        crate_numbers = parse_crate_string(crate_string)
        if not crate_numbers:
            return jsonify({"error": "Invalid crate number format"}), 400

        for num in crate_numbers:
            
            crate_id = f"{batch_uuid}-CRATE_{num}" # Re-create  full crate ID

            # Find the last block for this specific crate
            last_block = db.query(LedgerBlock).filter(
                LedgerBlock.batch_id == batch.id,
                LedgerBlock.crate_id == crate_id
            ).order_by(LedgerBlock.id.desc()).first()

            if not last_block:
                # If it's the crate's first move, get the PARENT'S hash
                last_block = db.query(LedgerBlock).filter(
                    LedgerBlock.batch_id == batch.id,
                    LedgerBlock.crate_id == None 
                ).order_by(LedgerBlock.id.desc()).first()
            
            previous_hash = last_block.current_hash

            new_data_string = f"{actor_name}{action}{latitude}{longitude}{crate_id}"
            current_hash = calculate_hash(new_data_string, previous_hash)

            # Create the new block
            new_block = LedgerBlock(
                actor_name=actor_name,
                action=action,
                timestamp=datetime.now(timezone.utc),
                latitude=latitude,
                longitude=longitude,
                previous_hash=previous_hash, 
                current_hash=current_hash,      
                batch_id=batch.id,
                crate_id=crate_id 
            )
            db.add(new_block)
        
        db.commit()

        return jsonify({"message": f"Successfully logged {len(crate_numbers)} crates."})

    except Exception as e:
        db.rollback() 
        print(f"--- ERROR IN /api/transfer ---: {e}") 
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()


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
        
        has_stable_table = haversine_audit_logic(blocks)
        has_stable_chain = confirm_chain(blocks, batch)
        
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

@app.route("/api/batch/hack", methods=["POST"])
def hackdb():
    id = request.get_data().decode('ascii')
    db = next(get_db())
    try:
        batch = db.query(Batch).filter(Batch.batch_uuid == id).first()
        led_batch = db.query(LedgerBlock).filter(
            LedgerBlock.batch_id == batch.id
        ).order_by(LedgerBlock.id.asc()).first()
        
        if not led_batch:
            return jsonify({"error": "Batch not found"}), 404
        
        led_batch.actor_name = "Hacked"
        db.commit() 
        return jsonify({"message" : f"Batch {id} has been hacked (farm_name set to 'Hacked')"}), 200

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route("/api/history", methods=["GET"])
def get_crate_history():
    """
    This is the "smart" history endpoint.
    It combines the main batch history (harvest) with the
    specific crate's history (transfer) to show a full path.
    """
    
    batch_uuid = request.args.get('batch_uuid')
    crate_id = request.args.get('crate_id')
    
    if not batch_uuid or not crate_id:
        return jsonify({"error": "batch_uuid and crate_id are required"}), 400

    db = next(get_db())
    try:
        batch = db.query(Batch).filter(Batch.batch_uuid == batch_uuid).first()
        if not batch:
            return jsonify({"error": "Batch not found"}), 404

        # These are blocks where crate_id is NULL
        common_blocks = db.query(LedgerBlock).filter(
            LedgerBlock.batch_id == batch.id,
            LedgerBlock.crate_id == None
        ).all()

        crate_blocks = db.query(LedgerBlock).filter(
            LedgerBlock.batch_id == batch.id,
            LedgerBlock.crate_id == crate_id
        ).all()

        all_blocks = sorted(common_blocks + crate_blocks, key=lambda block: block.id)

        history_list = []
        for block in all_blocks:
            history_list.append({
                "actor_name": block.actor_name,
                "action": block.action,
                "timestamp": block.timestamp.isoformat(),
                "latitude": block.latitude,
                "longitude": block.longitude
            })
            
        return jsonify(history_list)

    except Exception as e:
        print(f"--- ERROR IN /api/history ---: {e}")
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)