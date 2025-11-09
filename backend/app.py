from flask import Flask, jsonify, request
from flask_cors import CORS
import random
from database import SessionLocal, Batch, LedgerBlock, create_db_and_tables
from utils import calculate_hash, haversine_audit_logic
import datetime

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
        # Create the Batch object
        new_batch = Batch(
            batch_uuid=id,
            farm_name=batch_data['farm_name'],
            harvest_date=batch_data['harvest_date'],
            quantity_kg=batch_data['quantity_kg']
        )

        # Add the batch to the database
        db.add(new_batch)
        db.commit()
        db.refresh(new_batch)

        # Create the first Block object in the chain

        genesis_data = f"{id}{batch_data['farm_name']}{batch_data['harvest_date']}"
        previous_hash = "00000000000000000000000000000000" # since this is the first block, this is an empty hash

        current_hash = calculate_hash(
            data_to_hash=genesis_data,
            previous_hash=previous_hash
        )

        genesis_block = LedgerBlock(
            actor_name=batch_data['farm_name'],
            action="Harvested",
            timestamp=datetime.datetime.utcnow(),
            latitude=batch_data['latitude'],
            longitude=batch_data['longitude'],
            previous_hash=previous_hash,
            current_hash=current_hash,
            batch_id=new_batch.id # Connects block to batch
        )   

        db.add(genesis_block)
        db.commit()

        return jsonify({
            "message" : "Batch has been initialized",
            "batch_uuid" : id
        })
    
    except Exception as e:
        db.rollback() # If there is an error: UNDO!!
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
            f"{transfer_data['latitude']}{transfer_data['longitude']}"
        )
        
        current_hash = calculate_hash(
            data_to_hash=new_data_string,
            previous_hash=previous_hash
        )

        # 5. Create the new LedgerBlock object
        new_block = LedgerBlock(
            actor_name=transfer_data['actor_name'],
            action=transfer_data['action'],
            timestamp=datetime.datetime.utcnow(),
            latitude=transfer_data['latitude'],
            longitude=transfer_data['longitude'],
            previous_hash=previous_hash, 
            current_hash=current_hash,    
            batch_id=batch.id # To connect to proper batch
        )

        db.add(new_block)
        db.commit()

        ts_pmo = "Failed"
        if (valid_data(batch_uuid)):
            ts_pmo = "Passed"
        
        return jsonify({"message": f"Transfer recorded Audit: {ts_pmo}"})

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

def valid_data(batch_uuid):
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
                "timestamp": block.timestamp, # Format as ISO string
                "latitude": block.latitude,
                "longitude": block.longitude
            })
        
        return haversine_audit_logic(history_list)

    except Exception as e:
        return False
    finally:
        db.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)