"""This module contains the prompt templates for the OpenAI API."""

story_prompt = """\
Generate a bedtime story for a child as the main character.
The main character's name is {name}, and their age range is {age_range} years.
They are {sex} and the {sibling_relationship} child in the family.
The main topic of bedtime story should be: {topic}.
Incorporate favorite animals ({fav_animals}) and favorite activities ({fav_activities}) in the story if relevant, but it's not necessarily.
The length of the story is about 1000 words and it should be clearly divided into 5 chapters.
Every chapter should be formatted like this: Chapter <number>: <chapter_title>
Don't break any privacy policies. Be unique and creative when developing the story, so that it's interesting for children of the age range {age_range} years to read it.\
"""

image_prompt = """\
Make an illustration for a story chapter in this style: {image_style}.
Here is a description of the character {name}:
- Age range: {age_range}
- Sex: {sex}
- Eye color: {eye_color}
- Hair type: {hair_type}
- Hair color: {hair_color}
- Skin tone: {skin_tone}

Story chapter:
{chapter_content}\
"""
