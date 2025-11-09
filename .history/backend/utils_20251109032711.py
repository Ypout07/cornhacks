from haversine import haversine, Unit
import hashlib
import json
from datetime import datetime, timezone

def calculate_hash(data_to_hash, previous_hash):
    # Calculates a SHA-256 hash for a new block

    block_string = f"{data_to_hash}{previous_hash}".encode() # Combine data to maintain link
    
    return hashlib.sha256(block_string).hexdigest()


def haversine_audit_logic(blocks):
    """
    Analyzes a list of ledger blocks for suspicious travel times.
    Takes a list of LedgerBlock *objects* as input.
    Returns True if valid, False if suspicious.
    """
    SPEED = 300 # Your suspicion (km/hr)

    if len(blocks) < 2:
        return True 

    try:
        # Loop through blocks, comparing each one to the next one
        for i in range(len(blocks) - 1):
            
            block_A = blocks[i]
            block_B = blocks[i+1]

            location1 = (block_A.latitude, block_A.longitude)
            location2 = (block_B.latitude, block_B.longitude)
            
            time1 = block_A.timestamp.replace(tzinfo=timezone.utc)
            time2 = block_B.timestamp.replace(tzinfo=timezone.utc)

            if (time2 - time1).total_seconds() <= 0:
                return False # Time traveled backwards or was 0
            
            distance_km = haversine(location1, location2, unit=Unit.KILOMETERS)
            time_hours = (time2 - time1).total_seconds() / 3600
            
            speed_kph = distance_km / time_hours
            
            if speed_kph > SPEED:
                return False # Suspicious speed detected
        
        return True 

    except Exception as e:
        print(f"--- ERROR IN AUDIT LOGIC ---: {e}")
        return False # Fail on any error

def confirm_chain(blocks, batch):
    for i in range(len(blocks)):
        block = blocks[i]
        if len(block.previous_hash) != 64 or len(block.current_hash) != 64:
            return False
        
        if block.previous_hash == "0"*64:
            remade_data = f"{batch.batch_uuid}{block.actor_name}{batch.harvest_date}"
            remade_hash = calculate_hash(data_to_hash=remade_data,previous_hash="0"*64)
            if remade_hash != block.current_hash:
                return False
        else:
            previous_hash = block.previous_hash
            remade_data_string = (
            f"{block.actor_name}{block.action}"
            f"{block.latitude}{block.longitude}"
            )
            remade_hash = calculate_hash(
                data_to_hash=remade_data_string,
                previous_hash=previous_hash
            )
            if remade_hash != block.current_hash:
                return False
        return True

def parse_crate_string(crate_string):
    """
    Parses a string like "1, 2, 5-10" into a list of integers.
    """
    crates = set() # Destroy duplicates
    try:
        # Split by comma first e.g., ["1", " 2", " 5-10"]
        parts = crate_string.split(',')
        
        for part in parts:
            part = part.strip() 
            if not part:
                continue
            
            # Check if it's a range (e.g., "5-10")
            if '-' in part:
                start, end = part.split('-')
                start_num = int(start)
                end_num = int(end)
                
                # Add all numbers in the range
                for i in range(start_num, end_num + 1):
                    crates.add(i)
            else:
                crates.add(int(part))
                
    except Exception as e:
        print(f"Error parsing crate string: {e}")
        return [] # Return an empty list if the format is bad
        
    return list(crates) 


'''
        # In /backend/app.py
# ... (all your other imports and routes) ...

@app.route("/api/history", methods=["GET"])
def get_crate_history():
    """
    This is the "smart" history endpoint.
    It combines the main batch history (harvest) with the
    specific crate's history (transfer) to show a full path.
    """
    
    # 1. Get the IDs from the URL parameters
    batch_uuid = request.args.get('batch_uuid')
    crate_id = request.args.get('crate_id')
    
    if not batch_uuid or not crate_id:
        return jsonify({"error": "batch_uuid and crate_id are required"}), 400

    db = next(get_db())
    try:
        # 2. Find the parent batch
        batch = db.query(Batch).filter(Batch.batch_uuid == batch_uuid).first()
        if not batch:
            return jsonify({"error": "Batch not found"}), 404

        # 3. Get the "Common History" (e.g., "Harvested")
        # These are blocks where crate_id is NULL
        common_blocks = db.query(LedgerBlock).filter(
            LedgerBlock.batch_id == batch.id,
            LedgerBlock.crate_id == None
        ).all()

        # 4. Get the "Specific Crate History" (e.g., "Moved to Truck A")
        # These are blocks that match our specific crate_id
        crate_blocks = db.query(LedgerBlock).filter(
            LedgerBlock.batch_id == batch.id,
            LedgerBlock.crate_id == crate_id
        ).all()

        # 5. Combine the two lists and sort them by their ID
        # This stitches the two histories together in the correct order
        all_blocks = sorted(common_blocks + crate_blocks, key=lambda block: block.id)

        # 6. Format the final list for the frontend
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
'''