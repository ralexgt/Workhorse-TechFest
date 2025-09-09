from flask import Blueprint, request, jsonify

# Create a blueprint for the routes
app_routes = Blueprint('app_routes', __name__)

@app_routes.route('/home/post-data', methods=['POST'])
def post_data():
    data = request.get_json()

    # Process the data as needed
    # For now, we'll just echo the data back with a success message
    brandCar = data.get('brand')
    odometerCar = data.get('odometer')
    vehicleTypeCar = data.get('vehicletype')
    yearCar = data.get('year')
    obj = {
    "mandatory_first": ["isolate_12v_battery"],
    "selected_order": [
      { "component": "battery",      "pred_time_min": 13.5,  "success_prob": 0.43, "expected_profit_eur": 5.6,  "decision": "reuse"   },
      { "component": "seat_front",   "pred_time_min": 29.59, "success_prob": 0.50, "expected_profit_eur": 7.37, "decision": "reuse"   },
      { "component": "headlight",    "pred_time_min": 26.43, "success_prob": 0.53, "expected_profit_eur": 2.11, "decision": "reuse"   },
      { "component": "mirror_side",  "pred_time_min": 20.56, "success_prob": 0.19, "expected_profit_eur": 0.84, "decision": "recycle" }
    ],
    "skipped": {
      "bumper": "negative expected profit",
      "door_front": "negative expected profit",
      "door_rear": "negative expected profit",
      "radiator": "negative expected profit",
      "starter": "negative expected profit",
      "alternator": "would exceed 90-min budget after higher ROI picks"
    },
    "totals": { "time_min": 90.08, "expected_profit_eur": 15.93 },
    "vehicle": { "brand": brandCar, "model": 'Model', "year": yearCar, "vehicletype": vehicleTypeCar, "odometer_km": odometerCar },
    "ui": { "time_budget_min": 90 }
    }

    return jsonify(obj), 200