"""
This module contains functions for querying the database.
"""

import re
from flask import current_app
from email_validator import validate_email, EmailNotValidError

from ..extensions import bcrypt
from ..functions.input_validation import (
    validate_non_empty_string,
    validate_id_format,
    validate_type,
)
from .models import Parent, Child, Story


def get_parent(identifier: str) -> Parent | None:
    """
    Get a parent from the database.

    Args:
        identifier (str): The ID or email of the parent.

    Returns:
        Parent | None: The parent if found, None otherwise.
    """
    try:
        # Validate the identifier is a non-empty string
        validate_non_empty_string(identifier, "identifier")

        # Regex pattern to check if the identifier is an ID
        uuid_pattern = r"^[0-9a-f]{32}$"

        # If identifier matches ID format, query by ID
        if re.match(uuid_pattern, identifier):
            parent = Parent.query.filter_by(user_id=identifier).first()

        # If identifier does not match ID format, assume it's an email
        else:
            validate_email(identifier)
            parent = Parent.query.filter_by(email=identifier).first()

        # Return the parent
        return parent
    except EmailNotValidError as e:
        raise ValueError(
            f"Invalid identifier, must be either an ID or email, but found: '{identifier}'"
        )
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
        # Validate the input types
        validate_type(parent_id, [str], "parent_id")
        validate_type(child_id, [str], "child_id")

        # Validate the parent ID
        validate_id_format(parent_id, "parent_id")

        # Validate the child ID
        validate_id_format(child_id, "child_id")

        # Get the child
        child = Child.query.filter_by(
            parent_id=parent_id, child_id=child_id
        ).first()

        # Return the child
        return child
    except Exception as e:
        current_app.logger.error(f"Error fetching child: {e}")
        raise e


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
        # Validate the parent ID
        validate_id_format(parent_id, "parent_id")

        # Validate the child ID
        validate_id_format(child_id, "child_id")

        # Get the child
        child = Child.query.filter_by(
            parent_id=parent_id, child_id=child_id
        ).first()

        # Return True if the child exists, False otherwise
        return child is not None
    except Exception as e:
        current_app.logger.error(
            f"Failed to check if child belongs to parent: {e}"
        )
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
        # Validate the email type and format
        validate_non_empty_string(email, "email")

        # Validate the email
        validate_email(email)

        # Validate the password
        validate_non_empty_string(password, "password")

        # Get the parent
        user = Parent.query.filter_by(email=email).first()

        # Return False if the user does not exist
        if not user:
            return False

        # Check the password
        return bcrypt.check_password_hash(user.password, password)
    except EmailNotValidError as e:
        raise ValueError(f"Invalid email: {e}")
    except Exception as e:
        current_app.logger.error(f"Error checking password: {e}")
        raise e


def get_story(story_id: str) -> Story | None:
    """
    Get a story from the database.

    Args:
        story_id (str): The ID of the story.

    Returns:
        Story | None: The story if found, None otherwise.
    """
    try:
        # Validate the story ID
        validate_id_format(story_id, "story_id")

        # Get the story
        story = Story.query.filter_by(story_id=story_id).first()

        # Return the story
        return story
    except Exception as e:
        current_app.logger.error(f"Error fetching story: {e}")
        raise e
