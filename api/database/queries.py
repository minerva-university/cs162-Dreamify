"""
This module contains functions for querying the database.
"""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from .models import Parent, Child


def get_current_parent() -> dict[str, str]:
    """
    Get the current parent from the database. Currently returns the newest created parent.

    Raises:
        ValueError: If no parent exists.

    Returns:
        dict[str, str]: The parent data.
    """
    try:
        # Get the parent
        parents = Parent.query.all()

        # Check if parents exists
        if parents is None:
            raise ValueError("No parents exists.")

        # Get the newest parent
        # TODO: Change this to get the current user once authentication is implemented
        parent = parents[-1]

        # Filter out the private attributes
        parent_data = {
            key: value
            for key, value in vars(parent).items()
            if not key.startswith("_")
        }

        # Return the parent data
        return parent_data
    except ValueError as e:
        current_app.logger.error(f"Failed to get parent: {e}")
        raise e
    except SQLAlchemyError as e:
        current_app.logger.error(f"Failed to get parent: {e}")
        raise e


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
