-- ============================================================
-- UTutor Seed Data
-- Datos iniciales del sistema
-- ============================================================

UPDATE users
SET password_hash = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86cf0c3f5d5a86aff3ca12020c923adc6c92'
WHERE email IN (
    'estudiante@utem.cl',
    'profesor@utem.cl',
    'admin@utem.cl'
);

INSERT INTO users (
    email,
    password_hash,
    full_name,
    role,
    is_active
)
VALUES
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
ON CONFLICT (email) DO NOTHING;

INSERT INTO student_courses (
    student_id,
    course_id
)
SELECT
    u.id,
    c.id
FROM users u
CROSS JOIN courses c
WHERE u.email IN (
    'eleon@utem.cl',
    'scortez@utem.cl'
)
AND c.name = 'Estructura de datos'
ON CONFLICT (student_id, course_id) DO NOTHING;

INSERT INTO folders (
    student_id,
    course_id,
    name
)
SELECT
    u.id,
    c.id,
    folder_name
FROM users u
CROSS JOIN courses c
CROSS JOIN (
    VALUES
        ('General'),
        ('Ejercicios'),
        ('Evaluaciones')
) AS default_folders(folder_name)
WHERE u.email IN (
    'eleon@utem.cl',
    'scortez@utem.cl'
)
AND c.name = 'Estructura de datos'
ON CONFLICT (student_id, course_id, name) DO NOTHING;