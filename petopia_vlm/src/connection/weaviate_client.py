import os
import weaviate
from weaviate.classes.init import Auth
from weaviate.classes.config import Property, DataType
from dotenv import load_dotenv
from openai import OpenAI

# Load credentials
load_dotenv()
weaviate_url     = os.getenv("WEAVIATE_URL")
weaviate_api_key = os.getenv("WEAVIATE_API_KEY")
openai_api_key   = os.getenv("OPENAI_API_KEY")

# Init clients
client = weaviate.connect_to_weaviate_cloud(
    cluster_url     = weaviate_url,
    auth_credentials= Auth.api_key(weaviate_api_key),
    skip_init_checks= True,
)




llm = OpenAI(api_key=openai_api_key)

print("✅ Weaviate is ready!" if client.is_ready() else "❌ Weaviate is not ready.")

def store_description(image_id: str, description: str):
    # 1) Generate vector embedding using OpenAI
    embed_resp = llm.embeddings.create(
        model="text-embedding-3-small",
        input=description
    )
    vector = embed_resp.data[0].embedding

    # 2) Object properties: include image_id and description
    data_object = {
        "image_id": image_id,         # same as pet_id
        "description": description    # full extracted description
    }

    collection_name = "ImageDescription"

    # 3) Create collection if it doesn't exist
    if not client.collections.exists(collection_name):
        client.collections.create(
            name=collection_name,
            properties=[
                Property(name="image_id", data_type=DataType.TEXT),
                Property(name="description", data_type=DataType.TEXT)
            ]
        )
        print(f"✅ Created '{collection_name}' collection.")

    # 4) Insert using custom UUID (pet_id as UUID)
    coll = client.collections.get(name=collection_name)

    # Ensure UUID is a valid UUID string (convert int to hex UUID if needed)
    import uuid
    try:
        pet_uuid = str(uuid.UUID(image_id))  # if image_id is already a UUID string
    except ValueError:
        # Convert numeric pet ID to a valid UUID by hashing (optional approach)
        pet_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"pet-{image_id}"))

    # Insert the object with your own UUID and vector
    coll.data.insert(
        uuid=pet_uuid,
        properties=data_object,
        vector=vector
    )

    print(f"✅ Stored vector for pet_id={image_id} with UUID={pet_uuid}")
