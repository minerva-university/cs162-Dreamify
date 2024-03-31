"""
This module contains functions for assembling prompts.
"""

import re
from string import Template

from ..prompting.prompt_templates import (
    story_prompt_template,
    chapter_image_prompt_template,
    child_image_prompt_template,
)


def extract_story_components(
    story: str,
) -> tuple[str, list[str], list[str]]:
    """
    Extract the components of a story from a string.

    Args:
        story (str): The story string.

    Returns:
        tuple[str, list[str], list[str]]: A tuple containing the story title, story details, and chapters.
    """
    # Extract the story title
    title_match = re.search(r"Title of the story: (.+)", story)
    title = title_match.group(1) if title_match else "Unknown"

    # Pattern to split and extract chapters
    chapter_pattern = re.compile(
        r"""
        Chapter\ \d+\ title:     # Matches 'Chapter <number> title:' indicating the start of a chapter title
        (.+?)                    # Lazily captures the chapter title
        \n\n                     # Matches two newline characters separating title and description
        Chapter\ \d+\ description: # Matches 'Chapter <number> description:' indicating the start of a chapter description
        (.+?)                    # Lazily captures the chapter description
        (?=\n\nChapter\ \d+\ title:|\n\nThe end.|$) # Lookahead for the start of the next chapter or the end of the story
        """,
        re.DOTALL | re.VERBOSE,
    )

    chapter_titles = []
    chapter_contents = []

    # Extract chapters details
    for match in chapter_pattern.finditer(story):
        # Extract chapter title and content
        chapter_title = (
            match.group(1).strip() if match.group(1).strip() else "Unknown"
        )
        chapter_content = (
            match.group(2).strip() if match.group(2).strip() else "Unknown"
        )

        # Append the chapter title and content to the respective lists
        chapter_titles.append(chapter_title)
        chapter_contents.append(chapter_content)

    return title, chapter_titles, chapter_contents


def extract_placeholders_from_template(template: Template) -> list[str]:
    """
    Extract placeholders from a string Template.

    Args:
        template (Template): A Template object from Python's string module.

    Returns:
        list[str]: A list of unique placeholder names found in the template.
    """
    # Regular expression to find ${placeholder} or $placeholder in the template
    placeholder_pattern = re.compile(
        r"""
        \$              # Start with a dollar sign
        \{?             # Optionally followed by an opening brace
        (\w+)           # Capture one or more word characters (the placeholder name)
        \}?             # Optionally followed by a closing brace
    """,
        re.VERBOSE,
    )

    # Find all matches in the template's template string
    required_placeholders = placeholder_pattern.findall(template.template)

    # Filter out duplicates by converting the list to a set
    required_placeholders = set(required_placeholders)

    # Return the required placeholders as a list
    return list(required_placeholders)


def create_story_prompt(
    child_params: dict[str, str], topic: str, story_genre: str
) -> str:
    """
    Create a story prompt based on the child's parameters and the story topic.

    Args:
        child_params (dict[str, str]): The parameters for the child.
        topic (str): The topic of the story.
        story_genre (str): The genre of the story.

    Raises:
        ValueError: If there are missing required placeholders.

    Returns:
        str: The story prompt.
    """
    # Combine the child's parameters with the topic
    parameters = {
        **child_params,
        "topic": topic,
        "story_genre": story_genre,
    }

    # Extract the required placeholders from the story prompt template
    required_placeholders = extract_placeholders_from_template(
        story_prompt_template
    )

    # Check for missing required placeholders
    missing_placeholders = [
        param for param in required_placeholders if param not in parameters
    ]

    # Raise an error if there are missing required placeholders
    if missing_placeholders:
        raise ValueError(
            f"Missing required placeholders: {', '.join(missing_placeholders)}"
        )

    # Replace the Nones in the optional child_params with "unspecified"
    for key in ["fav_animals", "fav_activities", "fav_shows"]:
        if key in parameters and parameters[key] is None:
            parameters[key] = "unspecified"

    # Create the story prompt
    return story_prompt_template.substitute(parameters)


def create_chapter_image_prompt(
    child_params: dict[str, str],
    image_style: str,
    chapter_content: str,
    chapter_number: int,
) -> str:
    """
    Create a chapter image prompt based on the child's parameters, image style,
    chapter content, and chapter number.

    Args:
        child_params (dict[str, str]): The parameters for the child.
        image_style (str): The style of the image.
        chapter_content (str): The content of the chapter.
        chapter_number (int): The number of the chapter.

    Returns:
        str: The image prompt.
    """

    # Combine the child's parameters with the image generation parameters
    parameters = {
        **child_params,
        "chapter_content": chapter_content,
        "chapter_number": chapter_number,
        "image_style": image_style,
    }

    # Substitute the parameters into the image prompt template and return it
    return chapter_image_prompt_template.substitute(**parameters)


def create_child_image_prompt(child_params: dict[str, str]) -> str:
    """
    Create a child image prompt based on the child's parameters and image style.

    Args:
        child_params (dict[str, str]): The parameters for the child.

    Returns:
        str: The image prompt.
    """

    # Substitute the parameters into the image prompt template and return it
    return child_image_prompt_template.substitute(**child_params)
