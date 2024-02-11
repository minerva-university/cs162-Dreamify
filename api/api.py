"""
This module contains the API routes for the Dreamify application.
"""

from flask import Blueprint, request
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
    description="A Flask RESTX powered API for story generation",
)


# Define the model for the story data
story_model = api.model(
    "StoryModel",
    {
        "kid_id": fields.String(required=True, description="The ID of the kid"),
        "story_a_topic": fields.String(required=True, description="Topic of the story"),
        "story_b_image_style": fields.String(
            required=True, description="Style of the image"
        ),
    },
)


# TODO: return openai_response instead of story_prompt
@api.route("/generate/story")
class GenerateStory(Resource):
    @api.expect(story_model)
    @api.response(200, "Success")
    @api.response(400, "Validation Error")
    @api.response(500, "Internal Server Error")
    def post(self):
        """
        Generate a story chapters and images.
        """
        try:
            # Get the data from the request
            data = request.json

            # Check if the required parameters are present
            missing_parameters = [
                field for field in story_model.keys() if field not in data
            ]
            # If any required parameters are missing, return an error
            if missing_parameters:
                return {
                    "message": f"Error: missing parameter(s): {', '.join(missing_parameters)}"
                }, 400

            payload = assemble_payload(
                kid_id=data["kid_id"],
                story_topic=data["story_a_topic"],
                image_style=data["story_b_image_style"],
            )

            return payload, 200
        except Exception as e:
            return {"Error": str(e)}, 500
