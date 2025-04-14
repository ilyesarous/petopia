import os
import mysql.connector
from openai import OpenAI
import weaviate
from src.connection.weaviate_client import client
from weaviate.classes.query import MetadataQuery
from flask import Flask
from flask_cors import CORS
from src.api.image_api import generate_image_bp
from src.api.image_description_api import image_api
from src.api.pet_recommendation_api import pet_recommendation_api
from src.api.verify_person_api import verify_person_apibp


# Load environment variables
weaviate_url = os.getenv("WEAVIATE_URL")
weaviate_api_key = os.getenv("WEAVIATE_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
llm = OpenAI(api_key=openai_api_key)

client_weaviate=client


client_weaviate=client
uuids_to_delete = [
    "4678dc64-ed2d-4a13-8b4b-8996e0668dfc",
    "87994111-f6d6-4833-b549-fbf30a2413c6",
    "a7202c12-e526-4f5a-8cd2-cc5a105b7e06",
    "d62b4c21-7756-48f7-88bf-c076fb250139",
    "e8284997-9633-4421-a3b2-8340466f3a99",
    "f7efbfd4-ab17-4b08-abfc-ddf050a778a9",
    "fc759da4-ca50-41ac-aa71-27051f1d72af"


]

collection = client.collections.get("ImageDescription")
for uuid in uuids_to_delete:
    collection.data.delete_by_id(uuid)

app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True)

# Register Blueprints
app.register_blueprint(generate_image_bp, url_prefix='/api')
app.register_blueprint(image_api, url_prefix='/api')
app.register_blueprint(pet_recommendation_api, url_prefix='/api')
app.register_blueprint(verify_person_apibp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
