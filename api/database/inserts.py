"""
This module contains functions for inserting data into the database.
"""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError
from email_validator import validate_email, EmailNotValidError

from ..extensions import bcrypt
from ..functions.input_validation import (
    validate_non_empty_string,
    validate_type,
    validate_list_of_non_empty_strings,
    validate_allowed_value,
)
from .models import db, Parent, Child, Story, Chapter


def insert_parent(
    first_name: str, last_name: str, email: str, password: str
) -> Parent:
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
        Parent: The inserted parent.
    """
    try:
        # Validate required fields
        validate_non_empty_string(first_name, "first_name")
        validate_non_empty_string(last_name, "last_name")
        validate_non_empty_string(email, "email")
        validate_non_empty_string(password, "password")

        # Validate email format
        validate_email(email)

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

        # Return the inserted parent
        return parent
    except EmailNotValidError as e:
        raise ValueError(f"Invalid email: {e}") from e
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
    image: str,
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
    Insert a child into the database.

    Args:
        parent_id (str): The ID of the parent.
        name (str): The name of the child.
        image (str): The image of the child in base64 string format.
        age_range (str): The age range of the child.
        sex (str): The sex of the child.
        eye_color (str): The eye color of the child.
        hair_type (str): The hair type of the child.
        hair_color (str): The hair color of the child.
        ethnicity (str): The ethnicity of the child.
        fav_animals (str | None): The child's favorite animals. Optional.
        fav_activities (str | None): The child's favorite activities. Optional.
        fav_shows (str | None): The child's favorite shows. Optional.

    Raises:
        ValueError: If the parent does not exist.

    Returns:
        Child: The inserted child.
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
        # Validate required fields
        validate_non_empty_string(parent_id, "parent_id")
        validate_non_empty_string(name, "name")
        validate_non_empty_string(image, "image")
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

        # Check if the parent exists
        if Parent.query.filter_by(user_id=parent_id).first() is None:
            raise ValueError(f"Parent with ID '{parent_id}' does not exist.")

        # Create and insert the child
        child = Child(
            parent_id=parent_id,
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
        db.session.add(child)
        db.session.commit()

        return child

    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f"Failed to add child: {e}")
        raise e
    except Exception as e:
        current_app.logger.error(f"Failed to add child: {e}")
        raise e


def insert_story(
    child_id: str,
    title: str,
    topic: str,
    image_style: str,
    story_genre: str,
    chapter_titles: list[str],
    chapter_contents: list[str],
    images: list[str],
) -> Story:
    """
    Insert a story and its chapters into the database.

    Args:
        child_id (str): The ID of the child.
        title (str): The title of the story.
        topic (str): The topic of the story.
        image_style (str): The style of the images.
        story_genre (str): The genre of the story.
        chapter_titles (list[str]): The list of story chapter titles.
        chapter_contents (list[str]): The list of story chapter contents.
        images (list[str]): The list of images.

    Raises:
        ValueError: If the child with the given ID does not exist.

    Returns:
        Story: The inserted story.
    """
    valid_image_styles = [
        "Cartoon",
        "Realistic",
        "Fantasy",
        "Watercolor",
        "Anime",
    ]
    valid_story_genres = ["Fantasy", "Adventure", "Educational"]

    try:
        # Validate inputs
        validate_non_empty_string(child_id, "child_id")
        validate_non_empty_string(title, "title")
        validate_non_empty_string(topic, "topic")
        validate_non_empty_string(image_style, "image_style")
        validate_non_empty_string(story_genre, "story_genre")

        # Validate allowed values
        validate_allowed_value(image_style, valid_image_styles, "image_style")
        validate_allowed_value(story_genre, valid_story_genres, "story_genre")

        # Validate types
        validate_type(chapter_titles, [list], "chapter_titles")
        validate_type(chapter_contents, [list], "chapter_contents")
        validate_type(images, [list], "images")

        # Check for equal lengths of chapter titles, contents, and images
        if not len(chapter_titles) == len(chapter_contents) == len(images):
            raise ValueError(
                "Lists of chapter titles, contents, and images must have the same length "
                "but have lengths of "
                f"{len(chapter_titles)}, {len(chapter_contents)}, and {len(images)}."
            )

        # Check for valid chapter titles, contents, and images
        validate_list_of_non_empty_strings(chapter_titles, "chapter_titles")
        validate_list_of_non_empty_strings(
            chapter_contents, "chapter_contents"
        )
        validate_list_of_non_empty_strings(images, "images")

        # Check for valid chapter titles, contents, and images
        validate_list_of_non_empty_strings(chapter_titles, "chapter_titles")
        validate_list_of_non_empty_strings(
            chapter_contents, "chapter_contents"
        )
        validate_list_of_non_empty_strings(images, "images")

        # Verify that the child exists
        if not Child.query.filter_by(child_id=child_id).first():
            raise ValueError(f"Child with ID '{child_id}' does not exist")

        # Create and insert the story
        story = Story(
            child_id=child_id,
            title=title,
            topic=topic,
            image_style=image_style,
            story_genre=story_genre,
        )
        db.session.add(story)

        # Flush to get the story_id for chapter insertion
        db.session.flush()

        # Add chapters to the database
        for i, (title, content, image) in enumerate(
            zip(chapter_titles, chapter_contents, images), 1
        ):
            chapter = Chapter(
                story_id=story.story_id,
                title=title,
                content=content,
                image=image,
                order=i,
            )
            db.session.add(chapter)

        db.session.commit()
        return story
    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f"Failed to add story: {e}")
        raise e
    except Exception as e:
        current_app.logger.error(f"Failed to add story: {e}")
        raise e
