import os
import mysql.connector
from openai import OpenAI
import weaviate
from src.connection.weaviate_client import client
from weaviate.classes.query import MetadataQuery

# Load environment variables
weaviate_url = os.getenv("WEAVIATE_URL")
weaviate_api_key = os.getenv("WEAVIATE_API_KEY")
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
llm = OpenAI(api_key=openai_api_key)

client_weaviate=client

def find_similar_pets(description: str):
    # 1. Generate embedding for the input description
    embed_resp = llm.embeddings.create(
        model="text-embedding-3-small",  # Use the correct embedding model
        input=description
    )
    vector = embed_resp.data[0].embedding


    jeopardy = client.collections.get("ImageDescription")
    response = jeopardy.query.near_vector(
        near_vector=vector, # your query vector goes here
        limit=50,
        return_metadata=MetadataQuery(distance=True)
    )
    matches=[]
    

    for o in response.objects:
        distance = o.metadata.distance
        # Transform distance into similarity percentage
        # Assume distance is between -2 and 2 (adjust accordingly if needed)
        similarity_percentage = ((2 - distance) / 4) * 100
        matches.append({"properties": o.properties.get("image_id"), "similarity_percentage": similarity_percentage})

        
    # 6. Return the top 3 matches
    return matches
