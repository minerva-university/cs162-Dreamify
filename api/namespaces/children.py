"""
This module contains the namespace and resources for managing children.
"""

from flask import request, current_app
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required

from ..database.queries import get_child_from_parent
from ..database.inserts import insert_child
from ..database.updates import update_child_info, child_belongs_to_parent
from ..functions.jwt_functions import get_current_parent

# Create a children namespace
children = Namespace(
    "children", path="/children", description="Child management operations"
)


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
        "sibling_relationship": fields.String(
            required=False,
            description="Sibling relationship of the child",
            enum=["Only", "Youngest", "Middle", "Oldest"],
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
        "skin_tone": fields.String(
            required=False,
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

            # Insert the child into the database
            child_attributes = insert_child(
                parent.user_id,
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
            return child_attributes, 200
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
                "sibling_relationship": data.get("sibling_relationship"),
                "eye_color": data.get("eye_color"),
                "hair_type": data.get("hair_type"),
                "hair_color": data.get("hair_color"),
                "skin_tone": data.get("skin_tone"),
                "fav_animals": data.get("fav_animals"),
                "fav_activities": data.get("fav_activities"),
                "fav_shows": data.get("fav_shows"),
            }

            # Remove keys with None values
            updates = {k: v for k, v in updates.items() if v is not None}

            # Update the child using the new update_child_info function
            updated_child = update_child_info(child_id, updates)

            # Prepare all child attributes to be used in frontend
            child_attributes = {
                "name": updated_child.name,
                "age_range": updated_child.age_range,
                "sex": updated_child.sex,
                "sibling_relationship": updated_child.sibling_relationship,
                "eye_color": updated_child.eye_color,
                "hair_type": updated_child.hair_type,
                "hair_color": updated_child.hair_color,
                "skin_tone": updated_child.skin_tone,
                "fav_animals": updated_child.fav_animals,
                "fav_activities": updated_child.fav_activities,
                "fav_shows": updated_child.fav_shows,
            }

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
                    {
                        # Get all attributes of the child but not the private ones
                        attribute: getattr(child, attribute)
                        for attribute in vars(child)
                        if not attribute.startswith("_")
                    }
                    for child in parent.children
                ]
            }

            # Return the child data and a 200 status code
            return payload, 200
        except Exception as e:
            current_app.logger.error(f"Error: {e}")
            return {"Error": "Internal Server Error"}, 500
