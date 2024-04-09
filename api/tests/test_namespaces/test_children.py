"""
This module contains tests for the children namespace.
"""

import pytest
from flask.testing import FlaskClient
from uuid import uuid4

from api.database.models import Child


class TestChildGet:
    """
    Test the GET method of the children endpoint.
    """

    @staticmethod
    def test_success(
        client: FlaskClient, child: Child, access_token: str
    ) -> None:
        """
        Test if the GET method of the children endpoint returns the child's information.
        """
        response = client.get(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"child_id": child.child_id},
        )

        assert response.status_code == 200

        # Check if the response keys are a subset of the child's keys
        response_keys = set(response.json.keys())
        child_keys = set(child.__dict__.keys())
        assert response_keys.issubset(child_keys)

        # Check if the response values match the child's values
        assert response.json["child_id"] == child.child_id
        assert response.json["name"] == child.name
        assert response.json["age_range"] == child.age_range
        assert response.json["sex"] == child.sex
        assert response.json["eye_color"] == child.eye_color
        assert response.json["hair_type"] == child.hair_type
        assert response.json["hair_color"] == child.hair_color
        assert response.json["ethnicity"] == child.ethnicity
        assert response.json["fav_animals"] == child.fav_animals
        assert response.json["fav_activities"] == child.fav_activities
        assert response.json["fav_shows"] == child.fav_shows

    @staticmethod
    def test_missing_child_id(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the children endpoint with a missing child_id.
        """
        response = client.get(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        assert response.status_code == 400
        assert "Parameter 'child_id' is required" in response.json["Error"]

    @staticmethod
    def test_unauthorized(client: FlaskClient) -> None:
        """
        Test the GET method of the children endpoint without a token.
        """
        response = client.get("/api/children")

        assert response.status_code == 401
        assert "Missing Authorization Header" in response.json["msg"]

    @staticmethod
    def test_invalid_token(client: FlaskClient) -> None:
        """
        Test the GET method of the children endpoint with an invalid token.
        """
        response = client.get(
            "/api/children",
            headers={"Authorization": "Bearer invalid_token"},
        )

        assert response.status_code == 422
        assert "Not enough segments" in response.json["msg"]

    @staticmethod
    def test_invalid_id_format(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the children endpoint with an invalid child_id format.
        """
        response = client.get(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"child_id": "invalid_id"},
        )

        assert response.status_code == 400
        assert (
            "child_id must be a valid UUID hex string"
            in response.json["Error"]
        )

    @staticmethod
    def test_empty_id(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the children endpoint with an empty child_id.
        """
        response = client.get(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"child_id": ""},
        )

        assert response.status_code == 400
        assert "Parameter 'child_id' is required" in response.json["Error"]

    @staticmethod
    def test_child_not_found(client: FlaskClient, access_token: str) -> None:
        """
        Test the GET method of the children endpoint with a child that does not exist.
        """
        child_id = uuid4().hex

        response = client.get(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            query_string={"child_id": child_id},
        )

        assert response.status_code == 404
        assert (
            f"Child with ID '{child_id}' not found" in response.json["Error"]
        )


class TestChildPost:
    """
    Test the POST method of the children endpoint.
    """

    @staticmethod
    def test_success(client: FlaskClient, access_token: str) -> None:
        """
        Test the POST method of the children endpoint.
        """
        response = client.post(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "name": "Success",
                "age_range": "0-3",
                "sex": "Male",
                "eye_color": "Blue",
                "hair_type": "Straight",
                "hair_color": "Blonde",
                "ethnicity": "Asian",
            },
        )

        assert response.status_code == 200

        assert "child_id" in response.json
        assert "name" in response.json
        assert "age_range" in response.json
        assert "sex" in response.json
        assert "eye_color" in response.json
        assert "hair_type" in response.json
        assert "hair_color" in response.json
        assert "ethnicity" in response.json
        assert "fav_animals" in response.json
        assert "fav_activities" in response.json
        assert "fav_shows" in response.json

    @staticmethod
    def test_unauthorized(client: FlaskClient) -> None:
        """
        Test the POST method of the children endpoint without a token.
        """
        response = client.post(
            "/api/children",
            json={
                "name": "Unauthorized",
                "age_range": "0-3",
                "sex": "Male",
                "eye_color": "Blue",
                "hair_type": "Straight",
                "hair_color": "Blonde",
                "ethnicity": "Asian",
            },
        )

        assert response.status_code == 401
        assert "Missing Authorization Header" in response.json["msg"]

    @staticmethod
    def test_invalid_token(client: FlaskClient) -> None:
        """
        Test the POST method of the children endpoint with an invalid token.
        """
        response = client.post(
            "/api/children",
            headers={"Authorization": "Bearer invalid_token"},
            json={
                "name": "InvalidToken",
                "age_range": "0-3",
                "sex": "Male",
                "eye_color": "Blue",
                "hair_type": "Straight",
                "hair_color": "Blonde",
                "ethnicity": "Asian",
            },
        )

        assert response.status_code == 422
        assert "Not enough segments" in response.json["msg"]

    @staticmethod
    def test_no_data_provided(client: FlaskClient, access_token: str) -> None:
        """
        Test the POST method of the children endpoint with no data provided.
        """
        response = client.post(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json={},
        )

        assert response.status_code == 400
        assert "Input payload validation failed" in response.json["message"]

    @pytest.mark.parametrize(
        "missing_field",
        [
            "name",
            "age_range",
            "sex",
            "eye_color",
            "hair_type",
            "hair_color",
            "ethnicity",
        ],
    )
    def test_missing_fields(
        self,
        client: FlaskClient,
        missing_field: str,
        access_token: str,
    ) -> None:
        """
        Test the POST method of the children endpoint with various missing fields.
        """
        child_attributes = {
            "name": "Missing",
            "age_range": "0-3",
            "sex": "Male",
            "eye_color": "Blue",
            "hair_type": "Straight",
            "hair_color": "Blonde",
            "ethnicity": "Asian",
        }

        # Remove the missing field
        child_attributes.pop(missing_field)

        response = client.post(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json=child_attributes,
        )

        assert response.status_code == 400
        assert missing_field in response.json["errors"]
        assert "Input payload validation failed" in response.json["message"]

    @pytest.mark.parametrize(
        "empty_field",
        [
            "name",
            "age_range",
            "sex",
            "eye_color",
            "hair_type",
            "hair_color",
            "ethnicity",
        ],
    )
    def test_empty_inputs(
        self,
        client: FlaskClient,
        empty_field: str,
        access_token: str,
    ) -> None:
        """
        Test the POST method of the children endpoint with empty inputs.
        """
        child_attributes = {
            "name": "Empty",
            "age_range": "0-3",
            "sex": "Male",
            "eye_color": "Blue",
            "hair_type": "Straight",
            "hair_color": "Blonde",
            "ethnicity": "Asian",
        }

        # Set the empty field to an empty string
        child_attributes[empty_field] = ""

        response = client.post(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json=child_attributes,
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
            "name",
            "age_range",
            "sex",
            "eye_color",
            "hair_type",
            "hair_color",
            "ethnicity",
        ],
    )
    def test_invalid_types(
        self,
        client: FlaskClient,
        invalid_type: str,
        access_token: str,
    ) -> None:
        """
        Test the POST method of the children endpoint with invalid types.
        """
        child_attributes = {
            "name": "InvalidType",
            "age_range": "0-3",
            "sex": "Male",
            "eye_color": "Blue",
            "hair_type": "Straight",
            "hair_color": "Blonde",
            "ethnicity": "Asian",
            "fav_animals": "Dogs",
            "fav_activities": "Playing",
            "fav_shows": "Paw Patrol",
        }

        # Set the invalid type
        child_attributes[invalid_type] = 123

        response = client.post(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json=child_attributes,
        )

        assert response.status_code == 400
        assert invalid_type in response.json["errors"]
        assert "Input payload validation failed" in response.json["message"]
        assert (
            "is not one of" in response.json["errors"][invalid_type]
            or "is not of type 'string'"
            in response.json["errors"][invalid_type]
        )

    @pytest.mark.parametrize(
        "invalid_field",
        ["age_range", "sex", "eye_color", "hair_type", "hair_color"],
    )
    def test_invalid_fields(
        self,
        client: FlaskClient,
        child: Child,
        access_token: str,
        invalid_field: str,
    ) -> None:
        """
        Test the POST method of the children endpoint with invalid fields.
        """
        # Prepare the JSON payload dynamically based on the test parameters
        json_payload = {
            "child_id": child.child_id,
            "name": "name",
            "age_range": (
                "0-3" if invalid_field != "age_range" else "invalid_value"
            ),
            "sex": "Male" if invalid_field != "sex" else "invalid_value",
            "eye_color": (
                "Blue" if invalid_field != "eye_color" else "invalid_value"
            ),
            "hair_type": (
                "Straight" if invalid_field != "hair_type" else "invalid_value"
            ),
            "hair_color": (
                "Blonde" if invalid_field != "hair_color" else "invalid_value"
            ),
            "ethnicity": "Asian",
            "fav_animals": "Dogs",
            "fav_activities": "Playing",
            "fav_shows": "Paw Patrol",
        }

        # Make the POST request with the prepared payload
        response = client.post(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json=json_payload,
        )

        assert (
            response.status_code == 400
        ), "Expected status code 400 for invalid input"
        assert "Input payload validation failed" in response.json["message"]


class TestChildPatch:
    """
    Test the PATCH method of the children endpoint.
    """

    @staticmethod
    def test_success(
        client: FlaskClient, child_to_update: Child, access_token: str
    ) -> None:
        """
        Test the PATCH method of the children endpoint.
        """
        response = client.patch(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "child_id": child_to_update.child_id,
                "name": "Updated",
                "age_range": "4-6",
                "sex": "Male",
                "eye_color": "Brown",
                "hair_type": "Wavy",
                "hair_color": "Brown",
                "ethnicity": "Black",
            },
        )

        assert response.status_code == 200

        assert "child_id" in response.json
        assert "name" in response.json
        assert "age_range" in response.json
        assert "sex" in response.json
        assert "eye_color" in response.json
        assert "hair_type" in response.json
        assert "hair_color" in response.json
        assert "ethnicity" in response.json

        for key, value in response.json.items():
            assert response.json[key] == value

    @staticmethod
    def test_unauthorized(client: FlaskClient, child_to_update: Child) -> None:
        """
        Test the PATCH method of the children endpoint without a token.
        """
        response = client.patch(
            "/api/children",
            json={
                "child_id": child_to_update.child_id,
                "name": "Unauthorized",
                "age_range": "4-6",
                "sex": "Male",
                "eye_color": "Brown",
                "hair_type": "Wavy",
                "hair_color": "Brown",
                "ethnicity": "Black",
            },
        )

        assert response.status_code == 401
        assert "Missing Authorization Header" in response.json["msg"]

    @staticmethod
    def test_invalid_token(
        client: FlaskClient, child_to_update: Child
    ) -> None:
        """
        Test the PATCH method of the children endpoint with an invalid token.
        """
        response = client.patch(
            "/api/children",
            headers={"Authorization": "Bearer invalid_token"},
            json={
                "child_id": child_to_update.child_id,
                "name": "InvalidToken",
                "age_range": "4-6",
                "sex": "Male",
                "eye_color": "Brown",
                "hair_type": "Wavy",
                "hair_color": "Brown",
                "ethnicity": "Black",
            },
        )

        assert response.status_code == 422
        assert "Not enough segments" in response.json["msg"]

    @staticmethod
    def test_no_data_provided(client: FlaskClient, access_token: str) -> None:
        """
        Test the PATCH method of the children endpoint with no data provided.
        """
        response = client.patch(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json={},
        )

        assert response.status_code == 400
        assert "Input payload validation failed" in response.json["message"]

    @pytest.mark.parametrize(
        "missing_field",
        [
            "name",
            "age_range",
            "sex",
            "eye_color",
            "hair_type",
            "hair_color",
            "ethnicity",
        ],
    )
    def test_missing_fields(
        self,
        client: FlaskClient,
        missing_field: str,
        child_to_update: Child,
        access_token: str,
    ) -> None:
        """
        Test the PATCH method of the children endpoint with various missing fields.
        """
        child_attributes = {
            "child_id": child_to_update.child_id,
            "name": "Updated",
            "age_range": "4-6",
            "sex": "Male",
            "eye_color": "Brown",
            "hair_type": "Wavy",
            "hair_color": "Brown",
            "ethnicity": "Black",
        }

        # Remove the missing field
        child_attributes.pop(missing_field)

        response = client.patch(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json=child_attributes,
        )

        assert response.status_code == 400
        assert missing_field in response.json["errors"]
        assert "Input payload validation failed" in response.json["message"]

    @pytest.mark.parametrize(
        "empty_field",
        [
            "name",
            "age_range",
            "sex",
            "eye_color",
            "hair_type",
            "hair_color",
            "ethnicity",
        ],
    )
    def test_empty_inputs(
        self,
        client: FlaskClient,
        empty_field: str,
        child_to_update: Child,
        access_token: str,
    ) -> None:
        """
        Test the PATCH method of the children endpoint with empty inputs.
        """
        child_attributes = {
            "child_id": child_to_update.child_id,
            "name": "Updated",
            "age_range": "4-6",
            "sex": "Male",
            "eye_color": "Brown",
            "hair_type": "Wavy",
            "hair_color": "Brown",
            "ethnicity": "Black",
        }

        # Set the empty field to an empty string
        child_attributes[empty_field] = ""

        response = client.patch(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json=child_attributes,
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

    @staticmethod
    def test_invalid_id_format(client: FlaskClient, access_token: str) -> None:
        """
        Test the PATCH method of the children endpoint with an invalid child_id format.
        """
        response = client.patch(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "child_id": "invalid_id",
                "name": "InvalidToken",
                "age_range": "4-6",
                "sex": "Male",
                "eye_color": "Brown",
                "hair_type": "Wavy",
                "hair_color": "Brown",
                "ethnicity": "Black",
            },
        )

        assert response.status_code == 400
        assert (
            "child_id must be a valid UUID hex string"
            in response.json["Error"]
        )

    @staticmethod
    def test_empty_id(client: FlaskClient, access_token: str) -> None:
        """
        Test the PATCH method of the children endpoint with an empty child_id.
        """
        response = client.patch(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "child_id": "",
                "name": "InvalidToken",
                "age_range": "4-6",
                "sex": "Male",
                "eye_color": "Brown",
                "hair_type": "Wavy",
                "hair_color": "Brown",
                "ethnicity": "Black",
            },
        )

        assert response.status_code == 400
        assert "child_id must be a non-empty string" in response.json["Error"]

    @staticmethod
    def test_none_id(client: FlaskClient, access_token: str) -> None:
        """
        Test the PATCH method of the children endpoint with a None child_id.
        """
        response = client.patch(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "child_id": None,
                "name": "InvalidToken",
                "age_range": "4-6",
                "sex": "Male",
                "eye_color": "Brown",
                "hair_type": "Wavy",
                "hair_color": "Brown",
                "ethnicity": "Black",
            },
        )

        assert response.status_code == 400
        assert "child_id" in response.json["errors"]
        assert (
            "None is not of type 'string'"
            in response.json["errors"]["child_id"]
        )

    @staticmethod
    def test_child_not_found(client: FlaskClient, access_token: str) -> None:
        """
        Test the PATCH method of the children endpoint with a child that does not exist.
        """
        child_id = uuid4().hex

        response = client.patch(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json={
                "child_id": child_id,
                "name": "InvalidToken",
                "age_range": "4-6",
                "sex": "Male",
                "eye_color": "Brown",
                "hair_type": "Wavy",
                "hair_color": "Brown",
                "ethnicity": "Black",
            },
        )

        assert response.status_code == 404
        assert (
            f"Child with ID '{child_id}' not found" in response.json["Error"]
        )

    @pytest.mark.parametrize(
        "invalid_type",
        [
            "name",
            "age_range",
            "sex",
            "eye_color",
            "hair_type",
            "hair_color",
            "ethnicity",
        ],
    )
    def test_invalid_types(
        self,
        client: FlaskClient,
        invalid_type: str,
        child_to_update: Child,
        access_token: str,
    ) -> None:
        """
        Test the PATCH method of the children endpoint with invalid types.
        """
        child_attributes = {
            "child_id": child_to_update.child_id,
            "name": "InvalidType",
            "age_range": "4-6",
            "sex": "Male",
            "eye_color": "Brown",
            "hair_type": "Wavy",
            "hair_color": "Brown",
            "ethnicity": "Black",
            "fav_animals": "Dogs",
            "fav_activities": "Playing",
            "fav_shows": "Paw Patrol",
        }

        # Set the invalid type
        child_attributes[invalid_type] = 123

        response = client.patch(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json=child_attributes,
        )

        assert response.status_code == 400
        assert invalid_type in response.json["errors"]
        assert "Input payload validation failed" in response.json["message"]
        assert (
            "is not one of" in response.json["errors"][invalid_type]
            or "is not of type 'string'"
            in response.json["errors"][invalid_type]
        )

    @pytest.mark.parametrize(
        "invalid_field",
        ["age_range", "sex", "eye_color", "hair_type", "hair_color"],
    )
    def test_invalid_fields(
        self,
        client: FlaskClient,
        child: Child,
        access_token: str,
        invalid_field: str,
    ) -> None:
        """
        Test the PATCH method of the children endpoint with invalid fields.
        """
        # Prepare the JSON payload dynamically based on the test parameters
        json_payload = {
            "child_id": child.child_id,
            "name": "name",
            "age_range": (
                "0-3" if invalid_field != "age_range" else "invalid_value"
            ),
            "sex": "Male" if invalid_field != "sex" else "invalid_value",
            "eye_color": (
                "Blue" if invalid_field != "eye_color" else "invalid_value"
            ),
            "hair_type": (
                "Straight" if invalid_field != "hair_type" else "invalid_value"
            ),
            "hair_color": (
                "Blonde" if invalid_field != "hair_color" else "invalid_value"
            ),
            "ethnicity": "Asian",
            "fav_animals": "Dogs",
            "fav_activities": "Playing",
            "fav_shows": "Paw Patrol",
        }

        # Make the PATCH request with the prepared payload
        response = client.patch(
            "/api/children",
            headers={"Authorization": f"Bearer {access_token}"},
            json=json_payload,
        )

        assert response.status_code == 400
        assert "Input payload validation failed" in response.json["message"]
        assert invalid_field in response.json["errors"]


class TestAllChildrenGet:
    """
    Test the GET method of the all_children endpoint.
    """

    @staticmethod
    def test_success(
        client: FlaskClient, child: Child, access_token: str
    ) -> None:
        """
        Test if the GET method of the all_children endpoint returns all children.
        """
        response = client.get(
            "/api/children/all",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        assert response.status_code == 200
        assert "children" in response.json

        # Check if the fixture child is in the response
        found_child_fixture = False

        for retrieved_child in response.json["children"]:
            assert "child_id" in retrieved_child
            assert "name" in retrieved_child
            assert "age_range" in retrieved_child
            assert "sex" in retrieved_child
            assert "eye_color" in retrieved_child
            assert "hair_type" in retrieved_child
            assert "hair_color" in retrieved_child
            assert "ethnicity" in retrieved_child
            assert "fav_animals" in retrieved_child
            assert "fav_activities" in retrieved_child
            assert "fav_shows" in retrieved_child

            if retrieved_child["child_id"] == child.child_id:
                found_child_fixture = True
                assert retrieved_child["name"] == child.name
                assert retrieved_child["age_range"] == child.age_range
                assert retrieved_child["sex"] == child.sex
                assert retrieved_child["eye_color"] == child.eye_color
                assert retrieved_child["hair_type"] == child.hair_type
                assert retrieved_child["hair_color"] == child.hair_color
                assert retrieved_child["ethnicity"] == child.ethnicity
                assert retrieved_child["fav_animals"] == child.fav_animals
                assert (
                    retrieved_child["fav_activities"] == child.fav_activities
                )
                assert retrieved_child["fav_shows"] == child.fav_shows

        assert found_child_fixture

    @staticmethod
    def test_unauthorized(client: FlaskClient) -> None:
        """
        Test the GET method of the all_children endpoint without a token.
        """
        response = client.get("/api/children/all")

        assert response.status_code == 401
        assert "Missing Authorization Header" in response.json["msg"]

    @staticmethod
    def test_invalid_token(client: FlaskClient) -> None:
        """
        Test the GET method of the all_children endpoint with an invalid token.
        """
        response = client.get(
            "/api/children/all",
            headers={"Authorization": "Bearer invalid_token"},
        )

        assert response.status_code == 422
        assert "Not enough segments" in response.json["msg"]
