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