import hashlib
import json
def encodeJson(data):
    json_string = json.dumps(
        data, 
        sort_keys=True, 
        separators=(',', ':')
    )
    return hashlib.sha256(json_string.encode("utf-8")).hexdigest()