"""
This module contains functions for calling the OpenAI API.
"""

from openai import OpenAI


def process_gen_output(output: str) -> str:
    """
    Process the output of the OpenAI API.

    Args:
        output (str): The output of the OpenAI API.

    Returns:
        str: The processed output.
    """
    # Remove extra newlines and trailing whitespace
    return output.strip().replace("\n\n", "\n")


# TODO: Set max_tokens to a reasonable value
def text_gen(prompt: str, *, model: str = "gpt-3.5-turbo", max_tokens: int = 1) -> str:
    """
    Call the OpenAI API to generate a response based on the given prompt.

    Args:
        prompt (str): The input prompt.
        model (str): The model to use for generating the response. Default is "gpt-3.5-turbo".
        max_tokens (int): The maximum number of tokens to generate. Default is 1.

    Returns:
        str: The generated response from the OpenAI API.
    """
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

    # Process the output and return it
    return process_gen_output(output)


def image_gen(
    prompt: str,
    *,
    model: str = "dall-e-3",
    size: str = "1024x1024",
    quality: str = "standard",
    n: int = 1
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
    # Create an OpenAI client
    client = OpenAI()

    # Call the OpenAI API to generate an image(s)
    response = client.images.generate(
        model=model,
        prompt=prompt,
        size=size,
        quality=quality,
        n=n,
    )

    # Select the image URL
    output = response.data[0].url

    # Process the output and return it
    return process_gen_output(output)
