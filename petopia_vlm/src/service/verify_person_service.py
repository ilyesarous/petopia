import openai
import os
import json
from src.connection.connect_llm import client

openai.api_key = os.getenv("OPENAI_API_KEY")

def verify_person(image_path: str, full_latin_name: str):
    try:
        # Remove base64 header if present
        if image_path.startswith("data:image"):
            image_path = image_path.split(",")[1]

        # Define GPT function schema
        functions = [
            {
                "name": "choice",
                "description": "Determines if the Arabic name matches the Latin name.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "decision": {
                            "type": "boolean",
                            "description": "True if names match, false otherwise."
                        },
                        "name": {
                            "type": "string",
                            "description": "Translated first name in Latin extracted from the Arabic CIN name."
                        },
                    },
                    "required": ["decision", "name"],
                    "additionalProperties": False
                }
            }
        ]

        # Use only the first name for comparison
        latin_name = full_latin_name.strip().split()[0].lower()

        # Final system prompt with hardcoded fuzzy logic
        system_prompt = (
           "You are an intelligent assistant responsible for verifying identity using Tunisian CIN cards (Carte d'Identité Nationale). "
            "You will receive two inputs:\n"
            "- A Latin-script name (e.g., 'hsan'), and\n"
            "- A CIN image containing an Arabic full name with the label 'الإسم'.\n\n"

            "🎯 Your job is to extract the **first Arabic word on the same line immediately following 'الإسم'**, and compare it to the user-provided Latin name.\n\n"

            "🔍 Instructions:\n"
            "1. Locate the label 'الإسم' **exactly** in the image.\n"
            "2. On the **same line**, extract the Arabic word **immediately following** 'الإسم'. Do **not** look above or below.\n"
            "   - Only use the word directly to the right of 'الإسم'.\n"
            "3. Transliterate this Arabic word into a Latin equivalent.\n"
            "4. Compare it with the provided Latin name (assumed to be the user's first name).\n\n"

            "🧠 Use fuzzy, phonetic matching for the comparison. Do NOT match letter by letter. Accept:\n"
            "- 'hsan', 'hassan', 'hacen' ≈ 'حسن'\n"
            "- 'mohamed', 'muhammad', 'mohamad' ≈ 'محمد'\n"
            "- 'youssef', 'yusuf', 'youcef' ≈ 'يوسف'\n"
            "- 'ahmad', 'ahmed', 'ahmet' ≈ 'أحمد'\n\n"

            "❌ Do NOT extract names from the next line.\n"
            "❌ Do NOT use full names or anything after 'بن', 'بنت', etc.\n\n"

            "✅ Return true only if the names match phonetically or commonly.\n"
            "❌ Return false if they clearly do not refer to the same person.\n\n"

            "Format your response using the `choice` function:\n"
            "- `{ \"decision\": true, \"name\": \"<latin version>\" }`\n"
            "- `{ \"decision\": false, \"name\": \"<latin version>\" }`"


        )

        # Send prompt and image to GPT
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                { "role": "system", "content": system_prompt },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"Does the Arabic name in the CIN match '{latin_name}'?"
                        },
                        {
                            "type": "image_url",
                            "image_url": { "url": f"data:image/jpeg;base64,{image_path}" }
                        }
                    ]
                }
            ],
            temperature=0.3,
            functions=functions,
            function_call={ "name": "choice" }
        )

        # Parse and return result
        function_call = response.choices[0].message.function_call
        arguments = json.loads(function_call.arguments)
        return {
            "result": arguments.get("decision"),
            "extracted_name": arguments.get("name")
        }

    except Exception as e:
        print("❌ GPT verification error:", e)
        return None
