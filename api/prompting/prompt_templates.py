"""This module contains the prompt templates for the OpenAI API."""

story_prompt = """\
Generate a bedtime story for a child as the main character.
The main character's name is {kid_b_i_name}, and their age range is {kid_b_ii_age_range} years.
They are {kid_b_iii_sex} and the {kid_b_iv_sibling_relationship} child in the family.
The main topic of bedtime story should be: {story_a_topic}.
Incorporate favorite animals ({kid_c_i_fav_animals}) and favorite activities ({kid_c_ii_fav_activities}) in the story if relevant, but it's not necessarily.
The length of the story is about 1000 words and it should be clearly divided into 5 chapters.
Every chapter should be formatted like this: Chapter <number>: <chapter_title>
Don't break any privacy policies. Be unique and creative when developing the story, so that it's interesting for children of the age range {kid_b_ii_age_range} years to read it.\
"""

image_prompt = """\
Make an illustration for a story chapter in this style: {image_style}.
Here is a description of the character {kid_b_i_name}:
- Age range: {kid_b_ii_age_range}
- Sex: {kid_b_iii_sex}
- Eye color: {kid_a_i_eye_color}
- Hair type: {kid_a_ii_hair_type}
- Hair color: {kid_a_iii_hair_color}
- Skin tone: {kid_a_iv_skin_tone}

Story chapter:
{chapter_content}\
"""
