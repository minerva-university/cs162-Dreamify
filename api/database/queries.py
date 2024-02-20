"""
This module contains functions for querying the database.
"""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from .models import Child


def get_child(child_id: str) -> dict[str, str]:
    """
    Get a child from the database.

    Args:
        child_id (str): The ID of the child.

    Raises:
        ValueError: If the child does not exist.

    Returns:
        dict[str, str]: The child data.
    """
    try:
        # Get the child
        child = Child.query.filter_by(child_id=child_id).first()

        if child is None:
            raise ValueError(f"Child with ID '{child_id}' does not exist.")

        # Filter out the private attributes
        child_data = {
            key: value
            for key, value in vars(child).items()
            if not key.startswith("_")
        }

        # Return the child data
        return child_data
    except ValueError as e:
        current_app.logger.error(f"Failed to get child: {e}")
        raise e
    except SQLAlchemyError as e:
        current_app.logger.error(f"Failed to get child: {e}")
        raise e
