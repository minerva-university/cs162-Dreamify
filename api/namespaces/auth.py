"""
This module contains the auth namespace and related operations.
"""

from flask import request, current_app
from email_validator import validate_email, EmailNotValidError
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
)

from ..functions.jwt_functions import get_current_parent
from ..functions.input_validation import validate_non_empty_string
from ..database.inserts import insert_parent
from ..database.queries import check_password, get_parent
from ..database.utilities import get_entry_attributes

# Create an auth namespace
auth = Namespace("auth", path="/auth", description="Authentication operations")

# Define a model for the register endpoint
register_model = auth.model(
    "Register",
    {
        "first_name": fields.String(
            required=True,
            description="First name of the parent",
            example="John",
        ),
        "last_name": fields.String(
            required=True, description="Last name of the parent", example="Doe"
        ),
        "email": fields.String(
            required=True,
            unique=True,
            description="Email of the parent",
            example="john.doe@example.com",
        ),
        "password": fields.String(
            required=True,
            description="Password of the parent",
            example="password123",
        ),
    },
)

# Define a model for the login endpoint
login_model = auth.model(
    "Login",
    {
        "email": fields.String(
            required=True,
            description="The parent's email",
            example="john.doe@example.com",
        ),
        "password": fields.String(
            required=True,
            description="The parent's password",
            example="password123",
        ),
    },
)


# Route to register a new parent
@auth.route("/register", strict_slashes=False)
class Register(Resource):
    """
    Represents a resource for registering a new parent.
    """

    @auth.expect(register_model, validate=True)
    def post(self):
        """
        Register a new parent.

        Returns:
            A tuple containing a dictionary with the payload and an HTTP status code.
        """
        try:
            # Get the request data
            data = request.get_json()

            # Validate the data
            validate_non_empty_string(data["first_name"], "first_name")
            validate_non_empty_string(data["last_name"], "last_name")
            validate_non_empty_string(data["email"], "email")
            validate_email(data["email"])
            validate_non_empty_string(data["password"], "password")

            # Create a new parent
            inserted_parent = insert_parent(
                data["first_name"],
                data["last_name"],
                data["email"],
                data["password"],
            )

            # Get the parent's filtered attributes
            parent_attributes = get_entry_attributes(
                inserted_parent, exclude=["password"]
            )

            # Return the parent data and a 200 status code
            return parent_attributes, 200
        except EmailNotValidError as e:
            return {"Error": f"Invalid email: {e}"}, 400
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(f"Error creating parent: {e}")
            return {"Error": "Internal Server Error"}, 500


# Route to log in a parent
@auth.route("/login", strict_slashes=False)
class Login(Resource):
    """
    Represents a resource for logging in a parent.
    """

    @auth.expect(login_model, validate=True)
    def post(self) -> tuple[dict, int]:
        """
        Log in a parent.

        Returns:
            A tuple containing a dictionary with the payload and an HTTP status code.
        """
        try:
            # Get the request data
            data = request.get_json()

            # Validate the data
            validate_non_empty_string(data["email"], "email")
            validate_email(data["email"])
            validate_non_empty_string(data["password"], "password")

            # Get the parent
            parent = get_parent(data["email"])

            # Return an error if no parent is found
            if not parent:
                return {
                    "Error": f"Parent with email '{data['email']}' not found"
                }, 401

            # Check the password
            if not check_password(data["email"], data["password"]):
                return {"Error": "Incorrect password"}, 401

            # Create an access token
            access_token = create_access_token(identity=parent.user_id)

            # Return the access token and a status code
            return {"access_token": access_token}, 200
        except EmailNotValidError as e:
            return {"Error": f"Invalid email: {e}"}, 400
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(f"Error logging in parent: {e}")
            return {"Error": "Internal Server Error"}, 500


@auth.route("/current_parent", strict_slashes=False)
class CurrentParent(Resource):
    """
    Represents a resource for retrieving the current parent.
    """

    # Get parent information
    @jwt_required()
    @auth.response(200, "Success")
    @auth.response(401, "Unauthorized, please log in")
    @auth.response(500, "Internal Server Error")
    def get(self) -> tuple[dict[str, str], int]:
        """
        Get the current authenticated parent.
        """
        try:
            # Get the parent
            parent = get_current_parent()

            # Return an error if the parent is not found, meaning the user is not logged in
            if not parent:
                return {"Error": "Unauthorized, please log in"}, 401

            # Get the parent's filtered attributes
            parent_attributes = get_entry_attributes(
                parent, exclude=["password"]
            )

            # Return the parent data and a 200 status code
            return parent_attributes, 200
        except Exception as e:
            current_app.logger.error(f"Error: {e}")
            return {"Error": "Internal Server Error"}, 500
