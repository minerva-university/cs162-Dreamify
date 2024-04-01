"""This module contains the prompt templates for the OpenAI API."""

from string import Template

story_prompt_template = Template(
    """\
Generate a bedtime story for a child as the main character.
The main character's name is ${name}, and their age range is ${age_range} years.
${name} is ${sex}.
The main topic of bedtime story should be: ${topic}.The story genre is ${story_genre}.
Incorporate favorite animals (${fav_animals}), favorite activities (${fav_activities}), and favorite shows (${fav_shows}) in the story if relevant, but it's not necessarily.
The length of the story is about 1000 words and it should be clearly divided into 5 chapters.
You should first output the title in the format like this: Title of the story: <title>.
Every chapter title should be formatted like this: Chapter <number> title: <chapter_title>
Every chapter should be formatted like this: Chapter <number> description: <chapter_description>
Don't make the summary paragraph and end the story with "The end."
Don't break any privacy policies. Be unique and creative when developing the story, so that it's interesting for children of the age range ${age_range} years to read it.\
"""
)

chapter_image_prompt_template = Template(
    """\
Make an illustration for a story chapter in this style: ${image_style}.
Here is a description of the character ${name}:
1. Age range: ${age_range}
2. Gender: ${sex}
3. Eye color: ${eye_color}
4. Hair type: ${hair_type}
5. Hair color: ${hair_color}
6. Ethnicity: ${ethnicity}

The image must contain only one single scene of the chapter.
There must be only a image without any text in it.
Generate only one image.

Story chapter:
${chapter_content}\
"""
)

child_image_prompt_template = Template(
    """\
Create an image of a child with these characteristics:
- Age range: ${age_range}
- Gender: ${sex}
- Eye color: ${eye_color}
- Hair type: ${hair_type}
- Hair color: ${hair_color}
- Ethnicity: ${ethnicity}

The image must show portrait-view of the child, cut off at the bottom image border.
The child should be smiling and the background should be neutral.
Generate only one version of the child.
The image style should be realistic-cartoonish.

There must be only a image without any text in it.
Generate only one image.\
"""
)
