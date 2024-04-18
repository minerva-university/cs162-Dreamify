"""
This module contains tests for the database queries.
"""

import pytest
from typing import Any

from api.database.models import Parent, Child, Story
from api.database.queries import (
    get_parent,
    get_child_from_parent,
    child_belongs_to_parent,
    check_password,
    get_story,
)
from api.database.utilities import generate_id


class TestGetParent:
    """
    Test the get_parent query.
    """

    @staticmethod
    def test_success(parent: Parent) -> None:
        """
        Test the get_parent query when the parent exists.
        """
        # Get the parent from the database
        retrieved_parent = get_parent(parent.user_id)

        assert retrieved_parent.user_id == parent.user_id

    @staticmethod
    def test_get_parent_no_parent() -> None:
        """
        Test the get_parent query when the parent does not exist.
        """
        # Get the parent from the database by a nonexistent email
        retrieved_parent1 = get_parent("nonexistent.parent@gmail.com")

        # Get the parent from the database by a nonexistent user_id
        retrieved_parent2 = get_parent(generate_id())

        # Assert that the parents are None
        assert retrieved_parent1 is None
        assert retrieved_parent2 is None

    @staticmethod
    def test_get_parent_invalid_input() -> None:
        """
        Test the get_parent query with invalid input.
        """
        with pytest.raises(ValueError) as exc_info:
            # Attempt to get the parent from the database by an invalid email
            get_parent("invalid_email")

        assert (
            str(exc_info.value)
            == "Invalid identifier, must be either an ID or email, but found: 'invalid_email'"
        )

    @staticmethod
    def test_none() -> None:
        """
        Test the get_parent query with None as input.
        """
        with pytest.raises(ValueError) as exc_info:
            get_parent(None)

        assert "must not be None" in str(exc_info.value)

    @pytest.mark.parametrize(
        "input_value", [1, 1.0, True, False, [], {}, set()]
    )
    def test_invalid_type(self, input_value: Any) -> None:
        """
        Test the get_parent query with an invalid type as input.
        """
        with pytest.raises(TypeError) as exc_info:
            get_parent(input_value)

        assert "must be of type str" in str(exc_info.value)


class TestGetChildFromParent:
    """
    Test the get_child_from_parent query.
    """

    @staticmethod
    def test_success(parent: Parent, child: Child) -> None:
        """
        Test the get_child_from_parent query when the child exists.
        """
        # Get the child from the database
        retrieved_child = get_child_from_parent(parent.user_id, child.child_id)

        assert retrieved_child.child_id == child.child_id

    @staticmethod
    def test_no_child(parent: Parent, child: Child) -> None:
        """
        Test the get_child_from_parent query when the child does not exist.
        """
        # Get the child from the database by a nonexistent child_id
        retrieved_child1 = get_child_from_parent(parent.user_id, generate_id())

        # Get the child from the database by a nonexistent parent_id
        retrieved_child2 = get_child_from_parent(generate_id(), child.child_id)

        # Assert that the children are None
        assert retrieved_child1 is None
        assert retrieved_child2 is None

    @staticmethod
    def test_invalid_input(parent: Parent) -> None:
        """
        Test the get_child_from_parent query with invalid input.
        """
        with pytest.raises(ValueError) as exc_info:
            get_child_from_parent(parent.user_id, "invalid_child_id")

        assert (
            "must be a valid UUID hex string but found 'invalid_child_id'"
            in str(exc_info.value)
        )

    @pytest.mark.parametrize(
        "parent_id,child_id",
        [
            (generate_id(), None),
            (None, generate_id()),
            (None, None),
        ],
    )
    def test_nones(self, parent_id: str | None, child_id: str | None) -> None:
        """
        Test the get_child_from_parent query with None as input.
        """
        with pytest.raises(ValueError) as exc_info:
            get_child_from_parent(parent_id, child_id)

        assert "must not be None" in str(exc_info.value)

    @pytest.mark.parametrize(
        "parent_id,child_id",
        [
            (1, generate_id()),
            (1.0, generate_id()),
            (True, generate_id()),
            (False, generate_id()),
            ([], generate_id()),
            ({}, generate_id()),
            (set(), generate_id()),
            (generate_id(), 1),
            (generate_id(), 1.0),
            (generate_id(), True),
            (generate_id(), False),
            (generate_id(), []),
            (generate_id(), {}),
            (generate_id(), set()),
        ],
    )
    def test_invalid_types(self, parent_id: Any, child_id: Any) -> None:
        """
        Test the get_child_from_parent query with invalid types as input.
        """
        with pytest.raises(TypeError) as exc_info:
            get_child_from_parent(parent_id, child_id)

        assert "must be of type str" in str(exc_info.value)


class TestChildBelongsToParent:
    """
    Test the child_belongs_to_parent query.
    """

    @staticmethod
    def test_success(parent: Parent, child: Child) -> None:
        """
        Test the child_belongs_to_parent query when the child belongs to the parent.
        """
        assert child_belongs_to_parent(parent.user_id, child.child_id)

    @staticmethod
    def test_no_child(parent: Parent) -> None:
        """
        Test the child_belongs_to_parent query when the child does not belong to the parent.
        """
        assert not child_belongs_to_parent(parent.user_id, generate_id())

    @staticmethod
    def test_no_parent(child: Child) -> None:
        """
        Test the child_belongs_to_parent query when the parent does not exist.
        """
        assert not child_belongs_to_parent(generate_id(), child.child_id)

    @staticmethod
    def test_invalid_input() -> None:
        """
        Test the child_belongs_to_parent query with invalid input.
        """
        with pytest.raises(ValueError) as exc_info:
            child_belongs_to_parent("invalid_parent_id", "invalid_child_id")

        assert (
            "must be a valid UUID hex string but found 'invalid_parent_id'"
            in str(exc_info.value)
        )

    @pytest.mark.parametrize(
        "parent_id,child_id",
        [
            (generate_id(), None),
            (None, generate_id()),
            (None, None),
        ],
    )
    def test_nones(self, parent_id: str | None, child_id: str | None) -> None:
        """
        Test the child_belongs_to_parent query with None as input.
        """
        with pytest.raises(ValueError) as exc_info:
            child_belongs_to_parent(parent_id, child_id)

        assert "must not be None" in str(exc_info.value)

    @pytest.mark.parametrize(
        "parent_id,child_id",
        [
            (1, generate_id()),
            (1.0, generate_id()),
            (True, generate_id()),
            (False, generate_id()),
            ([], generate_id()),
            ({}, generate_id()),
            (set(), generate_id()),
            (generate_id(), 1),
            (generate_id(), 1.0),
            (generate_id(), True),
            (generate_id(), False),
            (generate_id(), []),
            (generate_id(), {}),
            (generate_id(), set()),
        ],
    )
    def test_invalid_types(self, parent_id: Any, child_id: Any) -> None:
        """
        Test the child_belongs_to_parent query with invalid types as input.
        """
        with pytest.raises(TypeError) as exc_info:
            child_belongs_to_parent(parent_id, child_id)

        assert "must be of type str" in str(exc_info.value)


class TestCheckPassword:
    """
    Test the check_password query.
    """

    @staticmethod
    def test_success(parent: Parent) -> None:
        """
        Test the check_password query when the password is correct.
        """
        assert check_password(parent.email, "password")

    @staticmethod
    def test_no_parent() -> None:
        """
        Test the check_password query when the parent does not exist.
        """

        assert not check_password("unused.email@gmail.com", "password")

    @staticmethod
    def test_invalid_password(parent: Parent) -> None:
        """
        Test the check_password query when the password is incorrect.
        """
        assert not check_password(parent.email, "incorrect_password")

    @staticmethod
    def test_invalid_input() -> None:
        """
        Test the check_password query with invalid input.
        """
        with pytest.raises(ValueError) as exc_info:
            check_password("invalid_email", "password")

        assert "Invalid email" in str(exc_info.value)

    @pytest.mark.parametrize(
        "email,password",
        [
            (None, "password"),
            ("none@gmail.com", None),
            (None, None),
        ],
    )
    def test_nones(self, email: str | None, password: str | None) -> None:
        """
        Test the check_password query with None as input.
        """
        with pytest.raises(ValueError) as exc_info:
            check_password(email, password)

        assert "must not be None" in str(exc_info.value)

    @pytest.mark.parametrize(
        "email,password",
        [
            (1, "password"),
            (1.0, "password"),
            (True, "password"),
            (False, "password"),
            ([], "password"),
            ({}, "password"),
            (set(), "password"),
            ("invalid.types@gmail.com", 1),
            ("invalid.types@gmail.com", 1.0),
            ("invalid.types@gmail.com", True),
            ("invalid.types@gmail.com", False),
            ("invalid.types@gmail.com", []),
            ("invalid.types@gmail.com", {}),
            ("invalid.types@gmail.com", set()),
        ],
    )
    def test_invalid_types(self, email: Any, password: Any) -> None:
        """
        Test the check_password query with invalid types as input.
        """
        with pytest.raises(TypeError) as exc_info:
            check_password(email, password)

        assert "must be of type str" in str(exc_info.value)


class TestGetStory:
    """
    Test the get_story query.
    """

    @staticmethod
    def test_success(story: Story) -> None:
        """
        Test the get_story query when the story exists.
        """
        # Get the story from the database
        retrieved_story = get_story(story.story_id)

        assert retrieved_story.story_id == story.story_id

    @staticmethod
    def test_no_story() -> None:
        """
        Test the get_story query when the story does not exist.
        """
        # Get the story from the database by a nonexistent story_id
        retrieved_story = get_story(generate_id())

        # Assert that the story is None
        assert retrieved_story is None

    @staticmethod
    def test_invalid_input() -> None:
        """
        Test the get_story query with invalid input.
        """
        with pytest.raises(ValueError) as exc_info:
            # Attempt to get the story from the database by an invalid story_id
            get_story("invalid_story_id")

        assert (
            "must be a valid UUID hex string but found 'invalid_story_id'"
            in str(exc_info.value)
        )

    @staticmethod
    def test_none() -> None:
        """
        Test the get_story query with None as input.
        """
        with pytest.raises(ValueError) as exc_info:
            get_story(None)

        assert "must not be None" in str(exc_info.value)

    @pytest.mark.parametrize(
        "input_value", [1, 1.0, True, False, [], {}, set()]
    )
    def test_invalid_type(self, input_value: Any) -> None:
        """
        Test the get_story query with an invalid type as input.
        """
        with pytest.raises(TypeError) as exc_info:
            get_story(input_value)

        assert "must be of type str" in str(exc_info.value)
