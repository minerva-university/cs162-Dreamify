"""
This module contains the configuration for the Flask app.
"""

from datetime import timedelta


class ApplicationConfig:
    """
    This class contains the configuration for the Flask app.
    """

    # Set the secret key for the Flask app and JWT
    # (I'd use an environment variable in production, but for testing purposes,
    # I'll use a hardcoded string for simplicity. This is not secure!)
    # TODO: Use an environment variable for the secret key
    SECRET_KEY = "dev"
    JWT_SECRET_KEY = "dev"

    # Set the JWT expiration time to 3 days
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=3)

    # Set the SQLAlchemy database URI
    SQLALCHEMY_DATABASE_URI = "sqlite:///db.sqlite"
