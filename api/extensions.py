"""
This module contains the extensions used in the Flask backend.
"""

from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

# Create instances of the Bcrypt and JWTManager classes
bcrypt = Bcrypt()
jwt = JWTManager()
