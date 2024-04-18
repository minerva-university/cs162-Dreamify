"""
This module contains functions for updating the database.
"""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from ..functions.input_validation import (
    validate_non_empty_string,
    validate_type,
    validate_allowed_value,
)
from .models import db, Child


def update_child(
    child_id: str,
    name: str,
    age_range: str,
    sex: str,
    eye_color: str,
    hair_type: str,
    hair_color: str,
    ethnicity: str,
    fav_animals: str | None = None,
    fav_activities: str | None = None,
    fav_shows: str | None = None,
) -> Child:
    """
    Update a child in the database.

    Args:
        child_id (str): The ID of the child.
        name (str): The name of the child.
        age_range (str): The age range of the child.
        sex (str): The sex of the child.
        eye_color (str): The eye color of the child.
        hair_type (str): The hair type of the child.
        hair_color (str): The hair color of the child.
        ethnicity (str): The ethnicity of the child.
        fav_animals (str, optional): The favorite animals of the child.
        fav_activities (str, optional): The favorite activities of the child.
        fav_shows (str, optional): The favorite shows of the child.

    Returns:
        Child: The updated child.
    """
    # Validation constants
    valid_age_ranges = ["0-3", "4-6", "7-9", "10-13"]
    valid_sexes = ["Male", "Female"]
    valid_eye_colors = ["Blue", "Brown", "Green", "Hazel", "Amber", "Gray"]
    valid_hair_types = ["Straight", "Wavy", "Curly", "Kinky", "Bald"]
    valid_hair_colors = [
        "Blonde",
        "Brown",
        "Black",
        "Red",
        "Auburn",
        "Gray",
        "White",
        "Bald",
    ]
    try:
        # Check if the child exists
        child = Child.query.filter_by(child_id=child_id).first()

        # Return an error if the child does not exist
        if child is None:
            raise ValueError(f"Child with ID '{child_id}' does not exist.")

        # Validate required fields
        validate_non_empty_string(name, "name")
        validate_non_empty_string(age_range, "age_range")
        validate_non_empty_string(sex, "sex")
        validate_non_empty_string(eye_color, "eye_color")
        validate_non_empty_string(hair_type, "hair_type")
        validate_non_empty_string(hair_color, "hair_color")
        validate_non_empty_string(ethnicity, "ethnicity")

        # Validate optional fields with allowance for None
        validate_type(fav_animals, [str], "fav_animals", allow_none=True)
        validate_type(fav_activities, [str], "fav_activities", allow_none=True)
        validate_type(fav_shows, [str], "fav_shows", allow_none=True)

        # Validate allowed values
        validate_allowed_value(age_range, valid_age_ranges, "age_range")
        validate_allowed_value(sex, valid_sexes, "sex")
        validate_allowed_value(eye_color, valid_eye_colors, "eye_color")
        validate_allowed_value(hair_type, valid_hair_types, "hair_type")
        validate_allowed_value(hair_color, valid_hair_colors, "hair_color")

        # Update the child attributes
        child.name = name
        child.age_range = age_range
        child.sex = sex
        child.eye_color = eye_color
        child.hair_type = hair_type
        child.hair_color = hair_color
        child.ethnicity = ethnicity
        child.fav_animals = fav_animals
        child.fav_activities = fav_activities
        child.fav_shows = fav_shows

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
