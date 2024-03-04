"""
This module contains functions for querying the database.
"""

import re
from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from ..extensions import bcrypt
from .models import Parent, Child


def get_parent(identifier: str) -> Parent | None:
    """
    Get a parent from the database.

    Args:
        identifier (str): The ID or email of the parent.

    Returns:
        Parent | None: The parent if found, None otherwise.
    """
    try:
        # Regex pattern to check if the identifier is an ID
        uuid_pattern = r"^[0-9a-f]{32}$"

        # If identifier matches ID format, query by ID
        if re.match(uuid_pattern, identifier):
            parent = Parent.query.filter_by(user_id=identifier).first()

        # If identifier does not match ID format, assume it's an email
        else:
            parent = Parent.query.filter_by(email=identifier).first()

        # Return the parent
        return parent
    except Exception as e:
        current_app.logger.error(f"Error fetching user: {e}")
        raise e


def get_child_from_parent(parent_id: str, child_id: str) -> Child | None:
    """
    Get a child from the database for a given parent.

    Args:
        parent_id (str): The ID of the parent.
        child_id (str): The ID of the child.

    Returns:
        Child | None: The child if found, None otherwise.
    """
    try:
        # Get the child
        child = Child.query.filter_by(
            parent_id=parent_id, child_id=child_id
        ).first()

        # Return the child
        return child
    except Exception as e:
        current_app.logger.error(f"Error fetching child: {e}")
        raise e


def check_password(email: str, password: str) -> bool:
    """
    Check if the password is correct for the given user.

    Args:
        email (str): The email of the user.
        password (str): The password to check.

    Returns:
        bool: True if the password is correct,
            False if the password is incorrect or the user does not exist.
    """
    try:

        # Get the parent
        user = Parent.query.filter_by(email=email).first()

        # Return False if the user does not exist
        if not user:
            return False

        # Check the password
        return bcrypt.check_password_hash(user.password, password)
    except SQLAlchemyError as e:
        current_app.logger.error(f"Error checking if user exists: {e}")
        raise e
