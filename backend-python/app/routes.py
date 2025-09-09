import json
from flask import Blueprint, request, jsonify

from ..models.inference import create_inference

# Create a blueprint for the routes
app_routes = Blueprint('app_routes', __name__)


@app_routes.post('/post-data')
def post_data():
    data = request.get_json()

    # Process the data as needed
    brand = data.get('brand')
    odometer = data.get('odometer')
    vehicle_type = data.get('vehicletype')
    year = data.get('year')
    time_budget_min = data.get('timebudget')

    obj = create_inference(data, artifacts_dir="backend-python/models/artifacts")
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
    data = request.get_json()

    # Process the data as needed
    # For now, we'll just echo the data back with a success message
    response = {
        'message': 'Data received successfully',
        'received_data': data
    }

    return jsonify(response), 200

# ---- Health check route ----
@app_routes.get("/health")
def health():
    return {"status": "ok"}, 200