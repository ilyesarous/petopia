from flask import Blueprint, request, jsonify
from src.service.find_similar_pets_service import find_similar_pets

pet_recommendation_api = Blueprint('pet_recommendation_api', __name__)

@pet_recommendation_api.route('/recommendations', methods=['POST'])
def recommend_pets():
    data = request.get_json()
    description = data.get("description")

    if not description :
        return jsonify({"error": "Missing description "}), 400

    try:
        matches = find_similar_pets(description)
        return jsonify({"matches": matches})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
