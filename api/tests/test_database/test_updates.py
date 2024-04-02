"""
This module contains tests for the database updates.
"""

import pytest
from flask import Flask
from typing import Any

from api.database.updates import update_child
from api.database.models import Child


class TestUpdateChild:
    """
    This class contains tests for the update_child function.
    """

    @staticmethod
    def test_success(app: Flask, child_to_update: Child) -> None:
        """
        Test successful update of a child.
        """
        with app.app_context():
            name = "ChildSuccess"
            age_range = "4-6"
            sex = "Female"
            eye_color = "Brown"
            hair_type = "Curly"
            hair_color = "Black"
            ethnicity = "Hispanic"
            fav_animals = "Dogs"
            fav_activities = "Drawing"
            fav_shows = "Cartoon Show"

            # Update the child
            updated_child = update_child(
                child_id=child_to_update.child_id,
                name=name,
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

            # Check if the child was updated successfully
            queried_child = Child.query.filter_by(
                child_id=updated_child.child_id
            ).first()

            assert queried_child is not None
            assert queried_child.name == name
            assert queried_child.age_range == age_range
            assert queried_child.sex == sex
            assert queried_child.eye_color == eye_color
            assert queried_child.hair_type == hair_type
            assert queried_child.hair_color == hair_color
            assert queried_child.ethnicity == ethnicity
            assert queried_child.fav_animals == fav_animals
            assert queried_child.fav_activities == fav_activities
            assert queried_child.fav_shows == fav_shows

    @staticmethod
    def test_child_does_not_exist(app: Flask) -> None:
        """
        Test update of a child that does not exist.
        """
        with app.app_context():
            with pytest.raises(ValueError) as exc_info:
                update_child(
                    child_id="non_existing_id",
                    name="ChildDoesNotExist",
                    age_range="4-6",
                    sex="Female",
                    eye_color="Brown",
                    hair_type="Curly",
                    hair_color="Black",
                    ethnicity="Hispanic",
                    fav_animals="Dogs",
                    fav_activities="Drawing",
                    fav_shows="Cartoon Show",
                )

            assert "Child with ID 'non_existing_id' does not exist" in str(
                exc_info.value
            )

    @staticmethod
    def test_optional_values(app: Flask, child_to_update: Child) -> None:
        """
        Test successful update of a child with optional values.
        """
        with app.app_context():
            name = "OptionalChild"

            # Insert a child without optional values
            update_child(
                child_id=child_to_update.child_id,
                name=name,
                age_range="4-6",
                sex="Male",
                eye_color="Green",
                hair_type="Wavy",
                hair_color="Brown",
                ethnicity="Asian",
            )

            # Check if the child was inserted successfully without optional values
            retrieved_child = Child.query.filter_by(name=name).first()

            assert retrieved_child is not None
            assert retrieved_child.fav_animals is None
            assert retrieved_child.fav_activities is None
            assert retrieved_child.fav_shows is None

    @pytest.mark.parametrize(
        "name,age_range,sex,eye_color,hair_type,hair_color,ethnicity,fav_animals,fav_activities,fav_shows",
        [
            (
                123,
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
        child_to_update: Child,
        app: Flask,
        name: Any,
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
                update_child(
                    child_to_update.child_id,
                    name,
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
        child_to_update: Child,
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
                update_child(
                    child_to_update.child_id,
                    "InvalidChild",
                    age_range,
                    sex,
                    eye_color,
                    hair_type,
                    hair_color,
                    "Hispanic",
                )

            assert "invalid value" in str(exc_info.value).lower()
