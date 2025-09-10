import json
from pathlib import Path
from flask import Blueprint, request, jsonify

import models as models_pkg
from models.inference import create_inference

# Blueprint
app_routes = Blueprint('app_routes', __name__)

# Resolve: <repo>/backend-python/models/artifacts2
ARTIFACTS_DIR = Path(models_pkg.__file__).resolve().parent / "artifacts2"

@app_routes.post('/post-data')
def post_data():
    data = request.get_json() or {}

    brand = data.get('brand')
    odometer = data.get('odometer')
    vehicle_type = data.get('vehicletype')
    year = data.get('year')
    time_budget_min = data.get('timebudget')

    # Pass the resolved artifacts dir
    obj = create_inference(data, artifacts_dir=str(ARTIFACTS_DIR))
    obj["vehicle"] = {
        "brand": brand,
        "year": year,
        "vehicletype": vehicle_type,
        "odometer_km": odometer
    }
    obj["ui"] = {"time_budget_min": time_budget_min}

    return jsonify(obj), 200

@app_routes.post('/test-connection')
def test_connection():
    data = request.get_json() or {}
    return jsonify({'message': 'Data received successfully', 'received_data': data}), 200

@app_routes.get("/health")
def health():
    return {"status": "ok"}, 200
