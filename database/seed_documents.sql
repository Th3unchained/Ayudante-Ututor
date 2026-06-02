-- ============================================================
-- UTutor Seed Documents
-- Documentos cargados internamente
-- ============================================================

INSERT INTO documents (
    id,
    course_id,
    uploaded_by,
    file_name,
    file_path,
    mime_type,
    status
)
VALUES (
    'd2222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    NULL,
    'Guia_Estructura_Datos.pdf',
    'documents/estructura-datos/Guia_Estructura_Datos.pdf',
    'application/pdf',
    'processed'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO document_chunks (
    id,
    document_id,
    course_id,
    chunk_index,
    content,
    page_number,
    section_title,
    embedding_json
)
VALUES
(
    'e3333333-3333-3333-3333-333333333333',
    'd2222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    1,
    'Las estructuras de datos permiten organizar información de manera eficiente para facilitar operaciones como búsqueda, inserción, eliminación y recorrido.',
    1,
    'Introducción a estructuras de datos',
    NULL
),
(
    'e4444444-4444-4444-4444-444444444444',
    'd2222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    2,
    'Una pila es una estructura lineal basada en el principio LIFO, donde el último elemento ingresado es el primero en salir.',
    4,
    'Pilas',
    NULL
),
(
    'e5555555-5555-5555-5555-555555555555',
    'd2222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    3,
    'Una cola es una estructura lineal basada en el principio FIFO, donde el primer elemento ingresado es el primero en salir.',
    5,
    'Colas',
    NULL
)
ON CONFLICT (id) DO NOTHING;