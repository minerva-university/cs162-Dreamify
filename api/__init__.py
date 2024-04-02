"""
This module initializes the Flask app and configures it.
"""

from flask import Flask

# Note: originally it was planned to use proxy instead of CORS,
# however, Mykhailo and now also Flambeau and Billy have a weird
# issue with the proxy not working properly,
# so we have to use CORS instead

from flask_cors import CORS

from .config import ApplicationConfig
from .extensions import bcrypt, jwt
from .database.models import db


def create_app(config=ApplicationConfig) -> Flask:
    """
    Create and configure the Flask app.

    Returns:
        Flask: The configured Flask app.
    """
    app = Flask(__name__, static_folder="../build", static_url_path="/")

    # Load the configuration for the Flask app
    app.config.from_object(config)

    # Initialize the Flask extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Enable CORS for the entire app (see the comment at line 7)
    CORS(app)

    # Create tables in the database
    with app.app_context():
        db.create_all()

    from .api import api_blueprint

    # Register the 'api' blueprint with the Flask app
    app.register_blueprint(api_blueprint)

    # Return the configured Flask app
    return app
