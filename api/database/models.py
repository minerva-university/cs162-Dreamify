"""
This module contains the database models.
"""

from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint
from sqlalchemy.exc import SQLAlchemyError
from uuid import uuid4

# Init SQL alchemy database
db = SQLAlchemy()


def generate_id() -> str:
    """
    Generate a unique ID.

    Returns:
        str: The generated ID.
    """
    return uuid4().hex


class Parent(db.Model):
    __tablename__ = "parents"

    user_id = db.Column(db.Text, primary_key=True, default=generate_id)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)

    # Relationship to Child
    children = db.relationship("Child", backref="parent", lazy=True)


class Child(db.Model):
    __tablename__ = "children"

    child_id = db.Column(db.Text, primary_key=True, default=generate_id)
    parent_id = db.Column(db.Integer, db.ForeignKey("parents.user_id"))
    name = db.Column(db.Text, nullable=False)
    age_range = db.Column(
        db.Text,
        CheckConstraint("age_range IN ('0-3', '4-6', '7-9', '10-13')"),
        nullable=False,
    )
    sex = db.Column(
        db.Text, CheckConstraint("sex IN ('Male', 'Female')"), nullable=False
    )
    sibling_relationship = db.Column(
        db.Text,
        CheckConstraint(
            "sibling_relationship IN ('Only', 'Youngest', 'Middle', 'Oldest')"
        ),
        nullable=False,
    )
    eye_color = db.Column(
        db.Text,
        CheckConstraint(
            "eye_color IN ('Blue', 'Brown', 'Green', 'Hazel', 'Amber', 'Gray')"
        ),
        nullable=False,
    )
    hair_type = db.Column(
        db.Text,
        CheckConstraint(
            "hair_type IN ('Straight', 'Wavy', 'Curly', 'Kinky', 'Bald')"
        ),
        nullable=False,
    )
    hair_color = db.Column(
        db.Text,
        CheckConstraint(
            "hair_color IN ('Blonde', 'Brown', 'Black', 'Red', 'Auburn', 'Grey', 'White')"
        ),
        nullable=False,
    )
    skin_tone = db.Column(
        db.Text,
        CheckConstraint(
            "skin_tone IN ('Fair', 'Light', 'Medium', 'Tan', 'Brown', 'Dark')"
        ),
        nullable=False,
    )
    fav_animals = db.Column(db.Text, nullable=True)
    fav_activities = db.Column(db.Text, nullable=True)
    fav_shows = db.Column(db.Text, nullable=True)

    # Relationship to Story
    stories = db.relationship("Story", backref="child", lazy=True)


class Story(db.Model):
    __tablename__ = "stories"

    story_id = db.Column(db.Text, primary_key=True, default=generate_id)
    child_id = db.Column(db.Integer, db.ForeignKey("children.child_id"))
    topic = db.Column(db.Text, nullable=False)
    image_style = db.Column(
        db.Text,
        CheckConstraint(
            "image_style IN ('Cartoon', 'Realistic', 'Fantasy', 'Watercolor', 'Anime')"
        ),
        nullable=False,
    )

    # Relationship to Chapter
    chapters = db.relationship("Chapter", backref="story", lazy=True)


class Chapter(db.Model):
    __tablename__ = "chapters"

    chapter_id = db.Column(db.Text, primary_key=True, default=generate_id)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.story_id"))
    content = db.Column(db.Text, nullable=False)
    image = db.Column(db.Text, nullable=False)
    order = db.Column(db.Integer, nullable=False)


def create_dummy_data() -> None:
    """
    Create some dummy data for the database: a parent and a child.
    """
    try:
        # Check if the Parent and Child tables are empty and return if they are not
        if (
            Parent.query.first() is not None
            and Child.query.first() is not None
        ):
            return

        # Generate a user ID for the parent
        user_id = generate_id()

        # Create a parent
        parent = Parent(
            user_id=user_id,
            first_name="John",
            last_name="Doe",
            password="password",
            email="john.doe@example.com",
        )

        # Create a child
        child = Child(
            parent_id=parent.user_id,
            name="Pablo",
            age_range="4-6",
            sex="Male",
            sibling_relationship="Only",
            eye_color="Brown",
            hair_type="Curly",
            hair_color="Black",
            skin_tone="Light",
            fav_animals="Horse",
            fav_activities="watching Harry Potter and playing football",
        )

        # Add the parent and child to the session and commit
        db.session.add(parent)
        db.session.add(child)
        db.session.commit()

        # Log the creation of the parent and child
        current_app.logger.info(f"Parent created: {parent.user_id}")
        current_app.logger.info(f"Child created: {child.child_id}")

    except SQLAlchemyError as e:
        current_app.logger.error(f"Failed to create dummy data: {e}")
        db.session.rollback()
