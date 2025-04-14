import os
from dotenv import load_dotenv
from openai import OpenAI
from src.prompts.image_prompt import build_image_prompt
import base64

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_image(description):
    prompt = build_image_prompt(description)

    try:
        response = client.images.generate(
            model="dall-e-3",  # or "dall-e-2" if you're using that version
            prompt=prompt,
            n=1,
            size="1024x1024"  # You can also use "1024x1024" or "512x512"
        )

        image_url = response.data[0].url
        print(f"Image URL: {image_url}")
        return image_url

    except Exception as e:
        print(f"Error generating image: {e}")
        return "An error occurred while generating the image."
