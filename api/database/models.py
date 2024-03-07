"""
This module contains the database models.
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint
from uuid import uuid4

# Create a SQLAlchemy instance
db = SQLAlchemy()


def generate_id() -> str:
    """
    Generate a unique ID.

    Returns:
        str: The generated ID.
    """
    return uuid4().hex


class Parent(db.Model):
    """
    Represents a parent (user).
    """

    def __init__(
        self,
        first_name: str,
        last_name: str,
        email: str,
        password: str,
    ) -> None:
        super().__init__()
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password

    # Define the table name
    __tablename__ = "parents"

    user_id = db.Column(db.Text, primary_key=True, default=generate_id)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)

    # Relationship to Child
    children = db.relationship("Child", backref="parent", lazy=True)


class Child(db.Model):
    """
    Represents a child.
    """

    def __init__(
        self,
        parent_id: str,
        name: str,
        age_range: str,
        sex: str,
        sibling_relationship: str,
        eye_color: str,
        hair_type: str,
        hair_color: str,
        skin_tone: str,
        fav_animals: str | None = None,
        fav_activities: str | None = None,
        fav_shows: str | None = None,
    ) -> None:
        super().__init__()
        self.parent_id = parent_id
        self.name = name
        self.age_range = age_range
        self.sex = sex
        self.sibling_relationship = sibling_relationship
        self.eye_color = eye_color
        self.hair_type = hair_type
        self.hair_color = hair_color
        self.skin_tone = skin_tone
        self.fav_animals = fav_animals
        self.fav_activities = fav_activities
        self.fav_shows = fav_shows

    # Define the table name
    __tablename__ = "children"

    child_id = db.Column(db.Text, primary_key=True, default=generate_id)
    parent_id = db.Column(db.Text, db.ForeignKey("parents.user_id"))
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
    """
    Represents a story.
    """

    def __init__(
        self,
        child_id: str,
        topic: str,
        image_style: str,
    ) -> None:
        super().__init__()
        self.child_id = child_id
        self.topic = topic
        self.image_style = image_style

    # Define the table name
    __tablename__ = "stories"

    story_id = db.Column(db.Text, primary_key=True, default=generate_id)
    child_id = db.Column(db.Text, db.ForeignKey("children.child_id"))
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
    """
    Represents a chapter.
    """

    def __init__(
        self, story_id: str, content: str, image: str, order: int
    ) -> None:
        self.story_id = story_id
        self.content = content
        self.image = image
        self.order = order

    # Define the table name
    __tablename__ = "chapters"

    chapter_id = db.Column(db.Text, primary_key=True, default=generate_id)
    story_id = db.Column(db.Text, db.ForeignKey("stories.story_id"))
    content = db.Column(db.Text, nullable=False)
    image = db.Column(db.Text, nullable=False)
    order = db.Column(db.Integer, nullable=False)
