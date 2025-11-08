from haversine import haversine
import hashlib
import json

def calculate_hash(data_to_hash, previous_hash):
    # Calculates a SHA-256 hash for a new block

    block_string = f"{data_to_hash}{previous_hash}".encode() # Combine data to maintain link
    
    return hashlib.sha256(block_string).hexdigest()


def haversine_audit_logic(data):
    SPEED = 300 #Suspicion (km/hr)
    location1 = (45.7597, 4.8422)
    time1 = 1
    for i in range(len(data)):
        data[i]
        location2 = (48.8567, 2.3508)
        time2 = 0
        if (time2 - time1) <= 0:
            return False
        speed = haversine(location1, location2) / time2 - time1
