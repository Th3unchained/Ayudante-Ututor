import os
from dotenv import load_dotenv
from google import genai

load_dotenv(encoding="utf-8")

api_key = os.getenv("GEMINI_API_KEY")
model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if not api_key:
    raise ValueError("Falta GEMINI_API_KEY en el archivo .env")

client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model=model_name,
    contents="Responde solo con: Gemini funcionando",
)

print(response.text)