"""
This module contains functions for inserting data into the database.
"""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from .models import db, Parent, Child


def insert_child(data: dict[str, str]) -> str:
    """
    Insert a child into the database.

    Args:
        data (dict[str, str]): The child data.

    Raises:
        ValueError: If the parent does not exist.
        SQLAlchemyError: If an error occurs with the database.

    Returns:
        str: The ID of the child.
    """
    try:
        # Check if the parent exists
        if Parent.query.filter_by(user_id=data["parent_id"]).first() is None:
            raise ValueError(
                f"Parent with ID '{data['parent_id']}' does not exist."
            )

        # Create a child
        child = Child(
            parent_id=data["parent_id"],
            name=data["name"],
            age_range=data["age_range"],
            sex=data["sex"],
            sibling_relationship=data["sibling_relationship"],
            eye_color=data["eye_color"],
            hair_type=data["hair_type"],
            hair_color=data["hair_color"],
            skin_tone=data["skin_tone"],
            fav_animals=data.get("fav_animals", None),
            fav_activities=data.get("fav_activities", None),
            fav_shows=data.get("fav_shows", None),
        )

        # Add the child to the session and commit
        db.session.add(child)
        db.session.commit()

        # Return the ID of the child
        return child.child_id

    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f"Failed to add child: {e}")
        raise e
