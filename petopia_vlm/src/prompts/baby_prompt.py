def build_baby_pet_prompt(desc1: str, desc2: str) -> str:
    return (
        f"Generate an ultra-realistic image of a single baby animal that is a crossbreed between the following two pets:\n\n"
        f"Parent 1: {desc1}\n"
        f"Parent 2: {desc2}\n\n"
        f"The baby should combine distinct physical traits from both parents in a believable way. "
        f"It should have soft, fluffy fur, large expressive eyes, and a playful, curious expression. "
        f"Use natural lighting and a clean, simple background. "
        f"The result should be adorable, photorealistic, and look like a real animal that could exist in nature."
    )
