from flask import Blueprint, request, jsonify
from src.service.verify_person_service import verify_person

verify_person_apibp = Blueprint('verify_person_api', __name__)

@verify_person_apibp.route('/verify_person', methods=['POST'])
def verify_person_route():
    try:
        data = request.get_json()

        # Extract the name and image path from the request
        name = data.get('name')
        image_path = data.get('image_path')

        if not name or not image_path:
            return jsonify({"error": "Missing name or image_path parameter"}), 400

        # Call the service function to verify
        result = verify_person(image_path, name)
        
        if result is None:
            return jsonify({"error": "Error verifying the person"}), 500
        
        return jsonify({"result": result})
    
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
