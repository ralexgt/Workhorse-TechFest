import os
from flask import Flask
from flask_cors import CORS
from app.routes import app_routes

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    app.register_blueprint(app_routes, url_prefix='/api')  
    return app

# Expose a module-level WSGI app for Gunicorn: "main:app"
# no no no no
app = create_app()

if __name__ == "__main__":
    # Local/dev run: bind to 0.0.0.0 and use Azure's PORT if present
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
