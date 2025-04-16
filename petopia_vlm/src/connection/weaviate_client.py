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
    # 1) Generate embedding using text-embedding-3-small
    embed_resp = llm.embeddings.create(
        model="text-embedding-3-small",
        input=description
    )
    vector = embed_resp.data[0].embedding

    # 2) Prepare the object
    data_object = {
        "image_id": image_id
    }
    collection_name = "ImageDescription"

    # 3) Ensure collection exists
    if not client.collections.exists(collection_name):
        client.collections.create(
            name=collection_name,
            properties=[
                Property(name="image_id", data_type=DataType.TEXT)
            ]
        )
        print(f"✅ Created '{collection_name}' collection.")

    # 4) Insert with your own vector
    coll = client.collections.get(name=collection_name)
    uuid = coll.data.insert(
        properties=data_object,
        vector=vector
    )
    print(f"✅ Stored vector for {image_id} with UUID {uuid}.")
