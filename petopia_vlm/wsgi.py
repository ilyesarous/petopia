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
from src.api.breed_detect_api import breed_detect_api
from src.api.pet_baby_api import baby_pet_api
from src.service.find_similar_pets_service import find_similar_pets
# Load environment variables
weaviate_url = os.getenv("WEAVIATE_URL")
weaviate_api_key = os.getenv("WEAVIATE_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

# llm = OpenAI(api_key=openai_api_key)

# client_weaviate=client


# client_weaviate=client
# uuids_to_delete = [
#    "33f05407-45fc-4ea6-95b1-2fa1d6ba3a4d",
#    "3aee42b1-b832-4fe5-b554-23f086d773ff",
#    "41bd975d-4dee-41cf-b1e6-a60582c06a0d",
#    "55b63006-bf20-41a5-9c67-0c75f6b4cf82",
#    "6ab33b9c-f48d-48f8-aacc-c6266d849e6e",
#    "b54c4285-d9c7-4f47-aadd-e344a514fd11",
#    "c635c3ab-092c-4d62-8cea-b438ca70d956",
#     "ee3815bc-eb47-4011-8bf9-e1679e06dc98",
#     "f58373f7-0b81-48bf-bec1-d2a03b53721d",
#     "fb74966c-06ae-4414-ab77-493478bee1d2",
#     "fcc49fb1-820e-4612-99cc-e09cf105a4b0"



# ]

# collection = client.collections.get("ImageDescription")
# deleted = []
# failed = []

# for uuid in uuids_to_delete:
#     try:
#         collection.data.delete_by_id(uuid)
#         print(f"✅ Deleted vector with UUID: {uuid}")
#         deleted.append(uuid)
#     except Exception as e:
#         print(f"❌ Failed to delete UUID {uuid}: {str(e)}")
#         failed.append({"uuid": uuid, "error": str(e)})
# print(f"\n🧹 Summary: Deleted {len(deleted)} / {len(uuids_to_delete)} vectors.")
# if failed:
#     print("❌ The following failed:")
#     for f in failed:
#         print(f"- {f['uuid']}: {f['error']}")
#---------------------------------------------------------------
# collection = client.collections.get("ImageDescription")
# deleted = []
# failed = []

# try:
#     # Fetch all objects' UUIDs
#     objects = collection.query.fetch_objects(limit=10000)  # Adjust limit as needed
#     uuids_to_delete = [obj.uuid for obj in objects.objects]

#     for uuid in uuids_to_delete:
#         try:
#             collection.data.delete_by_id(uuid)
#             print(f"✅ Deleted UUID: {uuid}")
#             deleted.append(uuid)
#         except Exception as e:
#             print(f"❌ Failed: {uuid} -> {str(e)}")
#             failed.append(uuid)

#     print(f"\n🧹 Summary: {len(deleted)} deleted, {len(failed)} failed.")
# except Exception as e:
#     print(f"❌ Error during deletion: {str(e)}")
# finally:
#     client.close()

app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True)

# Register Blueprints
app.register_blueprint(generate_image_bp, url_prefix='/api')
app.register_blueprint(image_api, url_prefix='/api')
app.register_blueprint(pet_recommendation_api, url_prefix='/api')
app.register_blueprint(verify_person_apibp, url_prefix='/api')
app.register_blueprint(baby_pet_api, url_prefix='/api')
app.register_blueprint(breed_detect_api, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
