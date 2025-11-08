from flask import Flask, jsonify, request
import random
import utils

app = Flask(__name__)

temp = {}

@app.route("/")
def home():
    return jsonify({"message" : "LMAO OK"})

@app.route("/api/batch", methods=["POST"])
def init_batch():
    batch_data = request.get_json()
    id = batch_data["farm_name"][0] + batch_data["harvest_date"][0] + str(batch_data["quantity_kg"])[0]
    id += str(batch_data["latitude"])[0] + str(batch_data["longitude"])[0] + batch_data["grade"][0] + batch_data["produce"][0]
    id += str(random.randint(0,9)) + str(random.randint(0,9)) + str(random.randint(0,9)) + str(random.randint(0,9))
    temp[id] = temp.get(id, ["0"])
    temp[id][0] += "-" + utils.encodeJson(batch_data)
    temp[id].append(batch_data)
    print(temp) #Delete later
    return jsonify({"message" : "Batch has been initialized",
            "batch_uuid" : id})

@app.route("/api/transfer", methods=["POST"])
def transfer_batch():
    transfer_data = request.get_json()
    id = transfer_data["batch_uuid"]
    temp[id][0] += "-" + utils.encodeJson(transfer_data)
    temp[id].append(transfer_data)
    print(f"\n{temp}") #Delete later
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
@app.route("/api/batch/<id>", methods=["POST"])
def get_data(id):
    return jsonify(temp[id])

if __name__ == '__main__':
    app.run()