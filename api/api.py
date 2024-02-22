"""
This module contains the API routes for the Dreamify application.
"""

from flask import Blueprint, request, current_app
from flask_restx import Api, Resource
from flask_restx import fields

from .functions.prepare_data import assemble_payload
from .database.inserts import insert_child, insert_parent
from .database.queries import get_child, get_current_parent

# Create a blueprint for the API
api_blueprint = Blueprint("api", __name__, url_prefix="/api")

# Create a Flask RESTX API instance
api = Api(
    api_blueprint,
    version="1.0",
    title="Dreamify API",
    description="A Flask RESTX powered API for Dreamify",
)


# Define the model for the story data
story_model = api.model(
    "StoryModel",
    {
        "child_id": fields.String(
            required=True, description="The ID of the kid"
        ),
        "topic": fields.String(
            required=True, description="Topic of the story"
        ),
        "image_style": fields.String(
            required=True,
            description="Style of the image",
            enum=["Cartoon", "Realistic", "Fantasy", "Watercolor", "Anime"],
        ),
    },
)

add_child_model = api.model(
    "ChildModel",
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

get_child_model = api.model(
    "GetChildModel",
    {
        "child_id": fields.String(
            required=True, description="The ID of the child"
        )
    },
)

add_parent_model = api.model(
    "ParentModel",
    {
        "first_name": fields.String(
            required=True, description="First name of the parent"
        ),
        "last_name": fields.String(
            required=True, description="Last name of the parent"
        ),
        "email": fields.String(
            required=True, unique=True, description="Email of the parent"
        ),
        "password": fields.String(
            required=True, description="Password of the parent"
        ),
    },
)


# TODO: return openai_response instead of story_prompt
@api.route("/generate/story")
class GenerateStory(Resource):
    @api.expect(story_model, validate=True)
    @api.response(200, "Success")
    @api.response(400, "Validation Error")
    @api.response(500, "Internal Server Error")
    def post(self):

        try:
            # Get the data from the request
            data = request.json

            payload = assemble_payload(
                child_id=data["child_id"],
                topic=data["topic"],
                image_style=data["image_style"],
            )

            return payload, 200
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(e)
            return {"Error": "Internal Server Error"}, 500


@api.route("/add_parent")
class AddParent(Resource):
    @api.expect(add_parent_model, validate=True)
    @api.response(200, "Success")
    @api.response(400, "Validation Error")
    @api.response(500, "Internal Server Error")
    def post(self):
        try:
            # Get the data from the request
            data = request.json

            # Insert the parent into the database
            parent_id = insert_parent(data)

            # Return the parent ID and a 200 status code
            return {"parent_id": parent_id}, 200
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(e)
            return {"Error": "Internal Server Error"}, 500


@api.route("/get_parent")
class Parent(Resource):
    @api.response(200, "Success")
    @api.response(404, "Parent Not Found")
    @api.response(500, "Internal Server Error")
    def get(self):
        try:
            # Get the parent data
            parent_info = get_current_parent()

            # Return the parent data and a 200 status code
            return parent_info, 200
        except ValueError as e:
            return {"Error": str(e)}, 404
        except Exception as e:
            current_app.logger.error(f"Error: {e}")
            return {"Error": "Internal Server Error"}, 500


@api.route("/add_child")
class AddChild(Resource):
    @api.expect(add_child_model, validate=True)
    @api.response(200, "Success")
    @api.response(400, "Validation Error")
    @api.response(500, "Internal Server Error")
    def post(self):
        try:
            # Get the data from the request
            data = request.json

            # Insert the child into the database
            child_id = insert_child(data)

            # Return the child ID and a 200 status code
            return {"child_id": child_id}, 200
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(e)
            return {"Error": "Internal Server Error"}, 500


@api.route("/get_child")
class Child(Resource):
    @api.expect(get_child_model, validate=True)
    @api.response(200, "Success")
    @api.response(404, "Child Not Found")
    @api.response(500, "Internal Server Error")
    def post(self):
        try:
            # Get the data from the request

            data = request.json
            # Get the child data
            child_info = get_child(data["child_id"])

            # Return the child data and a 200 status code
            return child_info, 200
        except ValueError as e:
            return {"Error": str(e)}, 404
        except Exception as e:
            current_app.logger.error(f"Error: {e}")
            return {"Error": "Internal Server Error"}, 500
