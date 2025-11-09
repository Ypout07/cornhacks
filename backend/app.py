from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
import os
import io
import traceback
from datetime import datetime, timezone # <-- FIX 1: IMPORT TIMEZONE
from PIL import Image

# --- NEW IMPORTS ---
import firebase_admin
from firebase_admin import credentials, firestore

# --- IMPORTS WE KEEP ---
from .utils import calculate_hash, haversine_audit_logic, confirm_chain, parse_crate_string
import qrcode
from qrcode import constants
from fpdf import FPDF

# Inits
app = Flask(__name__)

# ---
# 1. INITIALIZE FIREBASE
# ---
if os.path.exists('backend\serviceAccountKey.json'):
    cred = credentials.Certificate('backend\serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
else:
    firebase_admin.initialize_app()
    print("WARNING: serviceAccountKey.json not found. App may not work on Render.")

db = firestore.client() # This 'db' is your new database connection!

# ---
# 2. CONFIGURE CORS
# ---
origins = [
    "http://localhost:5173",
    "https://cornhacksnaa.onrender.com" # <-- Make sure this is your frontend URL
]
CORS(app, resources={r"/api/*": {"origins": origins}})


@app.route("/")
def home():
    return jsonify({"message" : "Welcome to Banana Blockchain"})

@app.route("/api/batch", methods=["POST"])
def init_batch():
    batch_data = request.get_json()

    id = batch_data["farm_name"][0] + batch_data["harvest_date"][0] + str(batch_data["quantity_kg"])[0]
    id += str(batch_data["latitude"])[0] + str(batch_data["longitude"])[0] + batch_data["grade"][0] + batch_data["produce"][0]
    id += str(random.randint(0,9)) + str(random.randint(0,9)) + str(random.randint(0,9)) + str(random.randint(0,9))

    try:
        print(f"--- RECEIVED DATA: {batch_data} ---")
        
        genesis_data = f"{id}{batch_data['farm_name']}{batch_data['harvest_date']}"
        previous_hash = "0"*64
        current_hash = calculate_hash(
            data_to_hash=genesis_data,
            previous_hash=previous_hash
        )

        # ---
        # NEW: Create the Genesis Block as a Python Dictionary
        # ---
        genesis_block = {
            "actor_name": batch_data['farm_name'],
            "action": "Harvested",
            "timestamp": datetime.now(timezone.utc), # <-- FIX 2: Replaced SERVER_TIMESTAMP
            "latitude": batch_data['latitude'],
            "longitude": batch_data['longitude'],
            "previous_hash": previous_hash,
            "current_hash": current_hash,
            "crate_id": None
        }
        
        new_batch_document = {
            "batch_uuid": id,
            "farm_name": batch_data['farm_name'],
            "harvest_date": batch_data['harvest_date'],
            "quantity_kg": batch_data['quantity_kg'],
            "crate_count": batch_data['crate_count'],
            "ledger": [genesis_block]
        }

        db.collection('batches').document(id).set(new_batch_document)

        # ---
        # PDF/QR CODE LOGIC (Using /tmp/ for Render)
        # ---
        pdf = FPDF()
        crate_count = int(batch_data['crate_count'])
        
        # Use /tmp/ for Render's ephemeral filesystem
        TMP_DIR = "/tmp/qrcodes"
        os.makedirs(TMP_DIR, exist_ok=True)
        
        try:
            logo = Image.open("banana_logo.webp") 
            logo_w, logo_h = logo.size
            logo_max_size = 60
            logo.thumbnail((logo_max_size, logo_max_size))
            logo_w, logo_h = logo.size
        except FileNotFoundError:
            print("WARNING: banana_logo.webp not found. QR codes will be plain.")
            logo = None

        for i in range(1, crate_count + 1):
            crate_uuid = f"{id}-CRATE_{i}"
            qr = qrcode.QRCode(
                error_correction=constants.ERROR_CORRECT_H,
                box_size=10,
                border=4,
            )
            qr.add_data(crate_uuid)
            qr.make(fit=True)
            qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
            
            if logo:
                qr_w, qr_h = qr_img.size
                pos = ((qr_w - logo_w) // 2, (qr_h - logo_h) // 2)
                qr_img.paste(logo, pos)
            
            img_buffer = io.BytesIO()
            qr_img.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            
            pdf.add_page()
            pdf.image(img_buffer, x=55, y=30, w=100)
            pdf.set_font("Helvetica", size=16)
            pdf.set_xy(0, 140)
            pdf.cell(0, 10, text=crate_uuid, new_x="LMARGIN", new_y="NEXT", align='C')
            pdf.set_font("Helvetica", size=14)
            pdf.cell(0, 10, text=f"Crate {i} of {crate_count}", new_x="LMARGIN", new_y="NEXT", align='C')
        
        pdf_filename = f"{id}_qrcodes.pdf"
        pdf_path = os.path.join(TMP_DIR, pdf_filename) # Save to /tmp/
        pdf.output(pdf_path)

        pdf_url = f"https{request.host_url.lstrip('http')}qrcodes/{pdf_filename}"
        # Make sure your host URL is correct, e.g., "https://cornhackshaa.onrender.com/qrcodes/{pdf_filename}"
        # Using request.host_url is safer, but double-check
        
        return jsonify({
            "message" : "Batch has been initialized",
            "batch_uuid" : id,
            "pdf_url": pdf_url
        })
    
    except Exception as e:
        print("---!!! AN ERROR OCCURRED IN init_batch !!!---")
        print(traceback.format_exc())
        # Return the *actual* error to the frontend so we can see it
        return jsonify({"error": (f"('Cannot convert to a Firestore Value', {str(e)})")}), 400

    
@app.route("/api/transfer", methods=["POST"])
def transfer_batch():
    data = request.get_json()
    
    try:
        batch_uuid = data['batch_uuid']
        crate_string = data['crate_numbers_string']
        actor_name = data['actor_name']
        action = data['action']
        latitude = data['latitude']
        longitude = data['longitude']

        batch_doc_ref = db.collection('batches').document(batch_uuid)
        batch_doc = batch_doc_ref.get()

        if not batch_doc.exists:
            return jsonify({"error": "Batch not found"}), 404
        
        batch_data = batch_doc.to_dict()
        ledger = batch_data.get('ledger', [])
        
        crate_numbers = parse_crate_string(crate_string)
        if not crate_numbers:
            return jsonify({"error": "Invalid crate number format"}), 400

        new_blocks_to_add = []
        current_ledger = list(ledger)

        for num in crate_numbers:
            crate_id = f"{batch_uuid}-CRATE_{num}"
            
            crate_blocks = [b for b in current_ledger if b.get('crate_id') == crate_id]
            last_block = crate_blocks[-1] if crate_blocks else None

            if not last_block:
                parent_blocks = [b for b in current_ledger if b.get('crate_id') is None]
                last_block = parent_blocks[-1] if parent_blocks else None
            
            if not last_block:
                return jsonify({"error": f"Could not find any parent block for crate {num}"}), 500

            previous_hash = last_block['current_hash']
            new_data_string = f"{actor_name}{action}{latitude}{longitude}{crate_id}"
            current_hash = calculate_hash(new_data_string, previous_hash)

            new_block = {
                "actor_name": actor_name,
                "action": action,
                "timestamp": datetime.now(timezone.utc), # <-- FIX 3: Replaced SERVER_TIMESTAMP
                "latitude": latitude,
                "longitude": longitude,
                "previous_hash": previous_hash, 
                "current_hash": current_hash,      
                "crate_id": crate_id 
            }
            
            new_blocks_to_add.append(new_block)
            current_ledger.append(new_block)
        
        batch_doc_ref.update({
            'ledger': firestore.ArrayUnion(new_blocks_to_add)
        })

        return jsonify({"message": f"Successfully logged {len(crate_numbers)} crates."})

    except Exception as e:
        print(f"--- ERROR IN /api/transfer ---: {e}") 
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 400


@app.route("/api/batch/<batch_uuid>", methods=["GET"])
def get_data(batch_uuid):
    try:
        doc_ref = db.collection('batches').document(batch_uuid)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({"error": "Batch not found"}), 404

        batch_data = doc.to_dict()
        blocks = batch_data.get('ledger', [])

        history_list = []
        for block in blocks:
            timestamp = block.get('timestamp')
            ts_str = timestamp.isoformat() + "Z" if isinstance(timestamp, datetime) else str(timestamp)
            
            history_list.append({
                "actor_name": block.get('actor_name'),
                "action": block.get('action'),
                "timestamp": ts_str,
                "latitude": block.get('latitude'),
                "longitude": block.get('longitude')
            })
            
        return jsonify(history_list)

    except Exception as e:
        print(f"--- ERROR IN /api/batch/{batch_uuid} ---: {e}")
        return jsonify({"error": str(e)}), 400

@app.route("/api/batch/<batch_uuid>/audit", methods=["GET"])
def get_audit_data(batch_uuid):
    try:
        doc_ref = db.collection('batches').document(batch_uuid)
        doc = doc_ref.get()
        
        if not doc.exists:
            return jsonify({"error": "Batch not found"}), 404

        batch_data = doc.to_dict()
        blocks = batch_data.get('ledger', [])
        
        has_stable_table = haversine_audit_logic(blocks)
        has_stable_chain = confirm_chain(blocks, batch_data)
        
        warnings = []
        trust_score = "Verified"
        if not has_stable_chain:
            trust_score = "Not Verified"
            warnings.append("Block chain has been tampered.")
        if not has_stable_table:
            trust_score += " with Warnings"
            warnings.append("Suspicious travel detected in chain.")

        return jsonify({"trust_score": trust_score, "warnings": warnings})

    except Exception as e:
        print(f"--- ERROR IN /api/batch/audit ---: {e}")
        return jsonify({"error": str(e)}), 400

# Serves files from the /tmp/qrcodes/ directory
@app.route('/qrcodes/<path:filename>')
def download_file(filename):
    return send_from_directory('/tmp/qrcodes', filename, as_attachment=True)

@app.route("/api/batch/hack", methods=["POST"])
def hackdb():
    id = request.get_data().decode('ascii')
    
    try:
        doc_ref = db.collection('batches').document(id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return jsonify({"error": "Batch not found"}), 404
        
        batch_data = doc.to_dict()
        ledger = batch_data.get('ledger', [])
        
        if not ledger:
            return jsonify({"error": "Ledger is empty"}), 404
        
        ledger[0]['actor_name'] = "Hacked"
        
        doc_ref.update({'ledger': ledger}) 
        
        return jsonify({"message" : f"Batch {id} has been hacked (genesis block actor_name set to 'Hacked')"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/history", methods=["GET"])
def get_crate_history():
    batch_uuid = request.args.get('batch_uuid')
    crate_id = request.args.get('crate_id')
    
    if not batch_uuid or not crate_id:
        return jsonify({"error": "batch_uuid and crate_id are required"}), 400

    try:
        doc_ref = db.collection('batches').document(batch_uuid)
        doc = doc_ref.get()
        
        if not doc.exists:
            return jsonify({"error": "Batch not found"}), 404

        batch_data = doc.to_dict()
        ledger = batch_data.get('ledger', [])

        history_list = []
        for block in ledger:
            if block.get('crate_id') is None or block.get('crate_id') == crate_id:
                
                timestamp = block.get('timestamp')
                ts_str = timestamp.isoformat() + "Z" if isinstance(timestamp, datetime) else str(timestamp)
                
                history_list.append({
                    "actor_name": block.get('actor_name'),
                    "action": block.get('action'),
                    "timestamp": ts_str,
                    "latitude": block.get('latitude'),
                    "longitude": block.get('longitude')
                })
                
        return jsonify(history_list)

    except Exception as e:
        print(f"--- ERROR IN /api/history ---: {e}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)