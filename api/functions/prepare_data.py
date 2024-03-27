"""
This module contains functions for preparing data for the API response.
"""

from flask import current_app
from base64 import b64encode
import os
from sqlalchemy.exc import SQLAlchemyError


from .openai_functions import text_gen, image_gen
from .prompt_assembly import (
    create_story_prompt,
    create_chapter_image_prompt,
    create_child_image_prompt,
    extract_story_components,
)
from ..database.models import Child
from ..database.inserts import insert_story, insert_child
from ..database.utilities import get_entry_attributes

# TODO: remove this dummy story once the database is set up
dummy_story = """\
Title of the story: Pablo's Magical Journey to Hogwarts

Chapter 1 title: The Mysterious Invitation

Chapter 1 description:
In a cozy little town nestled between rolling hills and whispering forests, lived a young boy named Pablo. Pablo was an adventurous soul with a heart full of curiosity. He loved exploring the woods near his home, chasing butterflies, and dreaming of faraway places. One sunny afternoon, as Pablo was playing in his backyard, a fluttering owl caught his attention. The owl carried a letter with a strange seal. Pablo, intrigued, approached cautiously. The letter was addressed to him! With trembling hands, he opened it and read the words that would change his life forever: an invitation to Hogwarts School of Witchcraft and Wizardry. Pablo's heart raced with excitement as he realized he was about to embark on a magical adventure.

Chapter 2 title: The Journey Begins

Chapter 2 description:
Filled with anticipation, Pablo packed his bags with his favorite snacks and toys. As the sun dipped below the horizon, he set out on his journey to Hogwarts. Through dark forests and shimmering streams, Pablo followed the enchanted path laid out by the owl. Along the way, he encountered friendly creatures like talking rabbits and mischievous fairies who guided him on his way. The night air was alive with whispers of magic, and Pablo couldn't help but feel a thrill of excitement coursing through his veins.

Chapter 3 title: Arrival at Hogwarts

Chapter 3 description:
After what felt like both an eternity and the blink of an eye, Pablo finally arrived at the towering gates of Hogwarts. The castle stood majestic against the starry sky, its turrets reaching for the heavens. With a mixture of awe and nervousness, Pablo stepped through the gates and into the Great Hall. The room was filled with the warm glow of candlelight and the chatter of students. Pablo's eyes widened as he took in the sight of floating candles and the Sorting Hat perched upon a stool. He knew that his adventure was only just beginning.

Chapter 4 title: Making Friends

Chapter 4 description:
As Pablo settled into life at Hogwarts, he made friends with students from all walks of life. There was Lily, the kind-hearted witch who could talk to animals, and Max, the mischievous wizard with a knack for pranks. Together, they explored the secret passages of the castle, attended magical classes, and cheered on their house during Quidditch matches. Every day brought new wonders and surprises, and Pablo felt like he belonged in this magical world more than anywhere else.

Chapter 5 title: The Grand Adventure

Chapter 5 description:
One fateful day, a dark shadow loomed over Hogwarts as news spread of an ancient evil stirring in the depths of the Forbidden Forest. Determined to help protect his newfound home, Pablo joined forces with his friends to uncover the truth. Through bravery, friendship, and a sprinkle of magic, they faced challenges and overcame obstacles they never thought possible. In the end, it was Pablo's unwavering courage and belief in the power of good that saved the day. As the sun rose over Hogwarts once more, Pablo knew that his journey was far from over, but he also knew that he would face whatever adventures came his way with a smile on his face and magic in his heart.

The end.\
"""


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
        child = Child.query.get(child_id)

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

    # Create a prompt for generating the story
    prompt = create_story_prompt(child_params, topic, story_genre)

    # Generate the story based on the prompt
    # story = text_gen(prompt)
    story = dummy_story  # TODO: use the real story instead of the dummy story

    # Extract the story title, chapter titles and chapter contents
    return extract_story_components(story)


def generate_chapter_images(
    chapters: list[str],
    child_params: dict[str, str],
    image_style: str,
) -> list[str]:
    """
    Generate images for each chapter of the story.

    Args:
        chapters (list[str]): The generated story chapters.
        child_params (dict[str, str]): The parameters for the child.
        image_style (str): The style of the images.

    Returns:
        list[str]: The generated images in base64 format.
    """

    images = []

    # Generate an image for each chapter
    for i, chapter in enumerate(chapters, start=1):
        # Create a prompt for generating the images
        prompt = create_chapter_image_prompt(
            child_params=child_params,
            image_style=image_style,
            chapter_content=chapter,
            chapter_number=i,
        )

        # Generate the image based on the prompt
        # image = image_gen(prompt)

        # TODO: use the real images instead of the dummy images
        # Open the image and convert it to a base64 string
        path = os.path.join(os.getcwd(), "temp", f"image_{i}.webp")
        with open(path, "rb") as file:
            image_bytes = file.read()

            # Convert the image to a base64 string to send it in the response
            base64_str = b64encode(image_bytes).decode("utf-8")

        # Add the generated image to the list
        images.append(base64_str)

    # Return the list of images
    return images


def generate_child_image(child_params: dict[str, str]) -> str:
    """
    Generate an image for the child based on the given parameters.

    Args:
        child_params (dict[str, str]): The parameters for the child.

    Returns:
        str: The generated image in base64 format.
    """
    # Create a prompt for generating the image
    prompt = create_child_image_prompt(child_params=child_params)

    # Generate the image based on the prompt
    # image = image_gen(prompt)

    # TODO: use the real image instead of the dummy image
    # Open the image and convert it to a base64 string
    path = os.path.join(os.getcwd(), "temp", "child_image.jpg")
    with open(path, "rb") as file:
        image_bytes = file.read()

        # Convert the image to a base64 string to send it in the response
        base64_str = b64encode(image_bytes).decode("utf-8")

    # Return the image in base64 string format
    return base64_str


def assemble_story_payload(
    child_id: str, topic: str, image_style: str, story_genre: str
) -> dict[str, str | list[str]]:
    """
    Assemble the payload for the given child ID, story topic, and image style.

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
    # Get the parameters for the kid
    child_params = get_child_parameters(child_id)

    # Generate the story
    story_title, chapter_titles, chapter_contents = generate_story(
        child_params, topic, story_genre
    )

    # Generate the images for the story chapters
    images = generate_chapter_images(
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

    # Get the story attributes
    story_attributes = get_entry_attributes(inserted_story)

    # Create the payload
    payload = {
        "story_id": story_attributes["story_id"],
        "title": story_title,
        "chapter_titles": chapter_titles,
        "chapter_contents": chapter_contents,
        "chapter_images": images,
        "created_at": story_attributes["created_at"],
    }

    return payload


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

    # Generate the image for the child
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
