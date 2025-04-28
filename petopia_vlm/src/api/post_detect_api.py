from openai import OpenAI
import os
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
post_detect_api = Blueprint("post_detect_api", __name__)

@post_detect_api.route("/moderate-text", methods=["POST"])
def moderate_text():
    try:
        data = request.get_json()
        text = data.get("text", "").strip()

        if not text:
            return jsonify({"status": "try another", "reason": "Empty input"}), 200

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Moderate the following input:\n"
                        f"{text}\n\n"
                        "Rules:\n"
                        "- Only allow pet-related topics such as pet breeds, animal care, adoption, pet food, veterinary services, missing pets, or stories about a utopia for pets.\n"
                        "- If the input contains inappropriate, offensive, hateful, or sexual content — respond with 'inappropriate'.\n"
                        "- If the input is gibberish, random characters, or meaningless — respond with 'try another'.\n"
                        "- If the topic is completely unrelated to pets (e.g., sports, politics, unrelated jokes) — respond with 'try another'.\n\n"
                        "Return ONLY one of the following:\n"
                        "- 'ok'\n"
                        "- 'inappropriate'\n"
                        "- 'try another'"
                    )
                }
            ],
            max_tokens=5,
            temperature=0
        )

        result = response.choices[0].message.content.strip().lower()
        return jsonify({ "status": result }), 200

    except Exception as e:
        return jsonify({ "error": str(e) }), 500