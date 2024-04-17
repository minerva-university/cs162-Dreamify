"""
This module contains the namespace and resources for managing stories.
"""

from flask import request, current_app
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required

from ..functions.prepare_data import assemble_story_payload_async
from ..functions.jwt_functions import get_current_parent
from ..functions.input_validation import (
    validate_non_empty_string,
    validate_id_format,
)
from ..database.queries import get_story, get_child_from_parent
from ..database.utilities import get_entry_attributes
from worker import conn
from rq import Queue
# Create a chapters namespace
stories = Namespace(
    "stories", path="/stories", description="Story management operations"
)


# Define a model for the story generation endpoint
generate_story_model = stories.model(
    "GenerateStory",
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
        "story_genre": fields.String(
            required=True,
            description="Genre of the story",
            enum=["Fantasy", "Adventure", "Educational"],
        ),
    },
)


@stories.route("/generate", strict_slashes=False)
class GenerateStory(Resource):
    """
    This class represents a resource for generating stories.
    """

    @jwt_required()
    @stories.expect(generate_story_model, validate=True)
    @stories.response(200, "Success")
    @stories.response(400, "Validation Error")
    @stories.response(500, "Internal Server Error")
    async def post(self):
        """
        Generate a story based on the provided data asynchronously.
        """
        try:
            # Get the parent
            parent = get_current_parent()

            # Return an error if the parent is not found, meaning the user is not logged in
            if not parent:
                return {"Error": "Unauthorized, please log in"}, 401

            # Get the data from the request
            data = request.get_json()

            # Validate the data
            validate_id_format(data["child_id"], "child_id")
            validate_non_empty_string(data["topic"], "topic")
            validate_non_empty_string(data["image_style"], "image_style")
            validate_non_empty_string(data["story_genre"], "story_genre")

            # Get the child
            child = get_child_from_parent(parent.user_id, data["child_id"])

            if not child:
                return {
                    "Error": f"Child with ID '{data['child_id']}' not found"
                }, 404

            # Assemble the payload asynchronously
            # payload = await assemble_story_payload_async(
            #     child_id=data["child_id"],
            #     topic=data["topic"],
            #     image_style=data["image_style"],
            #     story_genre=data["story_genre"],
            # )
            q = Queue(connection=conn)
            result = q.enqueue(assemble_story_payload_async,
                child_id=data["child_id"],
                topic=data["topic"],
                image_style=data["image_style"],
                story_genre=data["story_genre"],
            )

            # Return the payload and a 200 status code
            return result, 200
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(e)
            return {"Error": "Internal Server Error"}, 500


@stories.route("/child_stories", strict_slashes=False)
class ChildStories(Resource):
    """
    Represents the stories of a child.
    """

    @jwt_required()
    @stories.response(200, "Success")
    @stories.response(401, "Unauthorized, please log in")
    @stories.response(404, "Child Not Found")
    @stories.response(500, "Internal Server Error")
    @stories.doc(params={"child_id": "The ID of the child, required"})
    def get(self):
        """
        Get all stories for a child.
        """
        try:
            # Get the parent
            parent = get_current_parent()

            # Return an error if the parent is not found, meaning the user is not logged in
            if not parent:
                return {"Error": "Unauthorized, please log in"}, 401

            # Get the child_id from the query parameter
            child_id = request.args.get("child_id", None)

            # Return an error if child_id is not provided
            if not child_id:
                return {"Error": "Parameter 'child_id' is required"}, 400

            # Validate the child_id
            validate_id_format(child_id, "child_id")

            # Get the child
            child = get_child_from_parent(parent.user_id, child_id)

            # Return an error if the child does not exist
            if not child:
                return {"Error": f"Child with ID '{child_id}' not found."}, 404

            # Define the payload
            payload = {
                "stories": [
                    # Get the attributes of the story
                    get_entry_attributes(story)
                    for story in child.stories
                ]
            }

            # Return the story data and a 200 status code
            return payload, 200
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(f"Error: {e}")
            return {"Error": "Internal Server Error"}, 500


@stories.route("/chapters", strict_slashes=False)
class StoryChapters(Resource):
    """
    Represents the chapters of a story.
    """

    @jwt_required()
    @stories.response(200, "Success")
    @stories.response(404, "Story Not Found")
    @stories.response(500, "Internal Server Error")
    @stories.doc(params={"story_id": "The ID of the story, required"})
    def get(self):
        """
        Get all chapters for a story.
        """
        try:
            # Get the parent
            parent = get_current_parent()

            # Return an error if the parent is not found, meaning the user is not logged in
            if not parent:
                return {"Error": "Unauthorized, please log in"}, 401
            # Use query parameter to get story_id
            story_id = request.args.get("story_id", None)

            # Return an error if story_id is not provided
            if not story_id:
                return {"Error": "Parameter 'story_id' is required"}, 400

            # Validate the story_id
            validate_id_format(story_id, "story_id")

            # Get the story
            story = get_story(story_id)

            # Return an error if the story does not exist
            if not story:
                return {"Error": f"Story with ID '{story_id}' not found."}, 404

            # Define the payload
            payload = {
                "story_title": story.title,
                "chapters": [
                    # Get the attributes of the chapter
                    get_entry_attributes(chapter)
                    for chapter in story.chapters
                ],
            }

            # Return the story data and a 200 status code
            return payload, 200
        except ValueError as e:
            return {"Error": str(e)}, 400
        except Exception as e:
            current_app.logger.error(f"Error: {e}")
            return {"Error": "Internal Server Error"}, 500
