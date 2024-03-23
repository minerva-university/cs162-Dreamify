"""
This module contains functions for inserting data into the database.
"""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from ..extensions import bcrypt
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
    try:
        # Check if the parent exists
        if Parent.query.filter_by(user_id=parent_id).first() is None:
            raise ValueError(f"Parent with ID '{parent_id}' does not exist.")

        # Create a child
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

        # Add the child to the session and commit the changes
        db.session.add(child)
        db.session.commit()

        # Return the inserted child
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
    chapter_titles: list[str],
    chapter_contents: list[str],
    images: list[str],
) -> Story:
    """
    Insert the story and its chapters into the database.

    Args:
        child_id (str): The ID of the child.
        title (str): The title of the story.
        topic (str): The topic of the story.
        image_style (str): The style of the images.
        chapter_titles (list[str]): The list of story chapter titles.
        chapter_contents (list[str]): The list of story chapter contents.
        images (list[str]): The list of images.

    Raises:
        ValueError: If the child with the given ID does not exist.

    Returns:
        Story: The inserted story.
    """
    try:
        # Verify that the child exists
        child = Child.query.get(child_id)
        if child is None:
            raise ValueError(f"Child with ID {child_id} does not exist")

        # Create a new story
        story = Story(
            child_id=child_id,
            title=title,
            topic=topic,
            image_style=image_style,
        )

        # Add the story to the database and flush it to get the story ID
        db.session.add(story)
        db.session.flush()

        # Add the chapters to the database
        for i in range(len(chapter_contents)):
            # Create a new chapter
            chapter = Chapter(
                story_id=story.story_id,
                title=chapter_titles[i],
                content=chapter_contents[i],
                image=images[i],
                order=i + 1,
            )

            # Add the chapter to the database
            db.session.add(chapter)

        # Commit the changes to the database
        db.session.commit()

        # Return the inserted story
        return story
    # Roll back the changes if an SQLAlchemy error occurs
    except SQLAlchemyError as e:
        db.session.rollback()
        raise e
