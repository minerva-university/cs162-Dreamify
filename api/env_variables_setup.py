"""
This script creates the .env file with the necessary environment variables.
"""

import os
from uuid import uuid4


def main():
    file_content = f"""\
# Set this to True to enable the OpenAI API generation
# (Otherwise, dummy data will be used)
OPENAI_GENERATE=False

# Set your OpenAI API key here (starts with sk-...)
OPENAI_API_KEY=SET_YOUR_API_KEY_HERE

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
                "Please set the variable 'OPENAI_GENERATE' to 'True' "
                "and enter your OpenAI API key in the 'OPENAI_API_KEY' variable.\n"
                "(Otherwise, dummy data will be used.)"
            )
    except Exception as e:
        print(f"An error occurred: {e}")
        print("Please delete the .env file (if it was created) and try again.")


if __name__ == "__main__":
    main()
