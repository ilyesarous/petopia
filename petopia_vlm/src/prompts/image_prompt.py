def build_image_prompt(description: str) -> str:
    return (
        f"Generate a high-resolution, ultra-realistic image of a pet that closely matches the following description. "
        f"The result should look like a real animal photographed in natural lighting, with clear fur texture and lifelike eyes. "
        f"Here is the description: {description}"
    )
