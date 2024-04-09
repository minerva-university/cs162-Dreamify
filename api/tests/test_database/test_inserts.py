"""
This module contains tests for the database inserts.
"""

import pytest
from flask import Flask
from typing import Any

from api.database.inserts import insert_parent, insert_child, insert_story
from api.database.models import Parent, Child, Story
from api.extensions import bcrypt


class TestInsertParent:
    """
    This class contains tests for the insert_parent function.
    """

    @staticmethod
    def test_success(app: Flask) -> None:
        """
        Test successful insertion of a parent.
        """
        with app.app_context():
            first_name = "Success"
            last_name = "Test"
            email = "success@gmail.com"
            password = "password"

            # Insert a parent
            new_parent = insert_parent(
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password,
            )

            # Check if the parent was inserted successfully
            parent = Parent.query.filter_by(email=email).first()

            assert parent is not None
            assert parent.first_name == first_name
            assert parent.last_name == last_name
            assert parent.email == email
            assert new_parent.password != password
            assert bcrypt.check_password_hash(new_parent.password, password)

    @staticmethod
    def test_duplicate_email(app: Flask) -> None:
        """
        Test insertion of a parent with a duplicate email.
        """
        with app.app_context():
            email = "duplicate@gmail.com"
            password = "password"

            # Insert a parent with the email
            insert_parent(
                first_name="Test",
                last_name="Test",
                email=email,
                password=password,
            )

            # Attempt to insert another parent with the same email
            with pytest.raises(ValueError) as exc_info:
                insert_parent(
                    first_name="Duplicate",
                    last_name="Duplicate",
                    email=email,
                    password=password,
                )

            assert "already exists" in str(exc_info.value)

    @staticmethod
    def test_invalid_email(app: Flask) -> None:
        """
        Test insertion of a parent with an invalid email.
        """
        with app.app_context():
            # Attempt to insert a parent with an invalid email
            with pytest.raises(ValueError) as exc_info:
                insert_parent(
                    first_name="Invalid",
                    last_name="Email",
                    email="invalid_email",
                    password="password",
                )

            assert "Invalid email" in str(exc_info.value)

    @pytest.mark.parametrize(
        "first_name,last_name,email,password",
        [
            (123, "Doe", "incorrect.types@gmail.com", "password"),
            (123.456, "Doe", "incorrect.types@gmail.com", "password"),
            (["John"], "Doe", "incorrect.types@gmail.com", "password"),
            ("John", 123, "incorrect.types@gmail.com", "password"),
            ("John", 123.456, "incorrect.types@gmail.com", "password"),
            ("John", ["Doe"], "incorrect.types@gmail.com", "password"),
            ("John", "Doe", 123, "password"),
            ("John", "Doe", 123.456, "password"),
            ("John", "Doe", ["incorrect.types@gmail.com"], "password"),
            ("John", "Doe", "incorrect.types@gmail.com", 123),
            ("John", "Doe", "incorrect.types@gmail.com", 123.456),
            ("John", "Doe", "incorrect.types@gmail.com", ["password"]),
        ],
    )
    def test_incorrect_types(
        self,
        app: Flask,
        first_name: str,
        last_name: str,
        email: str,
        password: str,
    ) -> None:
        """
        Test insertion of a parent with incorrect types.
        """
        with app.app_context():
            with pytest.raises(TypeError) as exc_info:
                insert_parent(first_name, last_name, email, password)

            assert "must be of type" in str(exc_info.value)

    @pytest.mark.parametrize(
        "first_name,last_name,email,password",
        [
            ("", "Doe", "empty.values@gmail.com", "password"),
            ("John", "", "empty.values@gmail.com", "password"),
            ("John", "Doe", "", "password"),
            ("John", "Doe", "empty.values@gmail.com", ""),
        ],
    )
    def test_empty_values(
        self,
        app: Flask,
        first_name: str,
        last_name: str,
        email: str,
        password: str,
    ) -> None:
        """
        Test if function rejects empty values for all variables.
        """
        with app.app_context():
            with pytest.raises(ValueError) as exc_info:
                insert_parent(first_name, last_name, email, password)

            assert "non-empty" in str(exc_info.value)

    @pytest.mark.parametrize(
        "first_name,last_name,email,password",
        [
            (None, "Doe", "none.values@gmail.com", "password"),
            ("John", None, "none.values@gmail.com", "password"),
            ("John", "Doe", None, "password"),
            ("John", "Doe", "none.values@gmail.com", None),
        ],
    )
    def test_none_values(
        self,
        app: Flask,
        first_name: str,
        last_name: str,
        email: str,
        password: str,
    ) -> None:
        """
        Test if function rejects None values for all variables.
        """
        with app.app_context():
            with pytest.raises(ValueError) as exc_info:
                insert_parent(first_name, last_name, email, password)

            assert "must not be None" in str(exc_info.value)


class TestInsertChild:
    """
    This class contains tests for the insert_child function.
    """

    @staticmethod
    def test_success(app: Flask, parent: Parent) -> None:
        """
        Test successful insertion of a child.
        """
        with app.app_context():
            name = "ChildSuccess"
            image = "base64imagestring=="
            age_range = "0-3"
            sex = "Male"
            eye_color = "Amber"
            hair_type = "Straight"
            hair_color = "Blonde"
            ethnicity = "White"
            fav_animals = "Cats"
            fav_activities = "Swimming"
            fav_shows = "Action Show"

            # Insert a child
            insert_child(
                parent_id=parent.user_id,
                name=name,
                image=image,
                age_range=age_range,
                sex=sex,
                eye_color=eye_color,
                hair_type=hair_type,
                hair_color=hair_color,
                ethnicity=ethnicity,
                fav_animals=fav_animals,
                fav_activities=fav_activities,
                fav_shows=fav_shows,
            )

            # Check if the child was inserted successfully
            child = Child.query.filter_by(name=name).first()

            assert child is not None
            assert child.parent_id == parent.user_id
            assert child.name == name
            assert child.image == image
            assert child.age_range == age_range
            assert child.sex == sex
            assert child.eye_color == eye_color
            assert child.hair_type == hair_type
            assert child.hair_color == hair_color
            assert child.ethnicity == ethnicity
            assert child.fav_animals == fav_animals
            assert child.fav_activities == fav_activities
            assert child.fav_shows == fav_shows

    @staticmethod
    def test_parent_does_not_exist(app: Flask) -> None:
        """
        Test insertion of a child with a non-existing parent ID.
        """
        with app.app_context():
            # Attempt to insert a child with a non-existing parent ID
            with pytest.raises(ValueError) as exc_info:
                # Attempt to insert a child with a non-existing parent ID
                insert_child(
                    parent_id="non_existing_id",
                    name="Child",
                    image="base64imagestring==",
                    age_range="4-6",
                    sex="Male",
                    eye_color="Blue",
                    hair_type="Straight",
                    hair_color="Blonde",
                    ethnicity="Caucasian",
                )

            assert "Parent with ID 'non_existing_id' does not exist" in str(
                exc_info.value
            )

    @staticmethod
    def test_optional_values(app: Flask, parent: Parent) -> None:
        """
        Test successful insertion of a child with optional values omitted.
        """
        with app.app_context():
            name = "OptionalChild"

            # Insert a child without optional values
            insert_child(
                parent_id=parent.user_id,
                name=name,
                image="base64imagestring==",
                age_range="4-6",
                sex="Male",
                eye_color="Green",
                hair_type="Wavy",
                hair_color="Brown",
                ethnicity="Asian",
            )

            # Check if the child was inserted successfully without optional values
            child = Child.query.filter_by(name=name).first()

            assert child is not None
            assert child.fav_animals is None
            assert child.fav_activities is None
            assert child.fav_shows is None

    @pytest.mark.parametrize(
        "name,image,age_range,sex,eye_color,hair_type,hair_color,ethnicity,fav_animals,fav_activities,fav_shows",
        [
            (
                123,
                "valid_image",
                "4-6",
                "Female",
                "Brown",
                "Curly",
                "Black",
                "Hispanic",
                None,
                "Swimming",
                None,
            ),
            (
                "Name",
                123,
                "4-6",
                "Female",
                "Brown",
                "Curly",
                "Black",
                "Hispanic",
                None,
                None,
                "Harry Potter",
            ),
            (
                "Name",
                "valid_image",
                123,
                "Female",
                "Brown",
                "Curly",
                "Black",
                "Hispanic",
                None,
                None,
                None,
            ),
            (
                "Name",
                "valid_image",
                "4-6",
                123,
                "Brown",
                "Curly",
                "Black",
                "Hispanic",
                None,
                None,
                None,
            ),
            (
                "Name",
                "valid_image",
                "4-6",
                "Female",
                123,
                "Curly",
                "Black",
                "Hispanic",
                None,
                None,
                None,
            ),
            (
                "Name",
                "valid_image",
                "4-6",
                "Female",
                "Brown",
                123,
                "Black",
                "Hispanic",
                None,
                None,
                None,
            ),
            (
                "Name",
                "valid_image",
                "4-6",
                "Female",
                "Brown",
                "Curly",
                123,
                "Hispanic",
                None,
                None,
                None,
            ),
            (
                "Name",
                "valid_image",
                "4-6",
                "Female",
                "Brown",
                "Curly",
                "Black",
                123,
                None,
                None,
                None,
            ),
            (
                "Name",
                "valid_image",
                "4-6",
                "Female",
                "Brown",
                "Curly",
                "Black",
                "Hispanic",
                123,
                None,
                None,
            ),
            (
                "Name",
                "valid_image",
                "4-6",
                "Female",
                "Brown",
                "Curly",
                "Black",
                "Hispanic",
                None,
                123,
                None,
            ),
            (
                "Name",
                "valid_image",
                "4-6",
                "Female",
                "Brown",
                "Curly",
                "Black",
                "Hispanic",
                None,
                None,
                123,
            ),
        ],
    )
    def test_incorrect_types(
        self,
        parent: Parent,
        app: Flask,
        name: Any,
        image: Any,
        age_range: Any,
        sex: Any,
        eye_color: Any,
        hair_type: Any,
        hair_color: Any,
        ethnicity: Any,
        fav_animals: Any,
        fav_activities: Any,
        fav_shows: Any,
    ) -> None:
        """
        Test insertion of a child with incorrect types.
        """
        with app.app_context():
            with pytest.raises(TypeError) as exc_info:
                insert_child(
                    parent.user_id,
                    name,
                    image,
                    age_range,
                    sex,
                    eye_color,
                    hair_type,
                    hair_color,
                    ethnicity,
                    fav_animals,
                    fav_activities,
                    fav_shows,
                )

            assert "must be of type" in str(exc_info.value)

    @pytest.mark.parametrize(
        "age_range,sex,eye_color,hair_type,hair_color",
        [
            (
                "3-7",
                "Female",
                "Brown",
                "Curly",
                "Black",
            ),
            (
                "4-6",
                "F",
                "Brown",
                "Curly",
                "Black",
            ),
            (
                "4-6",
                "Female",
                "Gold",
                "Curly",
                "Black",
            ),
            (
                "4-6",
                "Female",
                "Brown",
                "Very Curly",
                "Black",
            ),
            (
                "4-6",
                "Female",
                "Brown",
                "Curly",
                "Yellow",
            ),
        ],
    )
    def test_invalid_values(
        self,
        app: Flask,
        parent: Parent,
        age_range: str,
        sex: str,
        eye_color: str,
        hair_type: str,
        hair_color: str,
    ) -> None:
        """
        Test insertion of a child with invalid values.
        """
        with app.app_context():
            with pytest.raises(ValueError) as exc_info:
                insert_child(
                    parent.user_id,
                    "InvalidChild",
                    "base64imagestring==",
                    age_range,
                    sex,
                    eye_color,
                    hair_type,
                    hair_color,
                    "Hispanic",
                )

            assert "invalid value" in str(exc_info.value).lower()

    @pytest.mark.parametrize(
        "empty_field, payload",
        [
            (
                "name",
                {
                    "name": "",
                    "image": "base64imagestring==",
                    "age_range": "4-6",
                    "sex": "Male",
                    "eye_color": "Brown",
                    "hair_type": "Curly",
                    "hair_color": "Black",
                    "ethnicity": "Hispanic",
                },
            ),
            (
                "image",
                {
                    "name": "Bob",
                    "image": "",
                    "age_range": "4-6",
                    "sex": "Male",
                    "eye_color": "Brown",
                    "hair_type": "Curly",
                    "hair_color": "Black",
                    "ethnicity": "Hispanic",
                },
            ),
            (
                "age_range",
                {
                    "name": "Bob",
                    "image": "base64imagestring==",
                    "age_range": "",
                    "sex": "Male",
                    "eye_color": "Brown",
                    "hair_type": "Curly",
                    "hair_color": "Black",
                    "ethnicity": "Hispanic",
                },
            ),
            (
                "sex",
                {
                    "name": "Bob",
                    "image": "base64imagestring==",
                    "age_range": "4-6",
                    "sex": "",
                    "eye_color": "Brown",
                    "hair_type": "Curly",
                    "hair_color": "Black",
                    "ethnicity": "Hispanic",
                },
            ),
            (
                "eye_color",
                {
                    "name": "Bob",
                    "image": "base64imagestring==",
                    "age_range": "4-6",
                    "sex": "Male",
                    "eye_color": "",
                    "hair_type": "Curly",
                    "hair_color": "Black",
                    "ethnicity": "Hispanic",
                },
            ),
            (
                "hair_type",
                {
                    "name": "Bob",
                    "image": "base64imagestring==",
                    "age_range": "4-6",
                    "sex": "Male",
                    "eye_color": "Brown",
                    "hair_type": "",
                    "hair_color": "Black",
                    "ethnicity": "Hispanic",
                },
            ),
            (
                "hair_color",
                {
                    "name": "Bob",
                    "image": "base64imagestring==",
                    "age_range": "4-6",
                    "sex": "Male",
                    "eye_color": "Brown",
                    "hair_type": "Curly",
                    "hair_color": "",
                    "ethnicity": "Hispanic",
                },
            ),
            (
                "ethnicity",
                {
                    "name": "Bob",
                    "image": "base64imagestring==",
                    "age_range": "4-6",
                    "sex": "Male",
                    "eye_color": "Brown",
                    "hair_type": "Curly",
                    "hair_color": "Black",
                    "ethnicity": "",
                },
            ),
        ],
    )
    def test_empty_values(
        self,
        app: Flask,
        parent: Parent,
        empty_field: str,
        payload: dict[str, str],
    ) -> None:
        """
        Test if function rejects empty values for all variables.
        """
        with app.app_context():
            with pytest.raises(ValueError) as exc_info:
                insert_child(
                    parent.user_id,
                    **payload,
                )

            assert "non-empty" in str(exc_info.value)
            assert empty_field in str(exc_info.value)


class TestInsertStory:
    """
    This class contains tests for the insert_story function.
    """

    @staticmethod
    def test_success(app: Flask, child: Child) -> None:
        """
        Test successful insertion of a story.
        """
        with app.app_context():
            title = "A Grand Adventure"

            # Insert a story
            insert_story(
                child_id=child.child_id,
                title=title,
                topic="Travelling",
                image_style="Cartoon",
                story_genre="Adventure",
                chapter_titles=["Chapter Title"] * 5,
                chapter_contents=["Chapter Content"] * 5,
                images=["base64imagestring=="] * 5,
            )

            assert Story.query.filter_by(title=title).first() is not None
            assert (
                len(Story.query.filter_by(title=title).first().chapters) == 5
            )

    @pytest.mark.parametrize(
        "image_style,story_genre",
        [
            # Invalid image_style
            ("Sketch", "Adventure"),
            # Invalid story_genre
            ("Cartoon", "Romance"),
        ],
    )
    def test_invalid_values(
        self,
        app: Flask,
        child: Child,
        image_style: str,
        story_genre: str,
    ) -> None:
        """
        Test insertion of a story with invalid values for image_style and story_genre.
        """
        with app.app_context():
            with pytest.raises(ValueError) as exc_info:

                # Attempt to insert a story with invalid values
                insert_story(
                    child_id=child.child_id,
                    title="Invalid Story",
                    topic="Travelling",
                    image_style=image_style,
                    story_genre=story_genre,
                    chapter_titles=["Chapter Title"],
                    chapter_contents=["Chapter Content"],
                    images=["base64imagestring=="],
                )

            assert "invalid value" in str(exc_info.value).lower()

    @pytest.mark.parametrize(
        "field,value",
        [
            # None title
            ("title", None),
            # None topic
            ("topic", None),
            # None image_style
            ("image_style", None),
            # None story_genre
            ("story_genre", None),
            # First title is None
            ("chapter_titles", [None, "Valid Title"]),
            # First content is None
            (
                "chapter_contents",
                [None, "Valid Content"],
            ),
            # Second image is None
            ("images", ["base64imagestring==", None]),
        ],
    )
    def test_none_values(
        self, app: Flask, child: Child, field: str, value: Any
    ) -> None:
        """
        Test insertion of a story with None values in chapter fields.
        """
        with app.app_context():
            story_attributes = {
                "child_id": child.child_id,
                "title": "Story With Nones",
                "topic": "Adventure",
                "image_style": "Cartoon",
                "story_genre": "Adventure",
                "chapter_titles": ["Chapter 1", "Chapter 2"],
                "chapter_contents": ["Content 1", "Content 2"],
                "images": ["base64imagestring=="] * 2,
            }

            # Dynamically set the field to the value for the test case
            story_attributes[field] = value

            with pytest.raises(ValueError) as exc_info:
                # Attempt to insert the story
                insert_story(**story_attributes)

            assert "must not be None" in str(exc_info.value)

    @pytest.mark.parametrize(
        "field,value",
        [
            # Empty title
            ("chapter_titles", ["", "Valid Title"]),
            # Empty content
            (
                "chapter_contents",
                ["", "Valid Content"],
            ),
            # Empty image
            ("images", ["base64imagestring==", ""]),
        ],
    )
    def test_empty_chapter_strings(
        self, app: Flask, child: Child, field: str, value: Any
    ) -> None:
        """
        Test insertion of a story with empty chapter strings.
        """
        with app.app_context():
            with pytest.raises(ValueError) as exc_info:
                story_attributes = {
                    "child_id": child.child_id,
                    "title": "Story With Empties",
                    "topic": "Adventure",
                    "image_style": "Cartoon",
                    "story_genre": "Adventure",
                    "chapter_titles": ["Chapter 1", "Chapter 2"],
                    "chapter_contents": ["Content 1", "Content 2"],
                    "images": ["base64imagestring=="] * 2,
                }

                # Dynamically set the field to the value for the test case
                story_attributes[field] = value

                # Attempt to insert the story
                insert_story(**story_attributes)

            assert "non-empty" in str(exc_info.value)

    @staticmethod
    def test_mismatched_chapter_lists(app: Flask, child: Child) -> None:
        """
        Test insertion of a story with mismatched lengths of chapter fields.
        """
        with app.app_context():
            with pytest.raises(ValueError) as exc_info:
                insert_story(
                    child_id=child.child_id,
                    title="Mismatched Chapters",
                    topic="Adventure",
                    image_style="Cartoon",
                    story_genre="Adventure",
                    chapter_titles=["Only One Title"],
                    # Mismatched lengths (1 vs 2)
                    chapter_contents=[
                        "Content 1",
                        "Content 2",
                    ],
                    images=["base64imagestring=="] * 2,
                )

            assert "must have the same length" in str(exc_info.value)

    @staticmethod
    def test_child_does_not_exist(app: Flask) -> None:
        """
        Test insertion of a story for a non-existent child.
        """
        with app.app_context():
            with pytest.raises(ValueError) as exc_info:
                insert_story(
                    child_id="nonexistent_child_id",
                    title="Orphan Story",
                    topic="Mystery",
                    image_style="Fantasy",
                    story_genre="Fantasy",
                    chapter_titles=["Chapter 1"],
                    chapter_contents=["Content 1"],
                    images=["base64imagestring=="],
                )

            assert (
                "Child with ID 'nonexistent_child_id' does not exist"
                in str(exc_info.value)
            )

    @pytest.mark.parametrize(
        "title,topic,image_style,story_genre,chapter_titles,chapter_contents,images",
        [
            (
                123,
                "Adventure",
                "Cartoon",
                "Adventure",
                ["Chapter 1"],
                ["Content 1"],
                ["base64imagestring=="],
            ),
            (
                "Story",
                123,
                "Cartoon",
                "Adventure",
                ["Chapter 1"],
                ["Content 1"],
                ["base64imagestring=="],
            ),
            (
                "Story",
                "Adventure",
                123,
                "Adventure",
                ["Chapter 1"],
                ["Content 1"],
                ["base64imagestring=="],
            ),
            (
                "Story",
                "Adventure",
                "Cartoon",
                123,
                ["Chapter 1"],
                ["Content 1"],
                ["base64imagestring=="],
            ),
            (
                "Story",
                "Adventure",
                "Cartoon",
                "Adventure",
                [123],
                ["Content 1"],
                ["base64imagestring=="],
            ),
            (
                "Story",
                "Adventure",
                "Cartoon",
                "Adventure",
                ["Chapter 1"],
                [123],
                ["base64imagestring=="],
            ),
            (
                "Story",
                "Adventure",
                "Cartoon",
                "Adventure",
                ["Chapter 1"],
                ["Content 1"],
                [123],
            ),
        ],
    )
    def test_invalid_types(
        self,
        app: Flask,
        child: Child,
        title: Any,
        topic: Any,
        image_style: Any,
        story_genre: Any,
        chapter_titles: Any,
        chapter_contents: Any,
        images: Any,
    ) -> None:
        """
        Test insertion of a story with incorrect types.
        """
        with app.app_context():
            with pytest.raises(TypeError) as exc_info:
                insert_story(
                    child.child_id,
                    title,
                    topic,
                    image_style,
                    story_genre,
                    chapter_titles,
                    chapter_contents,
                    images,
                )

            assert "must be of type" in str(exc_info.value)

    @pytest.mark.parametrize(
        "missing_field,value",
        [
            # Empty title
            ("title", ""),
            # Empty topic
            ("topic", ""),
            # Empty image_style
            ("image_style", ""),
            # Empty story_genre
            ("story_genre", ""),
        ],
    )
    def test_empty_values(
        self, app: Flask, child: Child, missing_field: str, value: str
    ) -> None:
        """
        Test insertion of a story with empty values for required fields.
        """
        with app.app_context():
            story_attributes = {
                "child_id": child.child_id,
                "title": "Story Title",
                "topic": "Adventure",
                "image_style": "Cartoon",
                "story_genre": "Adventure",
                "chapter_titles": ["Chapter 1"],
                "chapter_contents": ["Content 1"],
                "images": ["base64imagestring=="],
            }

            # Dynamically set the field to the empty value for the test case
            story_attributes[missing_field] = value

            with pytest.raises(ValueError) as exc_info:
                insert_story(**story_attributes)

            assert "non-empty" in str(exc_info.value)

    @pytest.mark.parametrize(
        "field,value",
        [
            # None chapter_titles
            ("chapter_titles", None),
            # None chapter_contents
            ("chapter_contents", None),
            # None images
            ("images", None),
        ],
    )
    def test_lists_none(
        self, field: str, value: Any, app: Flask, child: Child
    ) -> None:
        """
        Test insertion of a story with None values for chapter fields.
        """
        with app.app_context():
            with pytest.raises(ValueError) as exc_info:
                story_attributes = {
                    "child_id": child.child_id,
                    "title": "Story With Nones",
                    "topic": "Adventure",
                    "image_style": "Cartoon",
                    "story_genre": "Adventure",
                    "chapter_titles": ["Chapter 1", "Chapter 2"],
                    "chapter_contents": ["Content 1", "Content 2"],
                    "images": ["base64imagestring=="] * 2,
                }

                # Dynamically set the field to the value for the test case
                story_attributes[field] = value

                # Attempt to insert the story
                insert_story(**story_attributes)

            assert "must not be None" in str(exc_info.value)
