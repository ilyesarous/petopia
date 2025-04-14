import os
import mysql.connector
from openai import OpenAI
import weaviate
from src.connection.weaviate_client import client
from weaviate.classes.query import MetadataQuery
from src.service.image_description_service import generate_description_from_url


# Load environment variables
weaviate_url = os.getenv("WEAVIATE_URL")
weaviate_api_key = os.getenv("WEAVIATE_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
llm = OpenAI(api_key=openai_api_key)

client_weaviate=client


def find_similar_pets_from_image(image_url: str):
    # Step 1: Generate text from image
    description = generate_description_from_url(image_url)

    # Step 2: Generate embedding from that description
    embed_resp = llm.embeddings.create(
        model="text-embedding-3-small",
        input=description
    )
    vector = embed_resp.data[0].embedding

    # Step 3: Query Weaviate for similarity
    collection = client.collections.get("ImageDescription")
    response = collection.query.near_vector(
        near_vector=vector,
        limit=50,
        return_metadata=MetadataQuery(distance=True)
    )

    # Step 4: Convert distance to similarity %
    matches = []
    for obj in response.objects:
        distance = obj.metadata.distance
        similarity_percentage = ((2 - distance) / 4) * 100
        matches.append({
            "properties": obj.properties.get("image_id"),
            "similarity_percentage": similarity_percentage
        })

    return matches
