"""
This module contains tests for the stories namespace.
"""

import pytest
from flask.testing import FlaskClient
from uuid import uuid4

from api.database.models import Child, Story, Chapter


class TestGenerateStoryPost:
    """
    Test the POST method of the generate_story endpoint.
    """

    @staticmethod
    def test_success(
        client: FlaskClient, child: Child, access_token: str
    ) -> None:
        """
        Test the POST method of the generate_story endpoint.
        """
        response = client.post(
            "/api/stories/generate",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "child_id": child.child_id,
                "topic": "topic",
                "image_style": "Cartoon",
                "story_genre": "Fantasy",
            },
        )

        assert response.status_code == 200
        assert (
            "story_id" in response.json
            and response.json["story_id"] is not None
        )
        assert "title" in response.json and response.json["title"] is not None
        assert (
            "chapter_titles" in response.json
            and response.json["chapter_titles"] is not None
        )
        assert (
            "chapter_contents" in response.json
            and response.json["chapter_contents"] is not None
        )
        assert (
            "chapter_images" in response.json
            and response.json["chapter_images"] is not None
        )
        assert (
            "created_at" in response.json
            and response.json["created_at"] is not None
        )

    @staticmethod
    def test_unauthorized(client: FlaskClient, child: Child) -> None:
        """
        Test the POST method of the generate_story endpoint without a token.
        """
        response = client.post(
            "/api/stories/generate",
            json={
                "child_id": child.child_id,
                "topic": "topic",
                "image_style": "Cartoon",
                "story_genre": "Fantasy",
            },
        )

        assert response.status_code == 401
        assert "Missing Authorization Header" in response.json["msg"]

    @staticmethod
    def test_invalid_token(client: FlaskClient, child: Child) -> None:
        """
        Test the POST method of the generate_story endpoint with an invalid token.
        """
        response = client.post(
            "/api/stories/generate",
            headers={"Authorization": "Bearer invalid_token"},
            json={
                "child_id": child.child_id,
                "topic": "topic",
                "image_style": "Cartoon",
                "story_genre": "Fantasy",
            },
        )

        assert response.status_code == 422
        assert "Not enough segments" in response.json["msg"]

    @staticmethod
    def test_no_data_provided(client: FlaskClient, access_token: str) -> None:
        """
        Test the POST method of the generate_story endpoint with no data provided.
        """
        response = client.post(
            "/api/stories/generate",
            headers={"Authorization": f"Bearer {access_token}"},
            json={},
        )

        assert response.status_code == 400
        assert "Input payload validation failed" in response.json["message"]

    @pytest.mark.parametrize(
        "missing_field",
        [
            "child_id",
            "topic",
            "image_style",
            "story_genre",
        ],
    )
    def test_missing_fields(
        self,
        client: FlaskClient,
        missing_field: str,
        access_token: str,
    ) -> None:
        """
        Test the POST method of the generate_story endpoint with various missing fields.
        """
        story_attributes = {
            "child_id": "child_id",
            "topic": "topic",
            "image_style": "Cartoon",
            "story_genre": "Fantasy",
        }

        # Remove the missing field
        story_attributes.pop(missing_field)

        response = client.post(
            "/api/stories/generate",
            headers={"Authorization": f"Bearer {access_token}"},
            json=story_attributes,
        )

        assert response.status_code == 400
        assert missing_field in response.json["errors"]
        assert "Input payload validation failed" in response.json["message"]

    @pytest.mark.parametrize(
        "empty_field",
        [
            "child_id",
            "topic",
            "image_style",
            "story_genre",
        ],
    )
    def test_empty_inputs(
        self,
        client: FlaskClient,
        empty_field: str,
        child: Child,
        access_token: str,
    ) -> None:
        """
        Test the POST method of the generate_story endpoint with empty inputs.
        """
        story_attributes = {
            "child_id": child.child_id,
            "topic": "topic",
            "image_style": "Cartoon",
            "story_genre": "Fantasy",
        }

        # Set the empty field to an empty string
        story_attributes[empty_field] = ""

        response = client.post(
            "/api/stories/generate",
            headers={"Authorization": f"Bearer {access_token}"},
            json=story_attributes,
        )

        assert response.status_code == 400
        assert (
            response.json.get("errors") is not None
            or response.json.get("Error") is not None
        )

        if response.json.get("errors"):
            assert empty_field in response.json["errors"]
        else:
            assert empty_field in response.json["Error"]

    @pytest.mark.parametrize(
        "invalid_type",
        [
            "child_id",
            "topic",
            "image_style",
            "story_genre",
        ],
    )
    def test_invalid_types(
        self,
        client: FlaskClient,
        invalid_type: str,
        access_token: str,
    ) -> None:
        """
        Test the POST method of the generate_story endpoint with invalid types.
        """
        story_attributes = {
            "child_id": "child_id",
            "topic": "topic",
            "image_style": "Cartoon",
            "story_genre": "Fantasy",
        }

        # Set the invalid type
        story_attributes[invalid_type] = 123

        response = client.post(
            "/api/stories/generate",
            headers={"Authorization": f"Bearer {access_token}"},
            json=story_attributes,
        )

        assert response.status_code == 400
        assert invalid_type in response.json["errors"]
        assert "Input payload validation failed" in response.json["message"]
        assert (
            "is not one of" in response.json["errors"][invalid_type]
            or "is not of type 'string'"
            in response.json["errors"][invalid_type]
        )

    @pytest.mark.parametrize("invalid_field", ["image_style", "story_genre"])
    def test_none_inputs(
        self,
        client: FlaskClient,
        child: Child,
        access_token: str,
        invalid_field: str,
    ) -> None:
        """
        Test the POST method of the generate_story endpoint with None inputs.
        """
        story_attributes = {
            "child_id": child.child_id,
            "topic": "topic",
            "image_style": "Cartoon",
            "story_genre": "Fantasy",
        }

        # Set the invalid field to None
        story_attributes[invalid_field] = None

        response = client.post(
            "/api/stories/generate",
            headers={"Authorization": f"Bearer {access_token}"},
            json=story_attributes,
        )

        assert response.status_code == 400
        assert invalid_field in response.json["errors"]
        assert "Input payload validation failed" in response.json["message"]
        assert "None is not one of" in response.json["errors"][invalid_field]

    @staticmethod
    def test_invalid_child_id(client: FlaskClient, access_token: str) -> None:
        """
        Test the POST method of the generate_story endpoint with an invalid child_id.
        """
        response = client.post(
            "/api/stories/generate",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "child_id": "invalid_id",
                "topic": "topic",
                "image_style": "Cartoon",
                "story_genre": "Fantasy",
            },
        )

        assert response.status_code == 400
        assert (
            "child_id must be a valid UUID hex string"
            in response.json["Error"]
        )

    @staticmethod
    def test_child_not_found(client: FlaskClient, access_token: str) -> None:
        """
        Test the POST method of the generate_story endpoint with a child that does not exist.
        """
        child_id = uuid4().hex

        response = client.post(
            "/api/stories/generate",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "child_id": child_id,
                "topic": "topic",
                "image_style": "Cartoon",
                "story_genre": "Fantasy",
            },
        )

        assert response.status_code == 404
        assert (
            f"Child with ID '{child_id}' not found" in response.json["Error"]
        )

    @pytest.mark.parametrize("invalid_field", ["image_style", "story_genre"])
    def test_invalid_fields(
        self,
        client: FlaskClient,
        child: Child,
        access_token: str,
        invalid_field: str,
    ) -> None:
        """
        Test the POST method of the generate_story endpoint with invalid fields.
        """
        # Prepare the JSON payload dynamically based on the test parameters
        json_payload = {
            "child_id": child.child_id,
            "topic": "topic",
            "image_style": (
                "Cartoon"
                if invalid_field != "image_style"
                else "invalid_value"
            ),
            "story_genre": (
                "Fantasy"
                if invalid_field != "story_genre"
                else "invalid_value"
            ),
        }

        # Make the POST request with the prepared payload
        response = client.post(
            "/api/stories/generate",
            headers={"Authorization": f"Bearer {access_token}"},
            json=json_payload,
        )

        assert response.status_code == 400
        assert "Input payload validation failed" in response.json["message"]
        assert (
            "'invalid_value' is not one of"
            in response.json["errors"][invalid_field]
        )


class TestChildStoriesGet:
    """
    Test the GET method of the child_stories endpoint.
    """

    @staticmethod
    def test_success(
        client: FlaskClient, child: Child, story: Story, access_token: str
    ) -> None:
        """
        Test the GET method of the child_stories endpoint.
        """
        response = client.get(
            "/api/stories/child_stories",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"child_id": child.child_id},
        )

        assert response.status_code == 200
        assert "stories" in response.json

        # Check if the fixture story is in the response
        found_story_fixture = False

        for retrieved_story in response.json["stories"]:
            assert "story_id" in retrieved_story
            assert "child_id" in retrieved_story
            assert "title" in retrieved_story
            assert "topic" in retrieved_story
            assert "image_style" in retrieved_story
            assert "story_genre" in retrieved_story
            assert "created_at" in retrieved_story

            if retrieved_story["story_id"] == story.story_id:
                found_story_fixture = True
                assert retrieved_story["title"] == story.title
                assert retrieved_story["topic"] == story.topic
                assert retrieved_story["image_style"] == story.image_style
                assert retrieved_story["story_genre"] == story.story_genre
                assert retrieved_story["created_at"] == str(story.created_at)

        assert found_story_fixture

    @staticmethod
    def test_unauthorized(client: FlaskClient) -> None:
        """
        Test the GET method of the child_stories endpoint without a token.
        """
        response = client.get("/api/stories/child_stories")

        assert response.status_code == 401
        assert "Missing Authorization Header" in response.json["msg"]

    @staticmethod
    def test_invalid_token(client: FlaskClient) -> None:
        """
        Test the GET method of the child_stories endpoint with an invalid token.
        """
        response = client.get(
            "/api/stories/child_stories",
            headers={"Authorization": "Bearer invalid_token"},
        )

        assert response.status_code == 422
        assert "Not enough segments" in response.json["msg"]

    @staticmethod
    def test_no_data_provided(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the child_stories endpoint with no data provided.
        """
        response = client.get(
            "/api/stories/child_stories",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        assert response.status_code == 400
        assert "Parameter 'child_id' is required" in response.json["Error"]

    @staticmethod
    def test_empty_child_id(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the child_stories endpoint with a missing child_id.
        """
        response = client.get(
            "/api/stories/child_stories",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"child_id": ""},
        )

        assert response.status_code == 400
        assert "Parameter 'child_id' is required" in response.json["Error"]

    @staticmethod
    def test_invalid_child_id(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the child_stories endpoint with an invalid child_id.
        """
        response = client.get(
            "/api/stories/child_stories",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"child_id": "invalid_id"},
        )

        assert response.status_code == 400
        assert (
            "child_id must be a valid UUID hex string"
            in response.json["Error"]
        )

    @staticmethod
    def test_child_not_found(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the child_stories endpoint with a child that does not exist.
        """
        child_id = uuid4().hex

        response = client.get(
            "/api/stories/child_stories",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"child_id": child_id},
        )

        assert response.status_code == 404
        assert (
            f"Child with ID '{child_id}' not found" in response.json["Error"]
        )

    @staticmethod
    def test_no_child_id(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the child_stories endpoint with no child_id.
        """
        response = client.get(
            "/api/stories/child_stories",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        assert response.status_code == 400
        assert "Parameter 'child_id' is required" in response.json["Error"]


class TestStoryChaptersGet:
    """
    Test the GET method of the chapters endpoint.
    """

    @staticmethod
    def test_success(
        client: FlaskClient, story: Story, chapter: Chapter, access_token: str
    ) -> None:
        """
        Test the GET method of the chapters endpoint.
        """
        response = client.get(
            "/api/stories/chapters",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"story_id": story.story_id},
        )

        assert response.status_code == 200
        assert "chapters" in response.json

        # Check if the fixture story is in the response
        found_chapter_fixture = False

        for retrieved_chapter in response.json["chapters"]:
            assert "chapter_id" in retrieved_chapter
            assert "title" in retrieved_chapter
            assert "content" in retrieved_chapter
            assert "image" in retrieved_chapter
            assert "order" in retrieved_chapter

            if retrieved_chapter["chapter_id"] == chapter.chapter_id:
                found_chapter_fixture = True
                assert retrieved_chapter["title"] == chapter.title
                assert retrieved_chapter["content"] == chapter.content
                assert retrieved_chapter["image"] == chapter.image
                assert int(retrieved_chapter["order"]) == chapter.order

        assert found_chapter_fixture

    @staticmethod
    def test_unauthorized(client: FlaskClient) -> None:
        """
        Test the GET method of the chapters endpoint without a token.
        """
        response = client.get("/api/stories/chapters")

        assert response.status_code == 401
        assert "Missing Authorization Header" in response.json["msg"]

    @staticmethod
    def test_invalid_token(client: FlaskClient) -> None:
        """
        Test the GET method of the chapters endpoint with an invalid token.
        """
        response = client.get(
            "/api/stories/chapters",
            headers={"Authorization": "Bearer invalid_token"},
        )

        assert response.status_code == 422
        assert "Not enough segments" in response.json["msg"]

    @staticmethod
    def test_no_data_provided(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the chapters endpoint with no data provided.
        """
        response = client.get(
            "/api/stories/chapters",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        assert response.status_code == 400
        assert "Parameter 'story_id' is required" in response.json["Error"]

    @staticmethod
    def test_empty_story_id(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the chapters endpoint with a missing story_id.
        """
        response = client.get(
            "/api/stories/chapters",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"story_id": ""},
        )

        assert response.status_code == 400
        assert "Parameter 'story_id' is required" in response.json["Error"]

    @staticmethod
    def test_invalid_story_id(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the chapters endpoint with an invalid story_id.
        """
        response = client.get(
            "/api/stories/chapters",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"story_id": "invalid_id"},
        )

        assert response.status_code == 400
        assert (
            "story_id must be a valid UUID hex string"
            in response.json["Error"]
        )

    @staticmethod
    def test_story_not_found(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the chapters endpoint with a story that does not exist.
        """
        story_id = uuid4().hex

        response = client.get(
            "/api/stories/chapters",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"story_id": story_id},
        )

        assert response.status_code == 404
        assert (
            f"Story with ID '{story_id}' not found" in response.json["Error"]
        )

    @staticmethod
    def test_no_story_id(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the chapters endpoint with no story_id.
        """
        response = client.get(
            "/api/stories/chapters",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        assert response.status_code == 400
        assert "Parameter 'story_id' is required" in response.json["Error"]
