"""
This module contains functions for validating input data.
"""

from collections.abc import Iterable
from typing import Any, Type


def validate_type(
    value: Any,
    allowed_types: list[Type],
    field_name: str,
    allow_none: bool = False,
) -> None:
    """
    Validate the type of a value, optionally allowing None.

    Args:
        value (Any): The value to check.
        allowed_types (List[Type]): The allowed types for the value.
        field_name (str): The name of the field (for error messaging).
        allow_none (bool, optional): Whether to allow the value to be None. Defaults to False.

    Raises:
        ValueError: If the value is None and allow_none is False.
        TypeError: If the value is not of the allowed type(s).

    Returns:
        None
    """
    if not allow_none and value is None:
        raise ValueError(f"{field_name} must not be None.")

    if not isinstance(value, tuple(allowed_types)) and not (
        allow_none and value is None
    ):
        allowed_types_str = ", ".join(t.__name__ for t in allowed_types)
        type_msg = f"{field_name} must be of type {allowed_types_str}, found {type(value).__name__}."
        none_msg = " None is allowed." if allow_none else ""
        raise TypeError(type_msg + none_msg)


def validate_non_empty_string(value: str, field_name: str) -> None:
    """
    Ensure a string value is not empty or only whitespace.

    Args:
        value (str): The string value to check.
        field_name (str): The name of the field (for error messaging).

    Raises:
        ValueError: If the value is an empty string or only whitespace.

    Returns:
        None
    """
    validate_type(value, [str], field_name)
    if not value.strip():
        raise ValueError(f"{field_name} must be a non-empty string.")


def validate_list_of_non_empty_strings(
    value_list: list[str],
    field_name: str,
) -> None:
    """
    Validate that each item in a list is a non-empty string.

    Args:
        value_list (list[str]): The list to validate.
        field_name (str): The name of the field, for error messages.

    Raises:
        ValueError: If the list is None when not allowed, or if any item in the list is not a non-empty string.
    """
    if value_list is None:
        raise ValueError(f"{field_name} must not be None.")

    for i, value in enumerate(value_list):
        validate_non_empty_string(value, f"{field_name}[{i}]")


def validate_allowed_value(
    value: Any, allowed_values: Iterable[Any], field_name: str
) -> None:
    """
    Validate that a value is within an allowed set of values.

    Args:
        value (Any): The value to check.
        allowed_values (Iterable): An iterable of allowed values for the value.
        field_name (str): The name of the field (for error messaging).

    Raises:
        ValueError: If the value is not within the allowed set of values.
    """
    if value not in allowed_values:
        allowed_values_str = ", ".join(str(val) for val in allowed_values)
        raise ValueError(
            f"Invalid value for {field_name}: {value}. Must be one of {allowed_values_str}."
        )


def validate_id_format(value: str, field_name: str) -> None:
    """
    Validate that a string is a valid UUID hex string.

    Args:
        value (str): The value to check.
        field_name (str): The name of the field (for error messaging).

    Raises:
        ValueError: If the value is not a valid UUID hex string.
    """
    validate_non_empty_string(value, field_name)
    if len(value) != 32 or not all(c in "0123456789abcdef" for c in value):
        raise ValueError(
            f"{field_name} must be a valid UUID hex string but found '{value}'."
        )
