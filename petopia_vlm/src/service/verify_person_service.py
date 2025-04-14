import openai
import os
from src.connection.connect_llm import client

# Load OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def verify_person(image_path: str, name: str):
    try:
        # Call OpenAI API for processing the image and name
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Use the appropriate model for your use case
            messages=[
                {"role": "system", "content": f"You are an assistant that helps verify person identities only by names you will be given image of the cin and the name. fist convert this name {name} to arabic then compare it to the name which is الإسم in the image of the cin "},
                {"role": "user", 
                "content": [
                    { "type": "text", "text": f"Verify if the الإسم of the person in the image matches the name {name}. Answer 'yes' or 'no'."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_path}"
                        },
                    },
                ],}
            ],
            max_tokens=100,
            temperature=0.7
        )
        
        # Extract the response correctly using dot notation
        result = response.choices[0].message.content.strip()
    
        print(result)
        return result.lower() in ['yes', 'no']
    except Exception as e:
        print(f"Error in verification process: {e}")
        return None
