"""
This module contains the API routes for the Dreamify application.
"""

from flask import Blueprint, request, current_app
from flask_restx import Api, Resource
from flask_restx import fields

from .functions.prepare_data import assemble_payload

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
        "story_topic": fields.String(
            required=True, description="Topic of the story"
        ),
        "story_image_style": fields.String(
            required=True, description="Style of the image"
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
                story_topic=data["story_topic"],
                image_style=data["story_image_style"],
            )

            return payload, 200
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(e)
            return {"Error": "Internal Server Error"}, 500
