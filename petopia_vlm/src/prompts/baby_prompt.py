def build_baby_pet_prompt(desc1: str, desc2: str) -> str:
    return (
        f"Generate an ultra-realistic image of a baby animal that looks like a mix of the following two pets:\n\n"
        f"Parent 1: {desc1}\n"
        f"Parent 2: {desc2}\n\n"
        f"The baby should have soft fur, large eyes, and a playful expression. "
        f"Use natural lighting, a clean background, and make the image adorable and believable."
    )
