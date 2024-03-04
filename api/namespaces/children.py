"""
This module contains the namespace and resources for managing children.
"""

from flask import request, current_app
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required

from ..database.queries import get_child_from_parent
from ..database.inserts import insert_child
from ..functions.jwt_functions import get_current_parent

# Create a children namespace
children = Namespace(
    "children", path="/children", description="Child management operations"
)


add_child_model = children.model(
    "AddChild",
    {
        "parent_id": fields.String(
            required=True, description="The ID of the parent"
        ),
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
        "sibling_relationship": fields.String(
            required=True,
            description="Sibling relationship of the child",
            enum=["Only", "Youngest", "Middle", "Oldest"],
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
        "skin_tone": fields.String(
            required=True,
            description="Skin tone of the child",
            enum=["Fair", "Light", "Medium", "Tan", "Brown", "Dark"],
        ),
        "fav_animals": fields.String(
            required=False, description="Favorite animals of the child"
        ),
        "fav_activities": fields.String(
            required=False, description="Favorite activities of the child"
        ),
        "fav_shows": fields.String(
            required=False, description="Favorite shows of the child"
        ),
    },
)


@children.route("/")
class Child(Resource):
    """
    Represents a child resource.
    """

    @jwt_required()
    @children.response(200, "Success")
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

            # Return the child data and a 200 status code
            return {
                # Get all attributes of the child but not the private ones
                attribute: getattr(child, attribute)
                for attribute in vars(child)
                if not attribute.startswith("_")
            }, 200
        except ValueError as e:
            return {"Error": str(e)}, 404
        except Exception as e:
            current_app.logger.error(f"Error: {e}")
            return {"Error": "Internal Server Error"}, 500

    @jwt_required()
    @children.expect(add_child_model, validate=True)
    @children.response(200, "Success")
    @children.response(400, "Validation Error")
    @children.response(500, "Internal Server Error")
    def post(self):
        """
        Add a child.
        """
        try:
            # Get the data from the request
            data = request.get_json()

            if not data:
                return {"Error": "No data provided"}, 400

            # Insert the child into the database
            child_id = insert_child(
                data["parent_id"],
                data["name"],
                data["age_range"],
                data["sex"],
                data["sibling_relationship"],
                data["eye_color"],
                data["hair_type"],
                data["hair_color"],
                data["skin_tone"],
                data.get("fav_animals"),
                data.get("fav_activities"),
                data.get("fav_shows"),
            )

            # Return the child ID and a status code
            return {"child_id": child_id}, 200
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(e)
            return {"Error": "Internal Server Error"}, 500
