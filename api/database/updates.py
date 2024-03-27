"""
This module contains functions for updating the database.
"""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from .models import db, Child


def child_belongs_to_parent(parent_id: str, child_id: str) -> bool:
    """
    Check if a child belongs to a parent.

    Args:
        parent_id (str): The ID of the parent.
        child_id (str): The ID of the child.

    Returns:
        bool: True if the child belongs to the parent, False otherwise.
    """
    try:
        # Get the child
        child = Child.query.filter_by(
            parent_id=parent_id, child_id=child_id
        ).first()

        # Return True if the child exists, False otherwise
        return child is not None
    except SQLAlchemyError as e:
        current_app.logger.error(
            f"Failed to check if child belongs to parent: {e}"
        )
        raise e
    except Exception as e:
        current_app.logger.error(
            f"Failed to check if child belongs to parent: {e}"
        )
        raise e


def update_child(
    child_id: str,
    updates: dict[str, str | int | None],
) -> Child:
    """
    Update a child in the database.

    Args:
        child_id (str): The ID of the child.

    Returns:
        Child: The updated child.
    """
    try:
        # Check if the child exists
        child = Child.query.filter_by(child_id=child_id).first()

        # Return an error if the child does not exist
        if child is None:
            raise ValueError(f"Child with ID '{child_id}' does not exist.")

        # Update the child attributes
        for attr, value in updates.items():
            setattr(child, attr, value)

        # Commit the changes
        db.session.commit()

        # Return the updated child
        return child
    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f"Failed to update child: {e}")
        raise e
    except Exception as e:
        current_app.logger.error(f"Failed to update child: {e}")
        raise e
