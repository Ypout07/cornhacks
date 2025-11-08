import hashlib
import json

def calculate_hash(data_to_hash, previous_hash):
    # Calculates a SHA-256 hash for a new block

    block_string = f"{data_to_hash}{previous_hash}".encode() # Combine data to maintain link
    
    return hashlib.sha256(block_string).hexdigest()


def haversine_audit_logic():
    pass