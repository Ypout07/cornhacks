import hashlib
from haversine import haversine, Unit
import re

def calculate_hash(data_to_hash, previous_hash):
    """
    Creates a SHA-256 hash from a string of data and a previous hash.
    This function is database-agnostic and remains unchanged.
    """
    # Combine the new data with the previous hash
    hash_string = str(data_to_hash).encode('utf-8') + str(previous_hash).encode('utf-8')
    
    # Create the new hash
    sha = hashlib.sha256(hash_string)
    return sha.hexdigest()

def confirm_chain(blocks, batch_data):
    """
    Audits the blockchain by checking if all hashes link up.
    
    UPDATED: Now works with a list of dictionaries (blocks)
    and a main batch dictionary (batch_data).
    """
    
    # 1. Re-create the genesis hash to start the chain
    # We use dictionary-key access ['...'] instead of object.attribute
    genesis_data = f"{batch_data['batch_uuid']}{batch_data['farm_name']}{batch_data['harvest_date']}"
    last_valid_hash = calculate_hash(genesis_data, "0"*64)
    
    # 2. Check the first block (genesis block)
    # Use .get() for safety, though we know this block exists
    if not blocks[0].get('current_hash') == last_valid_hash:
        print(f"Genesis hash mismatch! Expected {last_valid_hash}, got {blocks[0].get('current_hash')}")
        return False # Chain is broken at the start
        
    # 3. Loop through the rest of the blocks
    for i in range(1, len(blocks)):
        block = blocks[i] # This is now a dictionary
        
        # Check if the block's "previous_hash" matches the *actual* hash of the last block
        # This confirms no one tampered with a block in the middle
        if block.get('previous_hash') != last_valid_hash:
            print(f"Chain broken at block {i}. Expected prev_hash {last_valid_hash}, got {block.get('previous_hash')}")
            return False
            
        # Update last_valid_hash to the hash of *this* block, for the *next* loop
        last_valid_hash = block.get('current_hash')
        
    return True # If we get here, the chain is valid

def haversine_audit_logic(blocks, travel_threshold_km=1000):
    """
    Audits the blockchain for suspicious travel distances.
    
    UPDATED: Now works with a list of dictionaries.
    """
    
    # Not enough data to audit
    if len(blocks) < 2:
        return True 

    try:
        for i in range(1, len(blocks)):
            # Use dictionary-key access ['...']
            prev_block = blocks[i-1]
            curr_block = blocks[i]

            # Get coordinates from the dictionaries
            point_a = (prev_block['latitude'], prev_block['longitude'])
            point_b = (curr_block['latitude'], curr_block['longitude'])
            
            # Calculate distance
            distance_km = haversine(point_a, point_b, unit=Unit.KILOMETERS)
            
            # If a single jump is > 1000km, flag it as suspicious
            if distance_km > travel_threshold_km:
                print(f"Suspicious travel detected: {distance_km} km jump.")
                return False # Suspicious
                
    except Exception as e:
        print(f"Error during haversine audit: {e}")
        return False # Fail safe
        
    return True # Looks good

def parse_crate_string(crate_string):
    """
    Parses a string like "1, 2, 5-10, 15" into a list [1, 2, 5, 6, 7, 8, 9, 10, 15].
    This function is database-agnostic and remains unchanged.
    """
    if not crate_string:
        return []
        
    crate_numbers = set() # Use a set to avoid duplicates
    parts = crate_string.split(',')
    
    for part in parts:
        part = part.strip()
        if not part:
            continue
            
        if '-' in part:
            # It's a range, e.g., "5-10"
            try:
                start, end = part.split('-')
                start_num = int(start.strip())
                end_num = int(end.strip())
                
                if start_num > end_num:
                    raise ValueError("Range start must be less than end")
                    
                for i in range(start_num, end_num + 1):
                    crate_numbers.add(i)
            except ValueError:
                print(f"Skipping invalid range: {part}")
                continue # Skip this malformed part
        else:
            # It's a single number
            try:
                num = int(part.strip())
                crate_numbers.add(num)
            except ValueError:
                print(f"Skipping invalid number: {part}")
                continue # Skip this malformed part
                
    return sorted(list(crate_numbers))