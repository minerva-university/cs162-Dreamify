"""
This module contains helper functions for the Flask backend.
"""

from flask import current_app
from flask_jwt_extended import get_jwt_identity

from ..database.models import Parent
from ..database.queries import get_parent


def get_current_parent() -> Parent | None:
    """
    Get the current parent from the database if the parent is logged in.

    Returns:
        Parent: The current parent.
    """
    try:
        # Get the current parent's ID
        current_parent_id = get_jwt_identity()

        # Get the current parent from the database
        parent = get_parent(current_parent_id)

        # Return the current parent
        return parent
    except Exception as e:
        current_app.logger.error(f"Error fetching current user: {e}")
        raise e
