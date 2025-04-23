# connect_openai.py

import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment
api_key = os.getenv("OPENAI_API_KEY")

# Check if key exists
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables.")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)
