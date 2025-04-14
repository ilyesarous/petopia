from src.connection.connect import conn  

from flask import Blueprint, request, jsonify
from src.service.image_description_service import generate_description_from_url
from src.connection.weaviate_client import store_description

image_api = Blueprint("image_api", __name__)

@image_api.route("/description", methods=["POST"])
def generate_description():
    data = request.get_json()
    image_url = data.get("image_url")
    image_id = data.get("image_id")

    if not image_url or not image_id:
        return jsonify({"error": "image_url and image_id are required"}), 400

    try:
        description = generate_description_from_url(image_url)
        store_description(image_id, description)
        return jsonify({
            "image_id": image_id,
            "description": description
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@image_api.route("/description/all-pets", methods=["POST"])
def generate_descriptions_for_all_pets():
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_pet, pet_image FROM pet")
        pets = cursor.fetchall()

        results = []

        for pet in pets:
            image_id = str(pet["id_pet"])
            image_url = pet["pet_image"]

            if not image_url:
                print(f"⏭️ Skipping pet {image_id}, no image.")
                continue

            try:
                description = generate_description_from_url(image_url)
                store_description(image_id, description)
                print(f"✅ Stored description for pet {image_id}")
                results.append({
                    "image_id": image_id,
                    "description": description
                })
            except Exception as e:
                print(f"❌ Failed for pet {image_id}: {str(e)}")
                results.append({
                    "image_id": image_id,
                    "error": str(e)
                })

        cursor.close()
        return jsonify({"results": results}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
