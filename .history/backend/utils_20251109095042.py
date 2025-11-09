import hashlib
from haversine import haversine, Unit
from typing import List, Dict, Any, Optional

# Constants
SPEED_LIMIT_KMH = 100 
AUDIT_TIME_WINDOW_HOURS = 24 

def calculate_hash(data_to_hash: str, previous_hash: str) -> str:
    """Calculates the SHA-256 hash of the transaction data concatenated with the previous block's hash."""
    combined_data = data_to_hash + previous_hash
    return hashlib.sha256(combined_data.encode('utf-8')).hexdigest()

def parse_crate_string(crate_string: Optional[str]) -> List[int]:
    """
    Parses a string of crate numbers (e.g., '1, 2, 5-7') into a list of integers.
    Returns an empty list if the string is empty or invalid.
    """
    if not crate_string:
        return []

    crate_numbers = set()
    parts = crate_string.split(',')
    
    for part in parts:
        part = part.strip()
        if not part:
            continue

        if '-' in part:
            try:
                start, end = map(int, part.split('-'))
                if start > end:
                    start, end = end, start # Handle reverse range
                crate_numbers.update(range(start, end + 1))
            except ValueError:
                # Ignore invalid range formats
                continue
        else:
            try:
                crate_numbers.add(int(part))
            except ValueError:
                # Ignore non-integer parts
                continue
    
    return sorted(list(crate_numbers))

def reconstruct_hashable_string(block: Dict[str, Any], batch_data: Dict[str, Any]) -> str:
    """
    Reconstructs the original data string used to generate the current hash. 
    This is essential for confirming chain integrity.
    """
    # Genesis Block (Crate ID is None)
    if block.get('crate_id') is None:
        # The genesis block data string was created using: 
        # f"{id}{batch_data['farm_name']}{batch_data['harvest_date']}"
        id = batch_data.get('batch_uuid', '')
        farm_name = batch_data.get('farm_name', '')
        harvest_date = batch_data.get('harvest_date', '')
        return f"{id}{farm_name}{harvest_date}"
    
    # Transfer/Store Block (Crate ID is present)
    else:
        # Transfer block data string was created using: 
        # f"{actor_name}{action}{latitude}{longitude}{crate_id_to_log}"
        actor_name = block.get('actor_name', '')
        action = block.get('action', '')
        latitude = block.get('latitude', '')
        longitude = block.get('longitude', '')
        crate_id = block.get('crate_id', '')
        return f"{actor_name}{action}{latitude}{longitude}{crate_id}"

def confirm_chain(blocks: List[Dict[str, Any]], batch_data: Dict[str, Any]) -> bool:
    """
    Validates the entire hash chain integrity by:
    1. Checking the hash linkage (previous_hash matches last block's current_hash).
    2. Re-calculating the hash for each block and comparing it to the saved current_hash.
    """
    if not blocks:
        return True # An empty chain is technically valid

    # Use the 'current_hash' of the first block (index 0) as the expected_hash for the next iteration
    expected_hash = blocks[0].get('current_hash', '')
    
    for i in range(len(blocks)):
        block = blocks[i]
        
        # 1. Linkage Check (Skip for Genesis Block)
        if i > 0:
            # Check if the current block correctly points back to the previous block's hash
            if block.get('previous_hash') != expected_hash:
                print(f"AUDIT FAIL: Linkage broken at block index {i}. Expected: {expected_hash}, Found: {block.get('previous_hash')}")
                return False

        # 2. Hash Verification Check
        
        # Reconstruct the original data string based on block type
        data_to_hash = reconstruct_hashable_string(block, batch_data)
        
        # Get the previous hash for the calculation (0-hash for genesis)
        previous_hash = block.get('previous_hash', "0"*64) 
        
        # Recalculate the hash using the reconstructed data string and previous hash
        recalculated_hash = calculate_hash(data_to_hash, previous_hash)
        
        # Compare the recalculated hash to the hash saved in the ledger
        if recalculated_hash != block.get('current_hash'):
            print(f"AUDIT FAIL: Hash mismatch at block index {i}. Recalculated: {recalculated_hash}, Saved: {block.get('current_hash')}")
            return False

        # Update the expected hash for the next iteration
        expected_hash = recalculated_hash 

    return True

def haversine_audit_logic(blocks: List[Dict[str, Any]]) -> bool:
    """
    Audits the ledger for suspicious travel speed using GPS coordinates and timestamps.
    Returns False if travel between two points exceeds a reasonable speed limit.
    """
    
    # Filter blocks to only include those with latitude, longitude, and a valid timestamp
    valid_blocks = [
        block for block in blocks 
        if block.get('latitude') is not None 
        and block.get('longitude') is not None
        and block.get('timestamp') is not None
    ]
    
    # We need at least two valid blocks to calculate speed
    if len(valid_blocks) < 2:
        return True

    for i in range(1, len(valid_blocks)):
        current_block = valid_blocks[i]
        prev_block = valid_blocks[i-1]

        # Extract coordinates
        coord1 = (prev_block['latitude'], prev_block['longitude'])
        coord2 = (current_block['latitude'], current_block['longitude'])

        # Extract timestamps (which are Firestore Timestamp objects)
        time1 = prev_block['timestamp'].astimezone(timezone.utc)
        time2 = current_block['timestamp'].astimezone(timezone.utc)
        
        # 1. Calculate Distance
        distance_km = haversine(coord1, coord2, unit=Unit.KILOMETERS)

        # 2. Calculate Time Difference
        time_delta = time2 - time1
        time_hours = time_delta.total_seconds() / 3600

        # Safety check: If time_hours is near zero, skip the speed check to avoid division by zero/huge numbers
        if time_hours < 0.001: 
            if distance_km > 0.1: # If they moved far instantly, that's suspicious
                print(f"AUDIT WARNING: Near-zero time delta ({time_hours} hrs) but moved {distance_km:.2f} km.")
                # We won't return False here, but log a warning.

            # Continue to the next block comparison
            continue

        # 3. Calculate Speed
        speed_kmh = distance_km / time_hours

        # 4. Check against Speed Limit
        if speed_kmh > SPEED_LIMIT_KMH:
            print(f"AUDIT FAIL: Suspicious speed detected at block {i}. Speed: {speed_kmh:.2f} km/h (Limit: {SPEED_LIMIT_KMH} km/h)")
            print(f"    - Distance: {distance_km:.2f} km")
            print(f"    - Time Delta: {time_hours:.2f} hours")
            return False

    return True