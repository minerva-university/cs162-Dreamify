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


class ProductionConfig(ApplicationConfig):
    """
    This class contains the configuration for the Flask app in production mode.
    """

    # Check if all database environment variables are set when in production
    if os.getenv("FLASK_ENV") == "production" and (
        not os.getenv("DATABASE_USER")
        or not os.getenv("DATABASE_PASSWORD")
        or not os.getenv("DATABASE_NAME")
    ):
        raise ValueError("Not all database environment variables are set.")

    # Set the SQLAlchemy database URI for the production environment
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{os.getenv('DATABASE_USER')}"
        f":{os.getenv('DATABASE_PASSWORD')}"
        f"@{os.getenv('DATABASE_HOST')}"
        f"{':' + os.getenv('DATABASE_PORT') if os.getenv('DATABASE_HOST') != 'db' else ''}"
        f"/{os.getenv('DATABASE_NAME')}"
    )


class TestingConfig(ApplicationConfig):
    """
    This class contains the configuration for the Flask app in testing mode.
    """

    # Set the testing flag to True
    TESTING = True

    # Set the SQLAlchemy database URI for the testing environment
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "TEST_DATABASE_URI", "sqlite:///:memory:"
    )

    # Disable CSRF protection in testing
    WTF_CSRF_ENABLED = False
