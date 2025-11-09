from haversine import haversine
import hashlib
import json
import datetime

def calculate_hash(data_to_hash, previous_hash):
    # Calculates a SHA-256 hash for a new block

    block_string = f"{data_to_hash}{previous_hash}".encode() # Combine data to maintain link
    
    return hashlib.sha256(block_string).hexdigest()


def haversine_audit_logic(data):
    SPEED = 300 #Suspicion (km/hr)
    location1 = (data[0]["latitude"], data[0]["longitude"])
    time1 = data[0]["timestamp"]
    for i in range(len(data)-1):
        location2 = (data[i+1]["latitude"], data[i+1]["longitude"])
        time2 = data[i+1]["timestamp"]
        if (time2 - time1).total_seconds() <= 0:
            return False
        time = (time2 - time1).total_seconds() / 3600
        speed = haversine(location1, location2) / time
        if speed > SPEED:
            return False
    return True
