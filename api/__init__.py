"""
This module initializes the Flask app and configures it.
"""

import os
from flask import Flask, send_from_directory
from dotenv import load_dotenv

# Note: originally it was planned to use proxy instead of CORS,
# however, Mykhailo and now also Flambeau and Billy have a weird
# issue with the proxy not working properly,
# so we have to use CORS instead

from flask_cors import CORS

from .config import ApplicationConfig, ProductionConfig
from .extensions import bcrypt, jwt
from .database.models import db


def create_app(config=ApplicationConfig) -> Flask:
    """
    Create and configure the Flask app.

    Returns:
        Flask: The configured Flask app.
    """
    # Load the environment variables from the '.env' file
    load_dotenv()

    app = Flask(__name__, static_folder="build", static_url_path="")

    # If the app is in production, use the ProductionConfig
    if os.getenv("FLASK_ENV") == "production":
        config = ProductionConfig

    
    # Load the configuration for the Flask app
    app.config.from_object(config)

    # Initialize the Flask extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Enable CORS for the entire app (see the comment at line 7)
    CORS(app)

    @app.route("/", defaults={'path': ''})
    @app.route('/<path:path>')
    def catch_all(path):
        if path and os.path.exists('build/' + path):
            return send_from_directory('build', path)
        else:
            return send_from_directory('build', 'index.html')

    # Create tables in the database
    with app.app_context():
        db.create_all()

    from .api import api_blueprint

    # Register the 'api' blueprint with the Flask app
    app.register_blueprint(api_blueprint)

    # Return the configured Flask app
    return app
