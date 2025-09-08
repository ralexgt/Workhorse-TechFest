from flask import Blueprint, request, jsonify

# Create a blueprint for the routes
app_routes = Blueprint('app_routes', __name__)

@app_routes.route('/home/post-data', methods=['POST'])
def post_data():
    data = request.get_json()

    # Process the data as needed
    # For now, we'll just echo the data back with a success message
    response = {
        'message': 'Data received successfully',
        'received_data': data
    }

    return jsonify(response), 200