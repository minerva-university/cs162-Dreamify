"""
Module for assembling prompts.
"""

import re

from .prompt_templates import story_prompt, image_prompt


def split_story_into_chapters(story: str) -> list[str]:
    """
    Split a story into chapters.

    Args:
        story (str): The story to split.

    Returns:
        list[str]: The chapters of the story.
    """
    pattern = re.compile(
        r"\*{0,2}Chapter \d+: [^\*]+?(\*{0,2})([\s\S]+?)(?=\*{0,2}Chapter \d+|$)"
    )
    return [match.group(0).strip() for match in pattern.finditer(story)]


def create_story_prompt(*, kid_params: dict[str, str], story_topic: str) -> str:
    """
    Create a story prompt based on the kid's parameters and the story topic.

    Args:
        kid_params (dict[str, str]): The parameters for the kid.
        story_topic (str): The topic of the story.

    Returns:
        str: The story prompt.
    """
    return story_prompt.format(**kid_params, story_a_topic=story_topic)


def create_image_prompt(
    *,
    kid_params: dict[str, str],
    image_style: str,
    chapter_content: str,
    chapter_number: int
) -> str:
    """
    Create an image prompt based on the kid's parameters,
    the image style, the chapter content, and the chapter number.

    Args:
        kid_params (dict[str, str]): The parameters for the kid.
        image_style (str): The style of the image.
        chapter_content (str): The content of the chapter.
        chapter_number (int): The number of the chapter.

    Returns:
        str: The image prompt.
    """
    parameters = {
        **kid_params,
        "chapter_content": chapter_content,
        "chapter_number": chapter_number,
        "image_style": image_style,
    }

    return image_prompt.format(**parameters)
