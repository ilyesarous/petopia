import os
from openai import OpenAI
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify

load_dotenv()

# Initialize the OpenAI client using the key from environment variables
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

post_generate_api = Blueprint("post_generate_api", __name__)

@post_generate_api.route("/generate-post", methods=["POST"])
def generate_post():
    try:
        data = request.get_json()
        topic = data.get("topic", "").strip()

        if not topic:
            return jsonify({"status": "try another", "reason": "Empty topic input"}), 200

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant that creates engaging, creative social media posts about pets and animals."
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"The topic is:\n"
                        f"\"{topic}\"\n\n"
                        "Instructions:\n"
                        "- ONLY generate a post related to pets, animals, pet care, veterinary services, animal adoption, missing pets, or happy animal stories.\n"
                        "- If the topic is NOT related to animals or pets, respond exactly: 'try another'.\n"
                        "- Respond in the SAME language as the topic input.\n"
                        "- First, check if the topic mentions a required number of lines (e.g., '2 lines', '10 lines').\n"
                        "- If a number of lines is specified, STRICTLY write exactly that number of lines. No more, no less.\n"
                        "- If no number is specified, write between 8 and 15 lines.\n"
                        "- Each line should be a complete sentence or idea, starting on a new line.\n"
                        "- The tone must be engaging, fun, positive.\n"
                        "- Use emojis naturally if fitting.\n"
                        "- Add relevant hashtags at the end if appropriate.\n"
                        "- Do NOT explain anything. ONLY output the final post content."
                    )
                }
            ],
            max_tokens=500,
            temperature=0.7,
        )


        suggestion = response.choices[0].message.content.strip()

        return jsonify({ "postSuggestion": suggestion }), 200

    except Exception as e:
        return jsonify({ "error": str(e) }), 500
