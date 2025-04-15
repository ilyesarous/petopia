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
# llm = OpenAI(api_key=openai_api_key)

# client_weaviate=client


# client_weaviate=client
# uuids_to_delete = [
#     "1d61cefc-d911-42a1-ace0-9f3d74762a25",
#     "1ea2a92f-6878-4441-928e-8d177829c6c5",
#     "27271b31-b0b8-4a32-9ee1-a399e98dea0e",
#     "30e489ed-ea4c-4284-bdbc-615d3e1b0512",
#     "32fe87fa-0415-432e-8021-9c10278495ee",
#     "38571f9a-5788-4a5e-af83-6b09cc0a1659",
#     "44877173-f0c7-49ba-9acd-f431958cbbf4",
#     "52e9d598-5fe5-4487-aa9c-7bbc248497d3",
#     "55557c51-70a4-430b-a517-942e45a4a0b3",
#     "5c9f3fcc-11ef-48dc-8216-6cfac2341844",
#     "5ec9fcb4-b0a7-437c-8e13-ce44edff9cff",
#     "62615241-edf2-411a-81d1-b70bd0d34c1e",
#     "71da2fbe-dd87-4095-98ac-5fe82c21c751",
#     "728a957b-8723-461b-a529-01f28356f75f",
#     "75a9ba62-5b1e-4e2f-8cc9-c53844fd9a2c",
#     "7b3d1d4f-0b44-4e1c-8a3d-5243e6abc0d8",
#     "ac7d980e-a949-4bd3-b0fa-03e8053a944b",
#     "acbb2d00-5ebf-4ae0-9510-8e184fa03d29",
#     "b61f05fd-0d4c-4af9-8845-82091f5fa190",
#     "bd35377c-be63-4c4f-8fd0-e8f3ef3665aa",
#     "caa7b552-893b-4240-bbdc-dc43d87e4049",
#     "d3da069e-0797-4717-b741-e53f7ede2e03",
#     "e2336c2d-60f0-4377-b9a4-a6d1e116542b",
#     "efbe34bc-9e76-4b8d-88f7-898f0a834d38",
#     "f16da8d6-69be-4642-b91b-46d95d8c7cfa"




# ]

# collection = client.collections.get("ImageDescription")
# for uuid in uuids_to_delete:
#     collection.data.delete_by_id(uuid)

app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True)

# Register Blueprints
app.register_blueprint(generate_image_bp, url_prefix='/api')
app.register_blueprint(image_api, url_prefix='/api')
app.register_blueprint(pet_recommendation_api, url_prefix='/api')
app.register_blueprint(verify_person_apibp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
