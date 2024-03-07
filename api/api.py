"""
This module contains the API routes for the Dreamify application.
"""

from flask import Blueprint
from flask_restx import Api

# Create a blueprint for the API
api_blueprint = Blueprint("api", __name__, url_prefix="/api")

# Create a Flask RESTX API instance
api = Api(
    api_blueprint,
    version="1.0",
    title="Dreamify API",
    description="A Flask RESTX powered API for Dreamify",
)

from .namespaces.auth import auth
from .namespaces.children import children
from .namespaces.generate import generate

# Add the namespaces to the API
api.add_namespace(auth)
api.add_namespace(children)
api.add_namespace(generate)
