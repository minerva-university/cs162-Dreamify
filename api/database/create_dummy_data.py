"""
This module creates functions for creating dummy data in the database.
"""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from .models import db, Parent, Child, generate_id


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
