"""
This module contains the namespace and resources for managing children.
"""

from flask import request, current_app
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required

from ..functions.prepare_data import assemble_child_payload
from ..database.queries import get_child_from_parent
from ..database.updates import update_child, child_belongs_to_parent
from ..database.utilities import get_entry_attributes
from ..functions.jwt_functions import get_current_parent

# Create a children namespace
children = Namespace(
    "children", path="/children", description="Child management operations"
)


class NullableString(fields.String):
    """
    Custom field for a nullable string.
    """

    __schema_type__ = ["string", "null"]
    __schema_example__ = "nullable string"


add_child_model = children.model(
    "AddChild",
    {
        "name": fields.String(required=True, description="Name of the child"),
        "age_range": fields.String(
            required=True,
            description="Age range of the child",
            enum=["0-3", "4-6", "7-9", "10-13"],
        ),
        "sex": fields.String(
            required=True,
            description="Sex of the child",
            enum=["Male", "Female"],
        ),
        "eye_color": fields.String(
            required=True,
            description="Eye color of the child",
            enum=["Blue", "Brown", "Green", "Hazel", "Amber", "Gray"],
        ),
        "hair_type": fields.String(
            required=True,
            description="Hair type of the child",
            enum=["Straight", "Wavy", "Curly", "Kinky", "Bald"],
        ),
        "hair_color": fields.String(
            required=True,
            description="Hair color of the child",
            enum=[
                "Blonde",
                "Brown",
                "Black",
                "Red",
                "Auburn",
                "Grey",
                "White",
            ],
        ),
        "ethnicity": fields.String(
            required=True,
            description="Ethnicity of the child",
        ),
        "fav_animals": NullableString(
            required=False,
            description="Favorite animals of the child",
        ),
        "fav_activities": NullableString(
            required=False,
            description="Favorite activities of the child",
        ),
        "fav_shows": NullableString(
            required=False,
            description="Favorite shows of the child",
        ),
    },
)

modify_child_model = children.model(
    "ModifyChild",
    {
        "name": fields.String(required=False, description="Name of the child"),
        "age_range": fields.String(
            required=False,
            description="Age range of the child",
            enum=["0-3", "4-6", "7-9", "10-13"],
        ),
        "sex": fields.String(
            required=False,
            description="Sex of the child",
            enum=["Male", "Female"],
        ),
        "eye_color": fields.String(
            required=False,
            description="Eye color of the child",
            enum=["Blue", "Brown", "Green", "Hazel", "Amber", "Gray"],
        ),
        "hair_type": fields.String(
            required=False,
            description="Hair type of the child",
            enum=["Straight", "Wavy", "Curly", "Kinky", "Bald"],
        ),
        "hair_color": fields.String(
            required=False,
            description="Hair color of the child",
            enum=[
                "Blonde",
                "Brown",
                "Black",
                "Red",
                "Auburn",
                "Grey",
                "White",
            ],
        ),
        "ethnicity": fields.String(
            required=False, description="Ethnicity of the child"
        ),
        "fav_animals": NullableString(
            required=False,
            description="Favorite animals of the child",
        ),
        "fav_activities": NullableString(
            required=False,
            description="Favorite activities of the child",
        ),
        "fav_shows": NullableString(
            required=False,
            description="Favorite shows of the child",
        ),
    },
)


@children.route("/", strict_slashes=False)
class Child(Resource):
    """
    Represents a child resource.
    """

    @jwt_required()
    @children.response(200, "Success")
    @children.response(400, "Validation Error")
    @children.response(401, "Unauthorized, please log in")
    @children.response(404, "Child Not Found")
    @children.response(500, "Internal Server Error")
    @children.doc(params={"child_id": "The ID of the child, required"})
    def get(self):
        """
        Get a child by ID.
        """
        try:
            # Use query parameter to get child_id
            child_id = request.args.get("child_id", None)

            # Return an error if child_id is not provided
            if not child_id:
                return {"Error": "Parameter 'child_id' is required"}, 400

            # Get the current parent
            parent = get_current_parent()

            # Return an error if the parent does not exist,
            # meaning the user is not logged in
            if not parent:
                return {"error": "Unauthorized, please log in"}, 401

            # Get the child
            child = get_child_from_parent(parent.user_id, child_id)

            # Return an error if the child does not exist
            if not child:
                return {"Error": f"Child with ID '{child_id}' not found"}, 404

            # Get the child's attributes
            child_attributes = get_entry_attributes(child)

            # Return the child data and a 200 status code
            return child_attributes, 200
        except ValueError as e:
            return {"Error": str(e)}, 404
        except Exception as e:
            current_app.logger.error(f"Error: {e}")
            return {"Error": "Internal Server Error"}, 500

    @jwt_required()
    @children.expect(add_child_model, validate=True)
    @children.response(200, "Success")
    @children.response(400, "Validation Error")
    @children.response(401, "Unauthorized, please log in")
    @children.response(500, "Internal Server Error")
    def post(self):
        """
        Add a child.
        """
        try:
            # Get the data from the request
            data = request.get_json()

            # Return an error if no data is provided
            if not data:
                return {"Error": "No data provided"}, 400

            # Get the current parent
            parent = get_current_parent()

            # Return an error if the parent does not exist,
            # meaning the user is not logged in
            if not parent:
                return {"Error": "Unauthorized, please log in"}, 401

            # Assemble the child payload
            payload = assemble_child_payload(
                parent.user_id,
                data["name"],
                data["age_range"],
                data["sex"],
                data["eye_color"],
                data["hair_type"],
                data["hair_color"],
                data["ethnicity"],
                data.get("fav_animals"),
                data.get("fav_activities"),
                data.get("fav_shows"),
            )

            # Return the child data and a 200 status code
            return payload, 200
        except Exception as e:
            current_app.logger.error(e)
            return {"Error": "Internal Server Error"}, 500

    @jwt_required()
    @children.expect(modify_child_model, validate=True)
    @children.response(200, "Success")
    @children.response(400, "Validation Error")
    @children.response(401, "Unauthorized, please log in")
    @children.response(404, "Child Not Found")
    @children.response(500, "Internal Server Error")
    def patch(self):
        """
        Modify a child's attributes.
        """
        try:
            # Get the data from the request
            data = request.get_json()

            # Return an error if no data is provided
            if not data:
                return {"Error": "No data provided"}, 400

            # Get the current parent
            parent = get_current_parent()

            # Return an error if the parent does not exist,
            # meaning the user is not logged in
            if not parent:
                return {"Error": "Unauthorized, please log in"}, 401

            # Check if the child belongs to the current parent
            child_id = data.get("child_id")
            if not child_id or not child_belongs_to_parent(
                parent.user_id, child_id
            ):
                return {"Error": "Child not found"}, 404

            # Prepare the updates
            updates = {
                "name": data.get("name"),
                "age_range": data.get("age_range"),
                "sex": data.get("sex"),
                "eye_color": data.get("eye_color"),
                "hair_type": data.get("hair_type"),
                "hair_color": data.get("hair_color"),
                "ethnicity": data.get("ethnicity"),
                "fav_animals": data.get("fav_animals"),
                "fav_activities": data.get("fav_activities"),
                "fav_shows": data.get("fav_shows"),
            }

            # Update the child using the new update_child_info function
            updated_child = update_child(child_id, updates)

            # Get the updated child's attributes
            child_attributes = get_entry_attributes(updated_child)

            # Return the updated child data and a 200 status code
            return child_attributes, 200

        except ValueError as e:
            return {"Error": str(e)}, 404
        except Exception as e:
            current_app.logger.error(e)
            return {"Error": "Internal Server Error"}, 500


@children.route("/all", strict_slashes=False)
class AllChildren(Resource):
    """
    Represents all children for a parent.
    """

    @jwt_required()
    @children.response(200, "Success")
    @children.response(401, "Unauthorized, please log in")
    @children.response(500, "Internal Server Error")
    def get(self):
        """
        Get all children for a parent.
        """
        try:
            # Get the current parent
            parent = get_current_parent()

            # Return an error if the parent does not exist,
            # meaning the user is not logged in
            if not parent:
                return {"error": "Unauthorized, please log in"}, 401

            # Define the payload
            payload = {
                "children": [
                    get_entry_attributes(child) for child in parent.children
                ]
            }

            # Return the child data and a 200 status code
            return payload, 200
        except Exception as e:
            current_app.logger.error(f"Error: {e}")
            return {"Error": "Internal Server Error"}, 500
