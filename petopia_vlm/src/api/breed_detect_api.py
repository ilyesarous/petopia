from flask import Blueprint, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# Setup OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

breed_detect_api = Blueprint("breed_detect_api", __name__)

@breed_detect_api.route("/detect-breed", methods=["POST"])
def detect_breed():
    try:
        data = request.get_json()
        base64_image = data.get("image_base64")

        if not base64_image:
            return jsonify({"error": "image_base64 is required"}), 400

        # Build the prompt
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "Analyze the following image and return:\n"
                                "- The species (Dog or Cat)\n"
                                "- The breed (if identifiable)\n"
                                "- The estimated age of the pet using a number(if possible)\n"
                                "- The estimated size of the pet: SMALL, MEDIUM, or LARGE (in uppercase)\n"
                                "- The estimated gender of the pet: MALE, FEMALE\n"
                                "- Language: English only\n"
                                "Be brief and specific."
                            )
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300,
            temperature=0.5
        )

        result = response.choices[0].message.content.strip()
        print(result)
        return jsonify({"analysis": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
