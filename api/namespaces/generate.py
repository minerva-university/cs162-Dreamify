"""
This module contains the generate namespace and related operations.
"""

from flask import request, current_app
from flask_restx import Namespace, Resource, fields

from ..functions.prepare_data import assemble_payload

# Create a generate namespace
generate = Namespace(
    "generate", path="/generate", description="Generation operations"
)


# Define a model for the story generation endpoint
story_model = generate.model(
    "Story",
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


# TODO: return openai_response instead of story_prompt
@generate.route("/story")
class GenerateStory(Resource):
    """
    This class represents a resource for generating stories.
    """

    @generate.expect(story_model, validate=True)
    @generate.response(200, "Success")
    @generate.response(400, "Validation Error")
    @generate.response(500, "Internal Server Error")
    def post(self):
        """
        Generate a story based on the provided data.
        """
        try:
            # Get the data from the request
            data = request.json

            # Return an error if no data is provided and a 400 status code
            if not data:
                return {"Error": "No data provided"}, 400

            # Assemble the payload
            payload = assemble_payload(
                child_id=data["child_id"],
                topic=data["topic"],
                image_style=data["image_style"],
            )

            # Return the payload and a 200 status code
            return payload, 200
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(e)
            return {"Error": "Internal Server Error"}, 500
