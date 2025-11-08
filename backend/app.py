from flask import Flask

app = Flask(__name__)

id = 0
temp = {}

@app.route("/")
def home():
    return {"message" : "LMAO"}

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
def init_batch(batch_data):
    id += 1
    temp[id] = batch_data
    return {"message" : "Batch has been initialized",
            "batch_uuid" : id}

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
def transfer_batch(batch_data):
    return {"message": "Transfer recorded"}

@app.route("/api/batch/<uuid>", methods=["POST"])
def get_data(id):
    return temp


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

if __name__ == '__main__':
    app.run(host="https://cornhackshaa.onrender.com", port=5000)