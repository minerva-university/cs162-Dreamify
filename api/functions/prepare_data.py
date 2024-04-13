"""
This module contains functions for preparing data for the API response.
"""

import os
import requests
import asyncio
import aiofiles
from aiohttp import ClientSession
from flask import current_app
from base64 import b64encode
from sqlalchemy.exc import SQLAlchemyError

from .openai_functions import text_gen, image_gen, image_gen_async
from .prompt_assembly import (
    create_story_prompt,
    create_chapter_image_prompt,
    create_child_image_prompt,
    extract_story_components,
)
from ..database.models import Child
from ..database.inserts import insert_story, insert_child
from ..database.utilities import get_entry_attributes
from ..dummy_data.dummy_story import dummy_story

# Set the path to the dummy data directory based on the current environment
if os.path.exists(os.path.join(".", "dummy_data")):
    DUMMY_PATH = os.path.join(".", "dummy_data")
else:
    DUMMY_PATH = os.path.join(".", "api", "dummy_data")


def get_generate_flag() -> bool:
    """
    Get the generate flag based on the environment variable.

    Raises:
        ValueError: If the OPENAI_API_KEY environment variable is not set
        but the OPENAI_GENERATE environment variable is set to "True".

    Returns:
        bool: The generate flag.
    """
    try:
        # Get the generate flag from the environment variable
        generate_flag = (
            True
            if os.getenv("OPENAI_GENERATE") == "True"
            # Check if the app is not in testing mode
            and current_app.config["TESTING"] is not True
            else False
        )

        if generate_flag and not os.getenv("OPENAI_API_KEY"):
            raise ValueError(
                "OPENAI_GENERATE is set to 'True' but OPENAI_API_KEY environment variable is not set"
            )

        # Create a directory to store generated outputs
        os.makedirs("gen_outputs", exist_ok=True)

        return generate_flag
    except Exception as e:
        current_app.logger.error(f"Failed to get generate flag: {e}")
        raise e


def get_child_parameters(child_id: str) -> dict[str, str]:
    """
    Get the parameters for a child based on the given child ID.

    Args:
        child_id (str): The ID of the child.

    Raises:
        ValueError: If the child with the given ID does not exist.

    Returns:
        dict[str, str]: The parameters for the child.
    """
    try:
        # Get the child with the given ID
        child = Child.query.filter_by(child_id=child_id).first()

        # Check if the child exists
        if child is None:
            raise ValueError(f"Child with ID '{child_id}' does not exist")

        # Get the filtered parameters for the child
        child_parameters = get_entry_attributes(
            child,
            exclude=["child_id", "parent_id"],
        )

        return child_parameters
    except SQLAlchemyError as e:
        current_app.logger.error(f"Failed to get child parameters: {e}")
        raise e


def generate_story(
    child_params: dict[str, str], topic: str, story_genre: str
) -> tuple[str, list[str], list[str]]:
    """
    Generate chapters for a story based on the given child parameters and story topic.

    Args:
        child_params (dict[str, str]): The parameters for the child.
        topic (str): The topic of the story.
        story_genre (str): The genre of the story.

    Returns:
        tuple[str, list[str], list[str]]: The generated story title, chapter_contents and chapter titles.
    """
    try:
        # Get the generate flag from the environment variable
        generate_flag = get_generate_flag()

        # Create a prompt for generating the story
        prompt = create_story_prompt(child_params, topic, story_genre)

        # Check if the story should be generated
        if generate_flag:
            # Generate the story based on the prompt
            story = text_gen(prompt)
            current_app.logger.info("Generated story.")
        else:
            # Use a dummy story instead of generating one
            story = dummy_story

        # TODO: remove this once the story generation is working robustly
        with open("gen_outputs/story.txt", "w") as f:
            f.write("Story prompt:\n")
            f.write(prompt)
            f.write("\n\nGenerated story:\n")
            f.write(story)

        # Extract the story title, chapter titles and chapter contents
        return extract_story_components(story)
    except Exception as e:
        current_app.logger.error(f"Failed to generate story: {e}")
        raise e


async def _generate_chapter_image_async(
    generate: bool,
    child_params: dict[str, str],
    image_style: str,
    chapter: str,
    chapter_number: int,
) -> str:
    """
    Generate an image for a chapter of the story asynchronously.

    Args:
        generate (bool): Flag indicating whether to generate the image or use a dummy image.
        child_params (dict[str, str]): The parameters for the child.
        image_style (str): The style of the image.
        chapter (str): The content of the chapter.
        chapter_number (int): The number of the chapter.

    Returns:
        str: The generated image in base64 format.
    """
    try:
        # Create a prompt for generating the image
        prompt = create_chapter_image_prompt(
            child_params=child_params,
            image_style=image_style,
            chapter_content=chapter,
            chapter_number=chapter_number,
        )

        # Check if the image should be generated
        if generate:
            # Generate the image based on the prompt
            image_url = await image_gen_async(prompt)

            # Log the generated image URL
            current_app.logger.info(
                f"Generated chapter {chapter_number} image: {image_url}"
            )

            # Get the image bytes from the URL asynchronously
            async with ClientSession() as session:
                async with session.get(image_url) as response:
                    image = await response.read()
        else:
            # Set a dummy image URL
            image_url = "dummy_image_url"

            # Use a dummy image instead of generating one
            path = os.path.join(DUMMY_PATH, f"image_{chapter_number}.webp")

            # Read the dummy image asynchronously
            async with aiofiles.open(path, "rb") as file:
                image = await file.read()

        # TODO: remove this once the image generation is working robustly
        # Write the prompt and image URL to a file asynchronously
        async with aiofiles.open("gen_outputs/prompts_urls.txt", "a") as f:
            await f.write(
                f"Chapter {chapter_number} prompt:\n{prompt}\n\n"
                f"Chapter {chapter_number} image URL:\n{image_url}\n\n"
            )

        # Convert the image to a base64 string and return it
        return b64encode(image).decode("utf-8")
    except Exception as e:
        current_app.logger.error(f"Failed to generate chapter image: {e}")
        raise e


async def generate_chapter_images_async(
    chapters: list[str],
    child_params: dict[str, str],
    image_style: str,
) -> list[str]:
    """
    Asynchronously generate images for each chapter of the story concurrently.

    Args:
        chapters (list[str]): The generated story chapters.
        child_params (dict[str, str]): The parameters for the child.
        image_style (str): The style of the images.

    Returns:
        list[str]: The generated images in base64 format.
    """
    try:
        # Get the generate flag from the environment variable
        generate_flag = get_generate_flag()

        # Create a list of tasks to generate images for each chapter
        tasks = [
            _generate_chapter_image_async(
                generate_flag, child_params, image_style, chapter, i + 1
            )
            for i, chapter in enumerate(chapters)
        ]

        # Execute the tasks concurrently
        images = await asyncio.gather(*tasks)

        return images
    except Exception as e:
        current_app.logger.error(f"Failed to generate chapter images: {e}")
        raise e


def generate_child_image(child_params: dict[str, str]) -> str:
    """
    Generate an image for the child based on the given parameters.

    Args:
        child_params (dict[str, str]): The parameters for the child.

    Returns:
        str: The generated image in base64 format.
    """
    try:
        # Get the generate flag from the environment variable
        generate_flag = get_generate_flag()

        # Create a prompt for generating the image
        prompt = create_child_image_prompt(child_params=child_params)

        if generate_flag:
            # Generate the image based on the prompt
            image_url = image_gen(prompt)

            # Get the image bytes from the URL
            image = requests.get(image_url).content

            # Log the generated image URL
            current_app.logger.info(f"Generated child image:\n{image_url}\n")
        else:
            # Set a dummy image URL
            image_url = "temp_image_url"

            # Use a dummy image instead of generating one
            path = os.path.join(DUMMY_PATH, "child_image.jpg")
            with open(path, "rb") as file:
                image = file.read()

        # Write the prompt and image URL to a file
        with open("gen_outputs/child_image_gen.txt", "w") as f:
            f.write("Image prompt:\n")
            f.write(prompt)
            f.write("\n\nImage URL:\n")
            f.write(image_url)

        # Convert the image to a base64 string and return it
        return b64encode(image).decode("utf-8")
    except Exception as e:
        current_app.logger.error(f"Failed to generate child image: {e}")
        raise e


async def assemble_story_payload_async(
    child_id: str, topic: str, image_style: str, story_genre: str
) -> dict[str, str | list[str]]:
    """
    Asynchronously assemble the payload for the given child ID, story topic, and image style.

    Args:
        child_id (str): The ID of the child.
        topic (str): The topic of the story.
        image_style (str): The style of the images.
        story_genre (str): The genre of the story.

    Raises:
        ValueError: If the child with the given ID does not exist.

    Returns:
        dict[str, list[str]]: The assembled payload containing chapters and images.
    """
    try:
        # Get the child parameters
        child_params = get_child_parameters(child_id)

        # Generate the story
        story_title, chapter_titles, chapter_contents = generate_story(
            child_params, topic, story_genre
        )

        # TODO: remove this once the story generation is working robustly
        async with aiofiles.open("gen_outputs/story_extraction.txt", "w") as f:
            await f.write(f"Story title: {story_title}\n\n")
            for title, content in zip(chapter_titles, chapter_contents):
                await f.write(f"Chapter title: {title}\n")
                await f.write(f"Chapter content: {content}\n\n")

        # Generate the images for the story chapters asynchronously
        images = await generate_chapter_images_async(
            chapter_contents, child_params, image_style
        )

        # Add the story to the database
        inserted_story = insert_story(
            child_id,
            story_title,
            topic,
            image_style,
            story_genre,
            chapter_titles,
            chapter_contents,
            images,
        )

        # Get the story attributes and return them
        story_attributes = get_entry_attributes(inserted_story)

        # Assemble the payload for the story
        payload = {
            "story_id": story_attributes["story_id"],
            "title": story_title,
            "chapter_titles": chapter_titles,
            "chapter_contents": chapter_contents,
            "chapter_images": images,
            "created_at": story_attributes["created_at"],
        }

        return payload
    except Exception as e:
        current_app.logger.error(f"Failed to assemble story payload: {e}")
        raise e


def assemble_child_payload(
    parent_id: str,
    name: str,
    age_range: str,
    sex: str,
    eye_color: str,
    hair_type: str,
    hair_color: str,
    ethnicity: str,
    fav_animals: str | None = None,
    fav_activities: str | None = None,
    fav_shows: str | None = None,
) -> dict[str, str]:
    """
    Assemble the payload for the given child parameters.

    Args:
        parent_id (str): The ID of the parent.
        name (str): The name of the child.
        age_range (str): The age range of the child.
        sex (str): The sex of the child.
        eye_color (str): The eye color of the child.
        hair_type (str): The hair type of the child.
        hair_color (str): The hair color of the child.
        ethnicity (str): The ethnicity of the child.
        fav_animals (str | None, optional): The favorite animals of the child. Defaults to None.
        fav_activities (str | None, optional): The favorite activities of the child. Defaults to None.
        fav_shows (str | None, optional): The favorite shows of the child. Defaults to None.

    Returns:
        dict[str, str]: The assembled payload containing child attributes.
    """
    try:
        # Create a dictionary of the child parameters
        child_params = {
            "name": name,
            "age_range": age_range,
            "sex": sex,
            "eye_color": eye_color,
            "hair_type": hair_type,
            "hair_color": hair_color,
            "ethnicity": ethnicity,
            "fav_animals": fav_animals,
            "fav_activities": fav_activities,
            "fav_shows": fav_shows,
        }

        # Generate the image for the child
        image = generate_child_image(child_params=child_params)

        # Add the story to the database
        inserted_child = insert_child(
            parent_id,
            name,
            image,
            age_range,
            sex,
            eye_color,
            hair_type,
            hair_color,
            ethnicity,
            fav_animals,
            fav_activities,
            fav_shows,
        )

        # Get the child attributes and return them
        return get_entry_attributes(inserted_child)
    except Exception as e:
        current_app.logger.error(f"Failed to assemble child payload: {e}")
        raise e
