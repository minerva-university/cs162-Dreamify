"""
This module contains test fixtures for the API tests.
"""

import pytest

from api import create_app, db
from api.config import TestingConfig
from api.database.models import Parent, Child, Story, Chapter
from api.extensions import bcrypt


@pytest.fixture(scope="session")
def app():
    """
    Create a Flask application context for the tests.
    """
    # Create the app with the testing configuration
    app = create_app(TestingConfig)

    # Create the database tables
    with app.app_context():
        db.create_all()

    # Yield the app to the tests
    yield app

    # Drop the database tables when the tests are done
    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture(scope="session")
def client(app):
    """
    A test client for the app.
    """
    yield app.test_client()


@pytest.fixture(scope="session")
def parent(app):
    """
    A test parent.
    """
    password = "password"

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    test_parent = Parent(
        first_name="Test",
        last_name="Parent",
        email="test.parent@gmail.com",
        password=hashed_password,
    )

    with app.app_context():
        db.session.add(test_parent)
        db.session.commit()

        yield test_parent

        db.session.delete(test_parent)
        db.session.commit()


@pytest.fixture(scope="session")
def child(app, parent):
    """
    A test child.
    """
    # Assuming the Child model requires at least a name and a parent
    test_child = Child(
        parent_id=parent.user_id,
        name="TestChild",
        image="base64image==",
        age_range="4-6",
        sex="Female",
        eye_color="Brown",
        hair_type="Curly",
        hair_color="Black",
        ethnicity="Brown",
    )

    with app.app_context():
        db.session.add(test_child)
        db.session.commit()

        yield test_child

        db.session.delete(test_child)
        db.session.commit()


# Function scope because the child is modified in the tests
@pytest.fixture(scope="function")
def child_to_update(app, parent):
    """
    A test child.
    """
    # Assuming the Child model requires at least a name and a parent
    test_update_child = Child(
        parent_id=parent.user_id,
        name="TestChild",
        image="base64image==",
        age_range="4-6",
        sex="Female",
        eye_color="Brown",
        hair_type="Curly",
        hair_color="Black",
        ethnicity="Brown",
    )

    with app.app_context():
        db.session.add(test_update_child)
        db.session.commit()

        yield test_update_child

        db.session.delete(test_update_child)
        db.session.commit()


@pytest.fixture(scope="session")
def access_token(client, parent):
    """
    A test access token.
    """
    # Login the parent to get the access token
    login_response = client.post(
        "/api/auth/login",
        json={"email": parent.email, "password": "password"},
    )

    # Get the access token
    access_token = login_response.json["access_token"]

    yield access_token


@pytest.fixture(scope="session")
def story(app, child):
    """
    A test story.
    """
    test_story = Story(
        child_id=child.child_id,
        title="Test Story",
        topic="Travelling to the Moon",
        image_style="Cartoon",
        story_genre="Adventure",
    )

    with app.app_context():
        db.session.add(test_story)
        db.session.commit()

        yield test_story

        db.session.delete(test_story)
        db.session.commit()


@pytest.fixture(scope="session")
def chapter(app, story):
    """
    A test chapter.
    """
    test_chapter = Chapter(
        story_id=story.story_id,
        title="Chapter Title",
        content="Chapter Content",
        image="base64image==",
        order=1,
    )

    with app.app_context():
        db.session.add(test_chapter)
        db.session.commit()

        yield test_chapter

        db.session.delete(test_chapter)
        db.session.commit()
