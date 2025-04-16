from flask import Blueprint, request, jsonify
from src.connection.weaviate_client import client
from src.prompts.baby_prompt import build_baby_pet_prompt
from src.service.image_service import generate_image


baby_pet_api = Blueprint("baby_pet_api", __name__)
@baby_pet_api.route("/generate-baby-pet", methods=["POST"])
def generate_baby_pet_image():
    data = request.get_json()
    pet_id_1 = str(data.get("pet_id_1"))
    pet_id_2 = str(data.get("pet_id_2"))

    if not pet_id_1 or not pet_id_2:
        return jsonify({"error": "Both pet_id_1 and pet_id_2 are required"}), 400

    try:
        collection = client.collections.get("ImageDescription")
        results = collection.query.fetch_objects(limit=1000)

        desc1, desc2 = None, None

        for obj in results.objects:
            image_id = obj.properties.get("image_id")
            if image_id == pet_id_1:
                desc1 = obj.properties.get("description")
            elif image_id == pet_id_2:
                desc2 = obj.properties.get("description")

            if desc1 and desc2:
                break

        if not desc1 or not desc2:
            return jsonify({"error": "Descriptions for both pets not found."}), 404

        prompt = build_baby_pet_prompt(desc1, desc2)
        image_url = generate_image(prompt)

        return jsonify({"image_url": image_url}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
