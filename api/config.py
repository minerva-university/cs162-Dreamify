"""
This module contains the configuration for the Flask app.
"""

import os
from uuid import uuid4
from datetime import timedelta


class ApplicationConfig:
    """
    This class contains the configuration for the Flask app.
    """

    # Set the secret key for the Flask app and JWT
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", uuid4().hex)
    JWT_SECRET_KEY = os.getenv("FLASK_JWT_SECRET_KEY", uuid4().hex)

    # Set the JWT expiration time to the specified number of days
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        days=int(os.getenv("JWT_DAYS_EXPIRATION", 3))
    )

    # Set the default SQLAlchemy database URI
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DEFAULT_DATABASE_URI", "sqlite:///db.sqlite"
    )


class TestingConfig(ApplicationConfig):
    """
    This class contains the configuration for the Flask app in testing mode.
    """

    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "TEST_DATABASE_URI", "sqlite:///:memory:"
    )

    # Disable CSRF protection in testing
    WTF_CSRF_ENABLED = False
