import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(encoding="utf-8")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

GEMINI_TEMPERATURE = float(os.getenv("GEMINI_TEMPERATURE", "0.4"))
GEMINI_TOP_P = float(os.getenv("GEMINI_TOP_P", "0.9"))
GEMINI_MAX_OUTPUT_TOKENS = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", "700"))

if not GEMINI_API_KEY:
    raise ValueError("Falta GEMINI_API_KEY en el archivo .env")

client = genai.Client(api_key=GEMINI_API_KEY)


SYSTEM_INSTRUCTION = """
Eres UTutor, un tutor académico para estudiantes universitarios.

Tu objetivo es ayudar al estudiante a comprender, no simplemente darle respuestas finales.

Reglas de respuesta:
1. Responde en español.
2. Responde como un tutor academico.
3. usa el contexto si es util.
4. Si el contexto no alcanza, aclara que responderás con orientación general.
5. Entrega una respuesta completa, pero clara y ordenada.
6. Si el estudiante pide resolver un ejercicio, orienta el razonamiento antes de entregar la respuesta.
7. No inventes fuentes ni documentos.
8. Si el contexto entregado no contiene información suficiente, dilo de forma transparente.
9. Mantén respuestas ordenadas, con ejemplos breves cuando sea útil.
10. Enfócate en la asignatura seleccionada.
11. No cortes frases ni dejes listas incompletas.
"""


def build_context_text(context_chunks: list[dict]) -> str:
    if not context_chunks:
        return "No hay fragmentos de documentos disponibles para esta consulta."

    context_parts = []

    for index, chunk in enumerate(context_chunks, start=1):
        document_name = chunk.get("document_name", "Documento")
        section_title = chunk.get("section_title") or "Sin sección"
        page_number = chunk.get("page_number")
        content = chunk.get("content", "")

        context_parts.append(
            f"""
[Fuente {index}]
Documento: {document_name}
Sección: {section_title}
Página: {page_number if page_number else "No indicada"}
Contenido:
{content}
"""
        )

    return "\n".join(context_parts)


def generate_tutor_answer(
    question: str,
    course_name: str,
    context_chunks: list[dict] | None = None,
) -> str:
    context_chunks = context_chunks or []
    context_text = build_context_text(context_chunks)

    prompt = f"""
Asignatura: {course_name}

Contexto disponible del material del curso:
{context_text}

Pregunta del estudiante:
{question}

Instrucciones:
- Responde como tutor académico.
- Usa el contexto si es útil.
- Si el contexto no alcanza, aclara que responderás con orientación general.
- Evita respuestas excesivamente largas.
"""

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            temperature=GEMINI_TEMPERATURE,
            top_p=GEMINI_TOP_P,
            max_output_tokens=GEMINI_MAX_OUTPUT_TOKENS,
            response_mime_type="text/plain",
        ),
    )

    answer = response.text

    if not answer:
        return "No pude generar una respuesta en este momento. Intenta reformular tu consulta."

    return answer.strip()