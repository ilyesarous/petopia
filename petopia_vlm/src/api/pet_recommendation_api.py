from flask import Blueprint, request, jsonify
from src.service.find_similar_pets_service import find_similar_pets_from_image

pet_recommendation_api = Blueprint('pet_recommendation_api', __name__)

@pet_recommendation_api.route('/recommendations', methods=['POST'])
def recommend_pets():
    data = request.get_json()
    image_url = data.get("image_url")

    if not image_url:
        return jsonify({"error": "Missing image_url"}), 400

    try:
        matches = find_similar_pets_from_image(image_url)
        return jsonify({"matches": matches})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
