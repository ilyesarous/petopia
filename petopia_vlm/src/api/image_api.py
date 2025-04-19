from src.service.image_service import generate_image
from flask import Blueprint, request, jsonify

generate_image_bp = Blueprint('generate_image', __name__)


@generate_image_bp.route("/generate-image", methods=["POST"])
def generate_image_endpoint():
    try:
        data = request.get_json()

        # Get user description from the request
        description = data.get("description")
        if not description:
            return jsonify({"error": "Description is required"}), 400

        # Call the function to generate the image
        image_result = generate_image(description)

        return jsonify({"image_result": image_result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
