# src/prompts/image_prompt.py

def build_image_prompt(description: str) -> str:
    return (
        f"Create a realistic and adorable image of a pet matching the description your response should be an image of the annimal "
        f"here is the description {description}"
    )
