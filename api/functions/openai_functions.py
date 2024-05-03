"""
This module contains functions for calling the OpenAI API.
"""

from openai import OpenAI, AsyncOpenAI
from flask import current_app

def text_gen(
    prompt: str, *, model: str = "gpt-4-turbo", max_tokens: int = 3000
) -> str:
    """
    Call the OpenAI API to generate a response based on the given prompt.

    Args:
        prompt (str): The input prompt.
        model (str): The model to use for generating the response. Default is "gpt-4-turbo".
        max_tokens (int): The maximum number of tokens to generate. Default is 3000.

    Returns:
        str: The generated response from the OpenAI API.
    """
    with current_app.app_context():
        try:
            # Create an OpenAI client
            client = OpenAI()

            # Call the OpenAI API to generate a response
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "user", "content": prompt},
                ],
                max_tokens=max_tokens,
            )

            # Select the first choice
            output = response.choices[0].message.content

            # Strip any leading/trailing whitespace and return the output
            return output.strip()
        except Exception as e:
            current_app.logger.error(f"Error generating text: {e}")
            raise e

def image_gen(
    prompt: str,
    *,
    model: str = "dall-e-3",
    size: str = "1024x1024",
    quality: str = "standard",
    n: int = 1,
) -> str:
    """
    Call the OpenAI API to generate an image based on the given prompt.

    Args:
        prompt (str): The input prompt.
        model (str): The model to use for generating the image. Default is "dall-e-3".
        size (str): The size of the generated image. Default is "1024x1024".
        quality (str): The quality of the generated image. Default is "standard".
        n (int): The number of images to generate. Default is 1.

    Returns:
        str: The URL of the generated image.
    """
    with current_app.app_context():
        try:
            # Create an OpenAI client
            client = OpenAI()

            # Limit the prompt to 1000 characters (API limit)
            prompt = prompt[:1000]

            # Call the OpenAI API to generate an image(s)
            response = client.images.generate(
                model=model,
                prompt=prompt,
                size=size,
                quality=quality,
                n=n,
            )

            # Select the image URL
            url = response.data[0].url

            # Strip any leading/trailing whitespace and return the URL
            return url.strip()
        except Exception as e:
            current_app.logger.error(f"Error generating image: {e}")
            raise e


async def image_gen_async(
    prompt: str,
    *,
    model: str = "dall-e-3",
    size: str = "1024x1024",
    quality: str = "standard",
    n: int = 1,
) -> str:
    """
    Asynchronously call the OpenAI API to generate an image based on the given prompt.

    Args:
        prompt (str): The input prompt.
        model (str): The model to use for generating the image. Default is "dall-e-3".
        size (str): The size of the generated image. Default is "1024x1024".
        quality (str): The quality of the generated image. Default is "standard".
        n (int): The number of images to generate. Default is 1.

    Returns:
        str: The URL of the generated image.
    """
    with current_app.app_context():
        try:
            # Create an asynchronous OpenAI client
            client = AsyncOpenAI()

            # Limit the prompt to 1000 characters (API limit)
            prompt = prompt[:1000]

            # Asynchronously call the OpenAI API to generate an image(s)
            response = await client.images.generate(
                model=model,
                prompt=prompt,
                size=size,
                quality=quality,
                n=n,
            )

            # Select the image URL
            url = response.data[0].url

            # Strip any leading/trailing whitespace and return the URL
            return url.strip()
        except Exception as e:
            current_app.logger.error(f"Error generating image: {e}")
            raise e
