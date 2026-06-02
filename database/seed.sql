-- ============================================================
-- UTutor Seed Data
-- Datos iniciales para PostgreSQL / Neon
-- Ejecutar después de init.sql
-- ============================================================

-- Contraseña demo para todos:
-- 123456
-- SHA-256:
-- 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86cf0c3f5d5a86aff3ca12020c923adc6c92

-- ============================================================
-- USERS
-- ============================================================

INSERT INTO users (
    email,
    password_hash,
    full_name,
    role,
    is_active
)
VALUES
(
    'admin@utem.cl',
    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    'Administrador Demo',
    'admin',
    TRUE
),
(
    'profesor@utem.cl',
    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    'Profesor Demo',
    'teacher',
    TRUE
),
(
    'estudiante@utem.cl',
    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    'Estudiante Demo',
    'student',
    TRUE
),
(
    'eleon@utem.cl',
    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    'Emily Leon',
    'student',
    TRUE
),
(
    'scortez@utem.cl',
    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    'Stefany Cortez',
    'student',
    TRUE
)
ON CONFLICT (email) DO UPDATE
SET
    password_hash = EXCLUDED.password_hash,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- ============================================================
-- COURSE
-- ============================================================

INSERT INTO courses (
    id,
    name,
    code,
    description,
    teacher_id,
    is_active
)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Estructura de datos',
    'INF-ED-001',
    'Asignatura orientada al estudio de estructuras de datos fundamentales como listas, pilas, colas, árboles, grafos, heaps y tablas hash.',
    (
        SELECT id
        FROM users
        WHERE email = 'profesor@utem.cl'
        LIMIT 1
    ),
    TRUE
)
ON CONFLICT (id) DO UPDATE
SET
    name = EXCLUDED.name,
    code = EXCLUDED.code,
    description = EXCLUDED.description,
    teacher_id = EXCLUDED.teacher_id,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- ============================================================
-- STUDENT COURSES
-- Inscripción de estudiantes a Estructura de datos
-- ============================================================

INSERT INTO student_courses (
    student_id,
    course_id
)
SELECT
    u.id,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
FROM users u
WHERE u.email IN (
    'estudiante@utem.cl',
    'eleon@utem.cl',
    'scortez@utem.cl'
)
ON CONFLICT (student_id, course_id) DO NOTHING;

-- ============================================================
-- FOLDERS
-- Carpetas iniciales para cada estudiante
-- ============================================================

INSERT INTO folders (
    student_id,
    course_id,
    name
)
SELECT
    u.id,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    folder_name
FROM users u
CROSS JOIN (
    VALUES
        ('General'),
        ('Ejercicios'),
        ('Evaluaciones')
) AS default_folders(folder_name)
WHERE u.email IN (
    'estudiante@utem.cl',
    'eleon@utem.cl',
    'scortez@utem.cl'
)
ON CONFLICT (student_id, course_id, name) DO NOTHING;

-- ============================================================
-- DEMO CONVERSATION
-- Conversación inicial solo para estudiante@utem.cl
-- ============================================================

INSERT INTO conversations (
    id,
    student_id,
    course_id,
    folder_id,
    title,
    is_saved
)
SELECT
    'c1111111-1111-1111-1111-111111111111',
    u.id,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    f.id,
    'Diferencia entre pila y cola',
    TRUE
FROM users u
LEFT JOIN folders f
    ON f.student_id = u.id
   AND f.course_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
   AND f.name = 'General'
WHERE u.email = 'estudiante@utem.cl'
LIMIT 1
ON CONFLICT (id) DO UPDATE
SET
    folder_id = EXCLUDED.folder_id,
    title = EXCLUDED.title,
    is_saved = EXCLUDED.is_saved,
    updated_at = NOW();

-- ============================================================
-- DEMO MESSAGES
-- ============================================================

INSERT INTO messages (
    id,
    conversation_id,
    role,
    content,
    model_name,
    tokens_input,
    tokens_output
)
VALUES
(
    '11111111-aaaa-1111-aaaa-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'user',
    '¿Cuál es la diferencia entre una pila y una cola?',
    NULL,
    0,
    0
),
(
    '22222222-aaaa-2222-aaaa-222222222222',
    'c1111111-1111-1111-1111-111111111111',
    'assistant',
    'Una pila usa el principio LIFO, es decir, el último elemento en entrar es el primero en salir. Una cola usa el principio FIFO, donde el primer elemento en entrar es el primero en salir.',
    'seed',
    0,
    0
)
ON CONFLICT (id) DO NOTHING;