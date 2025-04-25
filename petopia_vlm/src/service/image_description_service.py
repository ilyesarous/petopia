from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_description_from_url(image_url: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                     {
                        "type": "text",
                        "text": (
                             "Describe this pet in a natural and vivid sentence as if you're writing a caption for a pet adoption post. "
                             "Mention its species, fur color and texture, size, eye color, ear shape, tail style, and any special features. "
                             "Use a tone like: 'A small fluffy white dog with curly fur and round brown eyes' or 'An orange corgi with dark eyes and short legs.' "
                             "Only describe what you can clearly see in the image. Use English unless the breed or context is clearly French, then use French."
                        )
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url
                        },
                    },
                ],
            }
        ],
        temperature=0.7,
        max_tokens=500
    )

    return response.choices[0].message.content.strip()
