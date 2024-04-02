"""
This module contains tests for the auth namespace.
"""

import pytest
from flask.testing import FlaskClient
from typing import Any

from api.database.inserts import insert_parent
from api.database.models import Parent


class TestRegisterPost:
    """
    Test the POST method of the register endpoint.
    """

    @staticmethod
    def test_success(client: Any) -> None:
        """
        Test the POST method of the register endpoint.
        """
        response = client.post(
            "/api/auth/register",
            json={
                "email": "success.register@gmail.com",
                "password": "password",
                "first_name": "Success",
                "last_name": "Register",
            },
        )
        assert response.status_code == 200
        assert "user_id" in response.json

    @pytest.mark.parametrize(
        "missing_field, payload",
        [
            (
                "email",
                {
                    "password": "password",
                    "first_name": "Missing",
                    "last_name": "Email",
                },
            ),
            (
                "password",
                {
                    "email": "missing.password@gmail.com",
                    "first_name": "Missing",
                    "last_name": "Password",
                },
            ),
            (
                "first_name",
                {
                    "email": "missing.firstname@gmail.com",
                    "password": "password",
                    "last_name": "Missing",
                },
            ),
            (
                "last_name",
                {
                    "email": "missing.lastname@gmail.com",
                    "password": "password",
                    "first_name": "Missing",
                },
            ),
        ],
    )
    def test_missing_fields(
        self, client: FlaskClient, missing_field: str, payload: dict[str, str]
    ) -> None:
        """
        Test the POST method of the register endpoint with various missing fields.
        """
        response = client.post("/api/auth/register", json=payload)

        assert response.status_code == 400
        assert missing_field in response.json["errors"]
        assert "Input payload validation failed" in response.json["message"]

    @staticmethod
    def test_invalid_email(client: FlaskClient) -> None:
        """
        Test the POST method of the register endpoint with an invalid email.
        """
        response = client.post(
            "/api/auth/register",
            json={
                "email": "invalid.email",
                "password": "password",
                "first_name": "Invalid",
                "last_name": "Email",
            },
        )

        assert response.status_code == 400
        assert "Invalid email" in response.json["error"]

    @staticmethod
    def test_duplicate_email(client: FlaskClient) -> None:
        """
        Test the POST method of the register endpoint with a duplicate email.
        """
        email = "duplicate.email@gmail.com"

        # Insert a user with the email
        insert_parent(
            email=email,
            password="password1",
            first_name="Duplicate1",
            last_name="Email1",
        )

        response = client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": "password2",
                "first_name": "Duplicate2",
                "last_name": "Email2",
            },
        )

        assert (
            "User with email 'duplicate.email@gmail.com' already exists"
            in response.json["error"]
        )

    @pytest.mark.parametrize(
        "email, password, first_name, last_name",
        [
            ("", "password", "Empty", "Email"),
            ("empty.password@gmail.com", "", "Empty", "Password"),
            ("empty.firstname@gmail.com", "password", "", "Empty"),
            ("empty.lastname@gmail.com", "password", "Empty", ""),
        ],
    )
    def test_empty_inputs(
        self,
        client: FlaskClient,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
    ) -> None:
        """
        Test the POST method of the register endpoint with empty inputs.
        """
        response = client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
            },
        )

        assert response.status_code == 400
        assert "must be a non-empty string" in response.json["error"]

    @pytest.mark.parametrize(
        "email, password, first_name, last_name",
        [
            (None, "password", "None", "Email"),
            ("password.none@gmail.com", None, "None", "Password"),
            ("firstname.none@gmail.com", "password", None, "None"),
            ("lastname.none@gmail.com", "password", "None", None),
            (None, None, None, None),
        ],
    )
    def test_none_values(
        self,
        client: FlaskClient,
        email: str,
        password: str,
        first_name: str,
        last_name: str,
    ) -> None:
        """
        Test the POST method of the register endpoint with None values.
        """
        response = client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
            },
        )

        # Get the first error key
        first_error_key = list(response.json["errors"].keys())[0]

        assert response.status_code == 400
        assert first_error_key in response.json["errors"]
        assert (
            "None is not of type 'string'"
            in response.json["errors"][first_error_key]
        )
        assert "Input payload validation failed" in response.json["message"]

    @pytest.mark.parametrize(
        "email, password, first_name, last_name",
        [
            (123, "password", "Invalid", "Email"),
            ("invalid.types@gmail.com", 123, "Invalid", "Password"),
            ("invalid.types@gmail.com", "password", 123, "Invalid"),
            ("invalid.types@gmail.com", "password", "Invalid", 123),
        ],
    )
    def test_invalid_types(
        self,
        client: FlaskClient,
        email: Any,
        password: Any,
        first_name: Any,
        last_name: Any,
    ) -> None:
        """
        Test the POST method of the register endpoint with invalid types.
        """
        response = client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
            },
        )

        # Get the first error key
        first_error_key = list(response.json["errors"].keys())[0]

        assert response.status_code == 400
        assert first_error_key in response.json["errors"]
        assert (
            "is not of type 'string'"
            in response.json["errors"][first_error_key]
        )
        assert "Input payload validation failed" in response.json["message"]


class TestLoginPost:
    """
    Test the POST method of the login endpoint.
    """

    @staticmethod
    def test_success(client: FlaskClient, parent: Parent) -> None:
        """
        Test the POST method of the login endpoint.
        """
        response = client.post(
            "/api/auth/login",
            json={"email": parent.email, "password": "password"},
        )

        assert response.status_code == 200
        assert "access_token" in response.json

    @staticmethod
    def test_unregistered_email(client: FlaskClient) -> None:
        """
        Test the POST method of the login endpoint with an unregistered email.
        """
        email = "unregistered.email@gmail.com"
        response = client.post(
            "/api/auth/login",
            json={
                "email": email,
                "password": "password",
            },
        )

        assert response.status_code == 401
        assert (
            f"Parent with email '{email}' not found" in response.json["error"]
        )

    @staticmethod
    def test_incorrect_password(client: FlaskClient, parent: Parent) -> None:
        """
        Test the POST method of the login endpoint with an incorrect password.
        """
        response = client.post(
            "/api/auth/login",
            json={
                "email": parent.email,
                "password": "incorrect_password",
            },
        )

        assert response.status_code == 401
        assert "Incorrect password" in response.json["error"]

    @pytest.mark.parametrize(
        "missing_field, payload",
        [
            ("email", {"password": "password"}),
            ("password", {"email": "missing.password@gmail.com"}),
        ],
    )
    def test_missing_fields(
        self, client: FlaskClient, missing_field: str, payload: dict[str, str]
    ) -> None:
        """
        Test the POST method of the login endpoint with various missing fields.
        """
        response = client.post("/api/auth/login", json=payload)

        assert response.status_code == 400
        assert missing_field in response.json["errors"]
        assert "Input payload validation failed" in response.json["message"]

    @staticmethod
    def test_invalid_email(client: FlaskClient) -> None:
        """
        Test the POST method of the login endpoint with an invalid email.
        """
        response = client.post(
            "/api/auth/login",
            json={"email": "invalid.email", "password": "password"},
        )

        assert response.status_code == 400
        assert "Invalid email" in response.json["error"]

    @pytest.mark.parametrize(
        "email, password",
        [
            ("", "emptyemail"),
            ("empty.email@gmail.com", ""),
        ],
    )
    def test_login_empty_inputs(
        self,
        client: FlaskClient,
        email: str,
        password: str,
    ) -> None:
        """
        Test the POST method of the login endpoint with empty inputs.
        """
        response = client.post(
            "/api/auth/login",
            json={
                "email": email,
                "password": password,
            },
        )

        assert response.status_code == 400
        assert "must be a non-empty string" in response.json["error"]

    @pytest.mark.parametrize(
        "email, password",
        [
            (None, "password"),
            ("none.email@gmail.com", None),
            (None, None),
        ],
    )
    def test_login_none_values(
        self,
        client: FlaskClient,
        email: str,
        password: str,
    ) -> None:
        """
        Test the POST method of the login endpoint with None values.
        """
        response = client.post(
            "/api/auth/login",
            json={
                "email": email,
                "password": password,
            },
        )

        # Get the first error key
        first_error_key = list(response.json["errors"].keys())[0]

        assert response.status_code == 400
        assert first_error_key in response.json["errors"]
        assert (
            "None is not of type 'string'"
            in response.json["errors"][first_error_key]
        )
        assert "Input payload validation failed" in response.json["message"]

    @pytest.mark.parametrize(
        "email, password",
        [
            (123, "password"),
            ("invalid.email@gmail.com", 123),
        ],
    )
    def test_login_invalid_types(
        self,
        client: FlaskClient,
        email: Any,
        password: Any,
    ) -> None:
        """
        Test the POST method of the login endpoint with invalid types.
        """
        response = client.post(
            "/api/auth/login",
            json={
                "email": email,
                "password": password,
            },
        )

        # Get the first error key
        first_error_key = list(response.json["errors"].keys())[0]

        assert response.status_code == 400
        assert first_error_key in response.json["errors"]
        assert (
            "is not of type 'string'"
            in response.json["errors"][first_error_key]
        )
        assert "Input payload validation failed" in response.json["message"]


class TestGetCurrentParent:
    """
    Test the GET method of the current_parent endpoint.
    """

    @staticmethod
    def test_success(client: FlaskClient, access_token: str) -> None:
        """
        Test successful retrieval of current parent's information.
        """

        response = client.get(
            "/api/auth/current_parent",
            headers={"Authorization": f"Bearer {access_token}"},
        )

        assert response.status_code == 200
        assert "user_id" in response.json
        assert "email" in response.json
        assert "first_name" in response.json
        assert "last_name" in response.json

    @staticmethod
    def test_unauthorized(client: FlaskClient) -> None:
        """
        Test the GET method of the current_parent endpoint with a missing token.
        """
        response = client.get("/api/auth/current_parent")

        assert response.status_code == 401
        assert "Missing Authorization Header" in response.json["msg"]

    @staticmethod
    def test_invalid_token(client: FlaskClient) -> None:
        """
        Test the GET method of the current_parent endpoint with an invalid token.
        """
        response = client.get(
            "/api/auth/current_parent",
            headers={"Authorization": "Bearer invalid_token"},
        )

        assert response.status_code == 422
        assert "Not enough segments" in response.json["msg"]
