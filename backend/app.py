from flask import Flask, jsonify, request
import random

app = Flask(__name__)

temp = {}

@app.route("/")
def home():
    return jsonify({"message" : "LMAO OK"})

"""
{
        "farm_name": "BananaCorp",
        "harvest_date": "XXXX-XX-XX",
        "quantity_kg": 6767, 
        "latitude": 10.45,
        "longitude": 67.67,
        "grade": "spectacular",
        "produce": "bananas"
        }
"""
@app.route("/api/batch", methods=["POST"])
def init_batch():
    batch_data = request.get_json()
    id = batch_data["farm_name"][0] + batch_data["harvest_date"][0] + str(batch_data["quantity_kg"])[0]
    id += str(batch_data["latitude"])[0] + str(batch_data["longitude"])[0] + batch_data["grade"][0] + batch_data["produce"][0]
    id += str(random.randint(0,9)) + str(random.randint(0,9)) + str(random.randint(0,9)) + str(random.randint(0,9))
    return jsonify({"message" : "Batch has been initialized",
            "batch_uuid" : id})

"""
{ 
“batch_uuid”: “676767-67-A”,
	“latitude”: 10.45,
“longitude”: 67.67,
“company_name”: “bananacorp distributors”,
“action”: “Received from farm”
}
"""
@app.route("/api/transfer", methods=["POST"])
def transfer_batch():
    return jsonify({"message": "Transfer recorded"})

"""
Received:
[ { 
“company_name”: “67 farms inc.”
“action”: “Harvested”,
"timestamp": "6767-67-67T67:67:67Z", 
"latitude": 67.67, 
"longitude": -67.67
}, {
	“company_name”: “67 shipping inc.”
“action”: "Received from Farm”,
"timestamp": "6767-68-67T67:67:67Z", 
"latitude": 67.67, 
"longitude": -67.67
}, {
…
} ]
"""
@app.route("/api/batch/<uuid>", methods=["POST"])
def get_data():
    return jsonify(temp)

if __name__ == '__main__':
    app.run()