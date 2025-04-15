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
                            "Observe this image and describe the pet in realistic detail. "
                            "Include fur color and length, size, eye color, ear shape, and any special markings. "
                            "If the pet is a cat or dog, identify the breed if possible. "
                            "Respond in French if the pet looks like a French breed or context, otherwise in English."
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
