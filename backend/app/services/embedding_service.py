import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(encoding="utf-8")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_EMBEDDING_MODEL = os.getenv("GEMINI_EMBEDDING_MODEL", "gemini-embedding-2")
GEMINI_EMBEDDING_DIMENSIONS = int(os.getenv("GEMINI_EMBEDDING_DIMENSIONS", "768"))

if not GEMINI_API_KEY:
    raise ValueError("Falta GEMINI_API_KEY en el archivo .env")

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_embedding(text: str) -> list[float]:
    clean_text = text.strip()

    if not clean_text:
        raise ValueError("No se puede generar embedding de texto vacío.")

    response = client.models.embed_content(
        model=GEMINI_EMBEDDING_MODEL,
        contents=clean_text,
        config=types.EmbedContentConfig(
            output_dimensionality=GEMINI_EMBEDDING_DIMENSIONS,
        ),
    )

    return response.embeddings[0].values