"""
Module for preparing data for the API.
"""

from base64 import b64encode
import os

from .openai_functions import text_gen, image_gen
from ..prompting.prompt_assembly import (
    create_story_prompt,
    create_image_prompt,
    split_story_into_chapters,
)

# TODO: remove this dummy story once the database is set up
dummy_story = """\
Chapter 1: Pablo's Paris Dream
Once upon a time, in a cozy little house on the outskirts of a bustling city, there lived a young boy named Pablo. Pablo was four years old, with eyes that sparkled like stars in the night sky and a smile that could brighten even the gloomiest of days. He lived with his parents in a quaint neighborhood where the streets were lined with colorful houses and friendly neighbors waved hello as they passed by.
Pablo had always dreamt of going on an adventure, exploring faraway lands and discovering new wonders. And of all the places he dreamed of visiting, none captured his imagination quite like the enchanting city of Paris. He had seen pictures of the Eiffel Tower towering high above the city skyline, and he imagined himself standing at the top, gazing out at the breathtaking views below.
Every night before bed, Pablo would close his eyes and picture himself strolling along the cobbled streets of Paris, the aroma of freshly baked croissants wafting through the air and the sound of laughter filling the bustling cafes. He dreamed of tasting creamy gelato by the Seine River and watching street performers dance beneath the twinkling lights of the city.
But most of all, Pablo dreamed of riding through the streets of Paris on the back of a magnificent horse, feeling the wind in his hair as they galloped past historic landmarks and hidden treasures.
Chapter 2: Pablo's Magical Journey Begins
One sunny morning, Pablo's parents surprised him with an exciting announcement. "Pablo," his mother said with a twinkle in her eye, "we're going on a special adventure today."
Pablo's heart leaped with joy as he listened to his parents reveal their plans. They were going to Paris! His dream was finally coming true.
With hearts full of excitement, Pablo and his parents packed their bags and set off on their journey. They boarded a shiny airplane and soared through the clouds, watching as the world below transformed into a patchwork of green fields and winding rivers.
As they touched down in Paris, Pablo's eyes widened with wonder at the sight of the majestic Eiffel Tower standing tall against the sky. "It's even more beautiful than I imagined!" he exclaimed, his voice filled with awe.
Chapter 3: Pablo's Parisian Adventures
Over the next few days, Pablo and his parents explored every corner of the magical city. They wandered through the charming streets of Montmartre, where artists painted colorful masterpieces and musicians filled the air with melodies. They visited the grand Louvre Museum, marveling at famous paintings and ancient artifacts from around the world.
But the highlight of Pablo's trip was yet to come. One sunny afternoon, as they strolled along the banks of the Seine River, they came across a bustling square filled with people and horses.
Pablo's eyes lit up with excitement as he spotted a row of beautifully adorned carriages, each pulled by a majestic horse. "Can we ride in one?" he asked, his voice filled with anticipation.
Chapter 4: Pablo's Horseback Adventure
With a smile, Pablo's parents led him to the nearest carriage, where a friendly coachman greeted them with a tip of his hat. "Would you like a ride through the city?" he asked, his voice as warm as the summer sun.
Pablo nodded eagerly, his heart racing with excitement. With a gentle hand, the coachman helped him climb into the carriage, where he settled onto the plush seat beside his parents.
As the carriage set off down the bustling streets of Paris, Pablo's laughter filled the air. He watched in awe as they passed historic landmarks and hidden alleyways, the wind whipping through his hair as the horse trotted along.
Chapter 5: Pablo's Parisian Farewell
As the sun began to set on their final day in Paris, Pablo felt a pang of sadness knowing their adventure was coming to an end. But as they stood beneath the twinkling lights of the Eiffel Tower, he knew that their memories would last a lifetime.
With one last glance at the breathtaking city skyline, Pablo whispered a silent thank you to Paris for fulfilling his dreams. And as they boarded the plane home, he knew that no matter where life took him, a piece of Paris would always remain in his heart.
And so, with hearts full of joy and memories to last a lifetime, Pablo and his family bid farewell to the city of lights, knowing that their adventures had only just begun.\
"""


# TODO: Use database data instead of dummy data
def get_kid_parameters(kid_id: str) -> dict[str, str | int]:
    """
    Get the parameters for a specific kid.

    Args:
        kid_id (str): The ID of the kid.

    Returns:
        dict[str, str | int]: The parameters for the kid.
    """
    return {
        "kid_a_i_eye_color": "brown",
        "kid_a_ii_hair_type": "straight",
        "kid_a_iii_hair_color": "black",
        "kid_a_iv_skin_tone": "light",
        "kid_b_i_name": "Pablo",
        "kid_b_ii_age_range": "4-6",
        "kid_b_iii_sex": "male",
        "kid_b_iv_sibling_relationship": "only",
        "kid_c_i_fav_animals": "horse",
        "kid_c_ii_fav_activities": "watching Harry Potter and playing football",
    }


def generate_story_chapters(
    *, kid_params: dict[str, str], story_topic: str
) -> list[str]:
    """
    Generate the chapters of a story based on the given kid ID and story topic.

    Args:
        kid_id (str): The ID of the kid.
        story_topic (str): The topic of the story.

    Returns:
        list[str]: The generated story chapters.
    """

    # Create a prompt for generating the story
    prompt = create_story_prompt(kid_params=kid_params, story_topic=story_topic)

    # Generate the story based on the prompt
    # story = text_gen(prompt)
    story = dummy_story  # TODO: use the real story instead of the dummy story

    # Split the story into chapters and return them
    return split_story_into_chapters(story)


def generate_chapter_images(
    chapters: list[str], *, kid_params: dict[str, str], image_style: str
) -> list[str]:
    """
    Generate images for each chapter of the story.

    Args:
        chapters (list[str]): The generated story chapters.
        kid_params (dict[str, str]): The parameters for the kid.
        image_style (str): The style of the images.

    Returns:
        list[str]: The generated images.
    """

    images = []
    for i, chapter in enumerate(chapters, start=1):

        # Create a prompt for generating the images
        prompt = create_image_prompt(
            kid_params=kid_params,
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


def assemble_payload(
    *, kid_id: str, story_topic: str, image_style: str
) -> dict[str, str]:
    """
    Assemble the payload for the response.

    Args:
        chapters (list[str]): The generated story chapters.
        images (list[str]): The generated images.

    Returns:
        dict[str, str]: The assembled payload.
    """
    # Get the parameters for the kid
    kid_params = get_kid_parameters(kid_id)

    # Generate the story chapters
    chapters = generate_story_chapters(kid_params=kid_params, story_topic=story_topic)

    # Generate the images for the story chapters
    images = generate_chapter_images(
        chapters, kid_params=kid_params, image_style=image_style
    )

    # Create the payload
    payload = {
        "chapters": chapters,
        "images": images,
    }

    return payload
