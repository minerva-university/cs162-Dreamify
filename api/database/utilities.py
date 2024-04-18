"""
This module contains utility functions for the database.
"""

from flask import current_app
from uuid import uuid4
from sqlalchemy.inspection import inspect
from typing import Any


def generate_id() -> str:
    """
    Generate a unique ID.

    Returns:
        str: The generated ID.
    """
    try:
        return uuid4().hex
    except Exception as e:
        current_app.logger.error(f"Failed to generate ID: {e}")
        raise e


def get_entry_attributes(
    entry,
    *,
    exclude: list[str] | None = None,
    transform_to_str: bool = True,
) -> dict[str, Any]:
    """
    Get the attributes of the given database entry.

    Args:
        entry: The database entry, expected to be an instance of a model.
        exclude (list[str], optional): The attributes to exclude.
        transform_to_str (bool, optional): Whether to transform
            all the attributes to strings.

    Raises:
        sqlalchemy.exc.NoInspectionAvailable: If the given subject
            does not correspond to a known SQLAlchemy inspected type

    Returns:
        dict: The attributes of the entry.
    """

    print("HAHAHAHAHAHA")
    try:
        # Get the attributes of the entry
        attributes = {
            attr.key: getattr(entry, attr.key)
            for attr in inspect(entry, raiseerr=True).mapper.column_attrs
        }

        # Remove the excluded attributes
        if exclude is not None:
            for key in exclude:
                attributes.pop(key, None)

        # Transform the attributes to strings if the flag is set
        if transform_to_str:
            for key, value in attributes.items():
                # Exclude None and integer values
                if value is not None and not isinstance(value, int):
                    attributes[key] = str(value)

        # Return the attributes
        return attributes
    except Exception as e:
        current_app.logger.error(f"Failed to get entry attributes: {e}")
        raise e
