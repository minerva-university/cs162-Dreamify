"""
This module contains functions for inserting data into the database.
"""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from ..extensions import bcrypt
from .models import db, Parent, Child


def insert_parent(
    first_name: str, last_name: str, email: str, password: str
) -> str:
    """
    Insert a parent into the database.

    Args:
        first_name (str): The first name of the parent.
        last_name (str): The last name of the parent.
        email (str): The email of the parent.
        password (str): The password of the parent.

    Raises:
        ValueError: If the parent already exists.
        SQLAlchemyError: If an error occurs with the database.

    Returns:
        str: The ID of the parent.
    """
    try:
        # Check if a parent with this email already exists
        if Parent.query.filter_by(email=email).first() is not None:
            raise ValueError(f"User with email '{email}' already exists.")

        # Hash the parent's password
        hashed_password = bcrypt.generate_password_hash(password).decode(
            "utf-8"
        )

        # Create a parent
        parent = Parent(
            first_name=first_name,
            last_name=last_name,
            password=hashed_password,
            email=email,
        )

        # Add the parent to the session and commit
        db.session.add(parent)
        db.session.commit()

        # Return the ID of the parent
        return parent.user_id

    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f"Failed to add parent: {e}")
        raise e
    except Exception as e:
        current_app.logger.error(f"Failed to add parent: {e}")
        raise e


def insert_child(
    parent_id: str,
    name: str,
    age_range: str,
    sex: str,
    sibling_relationship: str,
    eye_color: str,
    hair_type: str,
    hair_color: str,
    skin_tone: str,
    fav_animals: str | None = None,
    fav_activities: str | None = None,
    fav_shows: str | None = None,
) -> str:
    """
    Insert a child into the database.

    Args:
        parent_id (str): The ID of the parent.
        name (str): The name of the child.
        age_range (str): The age range of the child.
        sex (str): The sex of the child.
        sibling_relationship (str): The sibling relationship of the child.
        eye_color (str): The eye color of the child.
        hair_type (str): The hair type of the child.
        hair_color (str): The hair color of the child.
        skin_tone (str): The skin tone of the child.
        fav_animals (str | None): The child's favorite animals. Optional.
        fav_activities (str | None): The child's favorite activities. Optional.
        fav_shows (str | None): The child's favorite shows. Optional.

    Raises:
        ValueError: If the parent does not exist.

    Returns:
        str: The ID of the child.
    """
    try:
        # Check if the parent exists
        if Parent.query.filter_by(user_id=parent_id).first() is None:
            raise ValueError(f"Parent with ID '{parent_id}' does not exist.")

        # Create a child
        child = Child(
            parent_id=parent_id,
            name=name,
            age_range=age_range,
            sex=sex,
            sibling_relationship=sibling_relationship,
            eye_color=eye_color,
            hair_type=hair_type,
            hair_color=hair_color,
            skin_tone=skin_tone,
            fav_animals=fav_animals,
            fav_activities=fav_activities,
            fav_shows=fav_shows,
        )

        # Add the child to the session and commit the changes
        db.session.add(child)
        db.session.commit()

        # Return the ID of the child
        return child.child_id

    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f"Failed to add child: {e}")
        raise e
    except Exception as e:
        current_app.logger.error(f"Failed to add child: {e}")
        raise e
