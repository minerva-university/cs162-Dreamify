"""
This module contains the database models.
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint

from .utilities import generate_id

# Create a SQLAlchemy instance
db = SQLAlchemy()


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
    ) -> None:
        super().__init__()
        self.parent_id = parent_id
        self.name = name
        self.image = image
        self.age_range = age_range
        self.sex = sex
        self.eye_color = eye_color
        self.hair_type = hair_type
        self.hair_color = hair_color
        self.ethnicity = ethnicity
        self.fav_animals = fav_animals
        self.fav_activities = fav_activities
        self.fav_shows = fav_shows

    # Define the table name
    __tablename__ = "children"

    child_id = db.Column(db.Text, primary_key=True, default=generate_id)
    parent_id = db.Column(db.Text, db.ForeignKey("parents.user_id"))
    name = db.Column(db.Text, nullable=False)
    image = db.Column(db.Text, nullable=False)
    age_range = db.Column(
        db.Text,
        CheckConstraint("age_range IN ('0-3', '4-6', '7-9', '10-13')"),
        nullable=False,
    )
    sex = db.Column(
        db.Text, CheckConstraint("sex IN ('Male', 'Female')"), nullable=False
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
            "hair_color IN ('Blonde', 'Brown', 'Black', 'Red', 'Auburn', 'Gray', 'White', 'Bald')"
        ),
        nullable=False,
    )
    ethnicity = db.Column(
        db.Text,
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
        title: str,
        topic: str,
        image_style: str,
        story_genre: str,
    ) -> None:
        super().__init__()
        self.child_id = child_id
        self.title = title
        self.topic = topic
        self.image_style = image_style
        self.story_genre = story_genre

    # Define the table name
    __tablename__ = "stories"

    story_id = db.Column(db.Text, primary_key=True, default=generate_id)
    child_id = db.Column(db.Text, db.ForeignKey("children.child_id"))
    title = db.Column(db.Text, nullable=False)
    topic = db.Column(db.Text, nullable=False)
    image_style = db.Column(
        db.Text,
        CheckConstraint(
            "image_style IN ('Cartoon', 'Realistic', 'Fantasy', 'Watercolor', 'Anime')"
        ),
        nullable=False,
    )
    story_genre = db.Column(
        db.Text,
        CheckConstraint(
            "story_genre IN ('Fantasy', 'Adventure', 'Educational')"
        ),
        nullable=False,
    )
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

    # Relationship to Chapter
    chapters = db.relationship("Chapter", backref="story", lazy=True)


class Chapter(db.Model):
    """
    Represents a chapter.
    """

    def __init__(
        self, story_id: str, title: str, content: str, image: str, order: int
    ) -> None:
        self.story_id = story_id
        self.title = title
        self.content = content
        self.image = image
        self.order = order

    # Define the table name
    __tablename__ = "chapters"

    chapter_id = db.Column(db.Text, primary_key=True, default=generate_id)
    story_id = db.Column(db.Text, db.ForeignKey("stories.story_id"))
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    image = db.Column(db.Text, nullable=False)
    order = db.Column(db.Integer, nullable=False)
