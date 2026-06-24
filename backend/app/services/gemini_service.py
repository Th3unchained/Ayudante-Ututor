import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(encoding="utf-8")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

GEMINI_TEMPERATURE = float(os.getenv("GEMINI_TEMPERATURE", "0.4"))
GEMINI_TOP_P = float(os.getenv("GEMINI_TOP_P", "0.9"))
GEMINI_MAX_OUTPUT_TOKENS = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", "1500"))

if not GEMINI_API_KEY:
    raise ValueError("Falta GEMINI_API_KEY en el archivo .env")

client = genai.Client(api_key=GEMINI_API_KEY)


def _build_safety_settings():
    """Construye los Safety Settings nativos de Gemini (primera capa de
    guardrails). Se aplican de forma defensiva: si la versión instalada del
    SDK no reconoce estos parámetros, se ignoran y el sistema sigue
    funcionando igual con las capas de guardrail adicionales (reglas + juez LLM).
    """

    try:
        threshold = types.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE

        return [
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold=threshold,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold=threshold,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold=threshold,
            ),
            types.SafetySetting(
                category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=threshold,
            ),
        ]
    except Exception:
        return None


SAFETY_SETTINGS = _build_safety_settings()

SYSTEM_INSTRUCTION = """
Eres UTutor, un tutor académico para estudiantes universitarios.

Tu objetivo es ayudar al estudiante a comprender contenidos de la asignatura seleccionada.
Debes responder de forma clara, ordenada, breve cuando corresponda y con estilo académico cercano.

Reglas generales:
1. Responde siempre en español.
2. Mantén un tono claro, cercano y académico.
3. Enfócate en la asignatura seleccionada.
4. Usa el contexto entregado si es útil.
5. No inventes fuentes, documentos ni contenidos del curso.
6. Si el contexto no contiene información suficiente, dilo de forma transparente.
7. Si la pregunta está fuera de la asignatura, acláralo con respeto.
8. Si el estudiante pide resolver un ejercicio, primero orienta el razonamiento pero no entregues la respuesta.
9. No dejes frases cortadas ni listas incompletas.
10. Evita respuestas excesivamente largas.
11. No uses Markdown complejo, tablas ni títulos con símbolos innecesarios.
12. Usa saltos de línea, subtítulos simples y listas breves para mejorar la lectura.

Formato recomendado de respuesta:
- Si la pregunta es conceptual:
  Resumen breve
  Explicación
  Ejemplo breve
  Cierre

- Si la pregunta es un ejercicio:
  Análisis del problema
  Paso a paso
  Cierre

- Si la pregunta está fuera del contexto o fuera de la asignatura:
  Respuesta breve
  Cierre

Estilo visual:
- Usa subtítulos cortos.
- Usa listas con guiones cuando ayuden.
- Evita párrafos largos.
- No saludes en cada respuesta.
- No digas “he revisado el material” de forma repetitiva.
- No repitas demasiadas veces el nombre de la asignatura.
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
Asignatura:
{course_name}

Contexto disponible del material del curso:
{context_text}

Pregunta del estudiante:
{question}

Instrucciones para esta respuesta:
- Responde como tutor académico.
- Usa solamente el contexto si este permite responder.
- Si el contexto no alcanza, dilo claramente.
- Si la pregunta no corresponde a la asignatura, responde de forma breve y cierra.
- Entrega una respuesta ordenada y estética.
- Usa subtítulos simples.
- Usa listas breves si ayudan.
- Evita responder como un ensayo largo.
- No inventes fuentes ni documentos.
- No termines con frases cortadas.
"""

    generation_config_kwargs = dict(
        system_instruction=SYSTEM_INSTRUCTION,
        temperature=GEMINI_TEMPERATURE,
        top_p=GEMINI_TOP_P,
        max_output_tokens=GEMINI_MAX_OUTPUT_TOKENS,
        response_mime_type="text/plain",
    )

    if SAFETY_SETTINGS:
        generation_config_kwargs["safety_settings"] = SAFETY_SETTINGS

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(**generation_config_kwargs),
        )
    except TypeError:
        # Compatibilidad con versiones del SDK que no aceptan safety_settings
        # en este punto: se reintenta sin esa capa nativa, manteniendo las
        # demás capas de guardrail (reglas + juez LLM) intactas.
        generation_config_kwargs.pop("safety_settings", None)

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(**generation_config_kwargs),
        )

    try:
        answer = response.text
    except Exception:
        # La respuesta fue bloqueada por los Safety Settings nativos de
        # Gemini (primera capa de guardrail) u otro motivo similar.
        answer = None

    if not answer:
        return "No pude generar una respuesta en este momento. Intenta reformular tu consulta."

    clean_answer = answer.strip()

    if clean_answer.endswith((":", "es", "son", "de", "una", "un", "el", "la", "los", "las")):
        clean_answer += (
            "\n\nLa respuesta pudo haberse generado de forma incompleta. "
            "Intenta reformular la consulta o pedir una explicación más específica."
        )

    return clean_answer