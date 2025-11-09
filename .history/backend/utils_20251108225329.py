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

def confirm_chain(last_block, batch):
    if len(last_block.previous_hash) != 64 or len(last_block.current_hash) != 64:
        return False
    
    if last_block.previous_hash == "0"*64:
        genesis_data = f"{batch.batch_uuid}{last_block.actor_name}{batch.harvest_date}"
        current_hash = calculate_hash(data_to_hash=genesis_data,previous_hash="0"*64)
        if current_hash != last_block.current_hash:
            return False
    else:
        previous_hash = last_block.previous_hash
        new_data_string = (
        f"{last_block.actor_name}{last_block.action}"
        f"{last_block.latitude}{last_block.longitude}"
        )
        current_hash = calculate_hash(
            data_to_hash=new_data_string,
            previous_hash=previous_hash
        )
        if current_hash != last_block.current_hash:
            return False
    return True