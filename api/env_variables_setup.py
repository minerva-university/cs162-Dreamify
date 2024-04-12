"""
This script creates the .env file with the necessary environment variables.
"""

import os
import sys
from uuid import uuid4


def main():

    # Get the app_mode from the command line argument
    app_mode = "development"

    # Check if the app_mode is provided as a command line argument
    if len(sys.argv) > 1:
        app_mode = sys.argv[1].lower()

        if app_mode not in ["development", "production", "testing"]:
            print(
                "ERROR: Invalid app mode. Please enter 'development', 'production' or 'testing'."
            )
            print("Usage: python env_variables_setup.py [app_mode]")
            sys.exit(1)

    file_content = f"""\
# 1. Set this to True to enable the OpenAI API generation
# (Otherwise, dummy data will be used)
OPENAI_GENERATE=False

# 2. Set your OpenAI API key here (starts with sk-...)
OPENAI_API_KEY=SET_YOUR_API_KEY_HERE

# 3. Change the Database settings below

# 4. Change other settings as needed

# --- Database settings (only get used in production mode) ---

DATABASE_NAME=dreamify_db
DATABASE_USER=dreamify
DATABASE_PASSWORD=dreamify

# --- Frontend settings ---

# Set the app mode ("development", "production" or "testing")
REACT_APP_MODE={app_mode}

# --- Backend settings ---

# Default database URI
DEFAULT_DATABASE_URI=sqlite:///db.sqlite

# Test database URI
TEST_DATABASE_URI=sqlite:///:memory:

# Secret key for Flask (generated randomly with uuid4().hex)
FLASK_SECRET_KEY={uuid4().hex}

# Secret key for Flask JWT (generated randomly with uuid4().hex)
FLASK_JWT_SECRET_KEY={uuid4().hex}

# Number of days before a JWT token expires
JWT_DAYS_EXPIRATION=3
"""
    try:
        # Get the file path to the project root directory
        file_path = os.path.join(os.path.dirname(__file__), "..", ".env")

        # Check if the .env file already exists
        if os.path.exists(file_path):
            print(
                ".env file already exists. Exiting.\nIf you want to regenerate it, "
                "delete the existing .env file and run this script again."
            )
        else:
            # Write the file content to the .env file
            with open(file_path, "w") as FILE:
                FILE.write(file_content)

            print(
                "Successfully created the .env file.\n"
                "Please set the variable 'OPENAI_GENERATE' to 'True', "
                "enter your OpenAI API key in the 'OPENAI_API_KEY' variable "
                "(otherwise, dummy data will be used) and set the database settings "
                "(if production mode is set)."
            )
    except Exception as e:
        print(f"An error occurred: {e}")

        # Delete the file if it was created
        if os.path.exists(file_path):
            os.remove(file_path)

        print("Please try again.")


if __name__ == "__main__":
    main()
