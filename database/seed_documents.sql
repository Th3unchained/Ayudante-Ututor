-- ============================================================
-- UTutor Seed Documents - Material real Estructura de Datos
-- Generado para carga interna en Neon/PostgreSQL
-- Ejecutar después de init.sql y seed.sql
-- ============================================================

-- Elimina documento de prueba anterior, si existe
DELETE FROM message_sources WHERE document_id = 'd2222222-2222-2222-2222-222222222222';
DELETE FROM document_chunks WHERE document_id = 'd2222222-2222-2222-2222-222222222222';
DELETE FROM documents WHERE id = 'd2222222-2222-2222-2222-222222222222';

-- Documentos reales
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
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    NULL,
    'Clase_arbol_heap.pdf',
    'documents/estructura-datos/Clase_arbol_heap.pdf',
    'application/pdf',
    'processed'
)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    file_name = EXCLUDED.file_name,
    file_path = EXCLUDED.file_path,
    mime_type = EXCLUDED.mime_type,
    status = EXCLUDED.status,
    updated_at = NOW();

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
    '6c5bd247-81e6-50f1-bca8-f112ce72173f',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    NULL,
    'Clase_Colas.pdf',
    'documents/estructura-datos/Clase_Colas.pdf',
    'application/pdf',
    'processed'
)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    file_name = EXCLUDED.file_name,
    file_path = EXCLUDED.file_path,
    mime_type = EXCLUDED.mime_type,
    status = EXCLUDED.status,
    updated_at = NOW();

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
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    NULL,
    'Clase_Recursividad_2022.pptx',
    'documents/estructura-datos/Clase_Recursividad_2022.pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'processed'
)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    file_name = EXCLUDED.file_name,
    file_path = EXCLUDED.file_path,
    mime_type = EXCLUDED.mime_type,
    status = EXCLUDED.status,
    updated_at = NOW();

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
    'db509e11-6fb0-5d15-aa02-d2600ae2b0bc',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    NULL,
    'Clase18_04_22_polimorfismo.pdf',
    'documents/estructura-datos/Clase18_04_22_polimorfismo.pdf',
    'application/pdf',
    'processed'
)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    file_name = EXCLUDED.file_name,
    file_path = EXCLUDED.file_path,
    mime_type = EXCLUDED.mime_type,
    status = EXCLUDED.status,
    updated_at = NOW();

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
    '26047938-11ba-55ce-9d91-0e586d520c4b',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    NULL,
    'arbol_binario.txt',
    'documents/estructura-datos/arbol_binario.txt',
    'text/plain',
    'processed'
)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    file_name = EXCLUDED.file_name,
    file_path = EXCLUDED.file_path,
    mime_type = EXCLUDED.mime_type,
    status = EXCLUDED.status,
    updated_at = NOW();

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
    '49f455c8-62ec-5829-99e9-ffe10a7edf72',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    NULL,
    'archivo_vector.txt',
    'documents/estructura-datos/archivo_vector.txt',
    'text/plain',
    'processed'
)
ON CONFLICT (id) DO UPDATE SET
    course_id = EXCLUDED.course_id,
    file_name = EXCLUDED.file_name,
    file_path = EXCLUDED.file_path,
    mime_type = EXCLUDED.mime_type,
    status = EXCLUDED.status,
    updated_at = NOW();

-- Chunks reales extraídos de los documentos
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
VALUES (
    '3ee5fecf-9ca5-55a4-b5f0-da31813f32eb',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    1,
    'ESTRUCTURA ÁRBOL
❑ Los árboles, a diferencia de las listas, son una 
estructura de datos no lineal, similar a una 
estructura de tipo jerárquica. 
❑ Los árboles son estructuras de datos empleadas en 
informática, tanto para resolver problemas de 
hardware como de software, como por ejemplo en 
árboles de directorios. De igual manera cumplen 
un papel importante en aplicaciones para la toma 
de decisiones, como es el caso de un árbol de 
decisiones.
❑ También se emplean en programas para analizar 
circuitos eléctricos y para representar la estructura 
de fórmulas matemáticas, así como para organizar 
la información de bases de datos, para 
representar la estructura sintáctica de un 
programa fuente en compiladores y para la toma 
de decisiones.',
    2,
    'Página 2',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '63cf7d23-6612-5b5e-852d-503c7edeafa1',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    2,
    'ESTRUCTURA ÁRBOL
❑ Un árbol que no tiene ningún
nodo se llama árbol vacío o
nulo.
❑ Un árbol que no está vacío
consta de un nodo raíz y
potencialmente muchos niveles
de nodos adicionales que
forman una jerarquía.
❑ Los árboles se caracterizan por
disponer sus nodos en forma
jerárquica y no en forma lineal.
❑ Un árbol es una estructura de datos compuesta de un conjunto finito de
datos denominados nodos y de un conjunto finito de líneas dirigidas,
denominadas ramas, que conectan los nodos.',
    3,
    'Página 3',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'a63d3949-d948-598a-8642-f66e82d64d21',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    3,
    'UN ÁRBOL TIENE
GRADO – ALTURA – PROFUNDIDAD – NIVEL
❑Grado: Corresponde al número de hijos que tiene el árbol, en el
nodo con más hijos.
❑Altura: La altura es la cantidad de niveles.
❑Profundidad: Se define como la longitud del camino (único) que
comienza en la raíz y termina en el nodo. También se denomina nivel.
❑Nivel: Se define para cada elemento del árbol, como la distancia a
la raíz medida en nodos. El nivel de la raíz siempre será cero y el de
sus hijos uno y así sucesivamente.',
    4,
    'Página 4',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'd52d076f-51cf-5878-a3c2-24153787437b',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    4,
    'ÁRBOL BINARIO
Es un conjunto finito de elementos, denominados nodos y un conjunto 
finito de líneas dirigidas, denominadas ramas, que conectan los nodos.
Un árbol binario es un árbol en el que ningún nodo puede tener más 
de dos subárboles. 
En un árbol binario cada nodo puede tener cero, uno o dos hijos 
(subárboles). 
Se conoce el nodo de la izquierda como hijo izquierdo y el nodo de 
la derecha como hijo derecho.
Su estructura se organiza formando jerarquías: PADRES e HIJOS. 
Los elementos de un árbol se llaman NODOS. 
Si un nodo A tiene un enlace con un nodo B, entonces, A es el padre y 
B es el hijo.
• A es Padre.
• B y C son hijos 
de A.
• B es Padre.
• D y E hijos de B.
• F hijo de C.
Qué es un árbol binario?',
    6,
    'Página 6',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '37b4f51e-1ef0-5bf0-8bb7-b366484e1f52',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    5,
    'ÁRBOL BINARIO
❑ A es Padre. Los nodos B y C son hijos 
de A. El nodo F es hijo de C.
❑ B es Padre. Los nodos D y E son sus 
hijos. D y E son hermanos.
❑ D, E y F son hojas.
A
B C
D E F
❑ Los hijos de un mismo padre se llaman:
hermanos.
❑ Todos los nodos tienen al menos un
padre, menos la raíz.
❑ Si los elementos no tienen hijos se llaman
hojas.
❑ Un subárbol de un árbol, es cualquier
nodo del árbol junto con todos sus
descendientes.
Subárbol
Nodo Hoja
Nodos Hermanos
Nodo Padre
Nodo Raíz
Nodo Padre',
    9,
    'Página 9',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'fb0425e2-f709-5896-9346-45cde80f41a1',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    6,
    'RECORRIDO PRE -ORDEN
Recorrer un árbol en preorden consiste en primer lugar, examinar el dato del nodo
raíz, posteriormente se recorrer el subárbol izquierdo en preorden y finalmente se
recorre el subárbol derecho en preorden. Esto significa que para cada subárbol se
debe conservar el recorrido en preorden, primero la raíz, luego la parte izquierda y
posteriormente la parte derecha.
Recorrido en pre-orden: 
10 5 3 1 4 7 9 15 14 17 16 20 
10
5 15
3 7 14 17
1 4 9 16 20',
    12,
    'Página 12',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'b1349247-3fb3-5fed-aae9-bf9598787691',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    7,
    'EJEMPLO POST -ORDEN
Recorrer un árbol en Postorden consiste en primer lugar en recorrer el subárbol
izquierdo en Postorden, luego serecorre el subárbol derecho en Postorden y
finalmente se visita el nodo raíz. Esto significa que para cada subárbol se debe
conservar el recorrido en Postorden, es decir, primero se visita la parte izquierda,
luego la parte derecha y por último la raíz.
Recorrido en post-orden: 
3 7 5 11 15 12 10 
10
5 12
3 7 11 15',
    13,
    'Página 13',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '21ab31ab-cbaf-5ee2-83b5-27d19763f44d',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    8,
    'RECORRIDO INORDEN
Recorrer un árbol en Inorden consiste en primer lugar en recorrer el subárbol izquierdo
en Inorden, luego se examina el dato del nodo raíz, y finalmente se recorre el
subárbol derecho en Inorden. Esto significa que para cada subárbol se debe conservar
el recorrido en Inorden, es decir, primero se visita la parte izquierda, luego la raíz y
posteriormente la parte derecha.
Recorrido en inorden: 
3 5 7 10 11 12 15 
10
5 12
3 7 11 15',
    14,
    'Página 14',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'b26d5258-c28f-5182-bfe7-53f828c65ad2',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    9,
    'RECORDEMOS 
QUÉ ES UN TDA
Un Tipo de Dato Abstracto (TDA) es un modelo 
constituido por un conjunto de objetos y una 
colección de operaciones realizables sobre él. 
Su representación como tipo concreto ha sido 
abstraída y a cuyos datos sólo se puede acceder 
a través de un conjunto de operaciones.
El TDA provee de una interfaz con la cual es 
posible realizar las operaciones permitidas, 
abstrayéndose de la manera en como estén 
implementadas dichas operaciones. Las 
operaciones básicas, por lo general, son 
Inserción, Eliminación, Búsqueda, Vaciado e 
Inicialización. 
Las operaciones en un TAD deben ser cerradas, 
es decir, sólo deben acceder a los datos a través 
de las operaciones.
Algunos ejemplos de TDA son las Pilas, Colas y 
Colas de Prioridad (Heap).
https://www.youtube.com/watch?v=Kcnp3e17Gq4',
    15,
    'Página 15',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'd297f8d1-c65c-5764-9b74-1525b2682158',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    10,
    'HEAP (MONTÍCULO)
PROPIEDADES
• El HEAP es el caso 
más notable de cola 
de prioridad y se 
define como un árbol 
binario con todos sus 
niveles completos 
excepto, 
generalmente, el 
último donde todos 
los nodos están 
ajustados a la 
izquierda. 
• Cada nodo en un 
heap tiene mayor 
prioridad que sus 
descendientes, de 
manera que el 
elemento de 
prioridad máxima se 
encuentra siempre en 
la raíz del árbol.',
    16,
    'Página 16',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'e6b39acb-a19e-574e-985d-df09ee7a81fb',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    11,
    'HEAP
En un HEAP los elementos se ingresan por nivel, de izquierda 
a derecha. Después de un ingreso se debe reparar la 
eventual alteración de la propiedad de heap. Debido a la 
forma de organización del árbol, se puede usar un arreglo 
para representarlo. Basta con numerar los nodos 
consecutivamente por nivel, de arriba hacia abajo y de 
izquierda a derecha',
    19,
    'Página 19',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '7dd8165a-be60-5ebc-973d-f79b10a55962',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    12,
    'HEAP
La numeración por 
niveles (indicada 
bajo cada nodo) 
son los subíndices 
en donde cada 
elemento sería 
almacenado en el 
arreglo.',
    20,
    'Página 20',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '5952ea03-9bcc-509f-b572-62ddc62902bd',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    13,
    'HEAP
• El padre de un elemento v[i] es v[j], con j=i/2 
• Un elemento v[j] tiene hijos v[i] y v[i+1], con i= 2*j
SIMULADOR DE HEAP XD',
    21,
    'Página 21',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '5a093950-d691-5759-8606-fd5c24bc0aba',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    14,
    'COLA DE PRIORIDAD
▪ Es una cola cuyos elementos tienen asociada una
prioridad que determina el orden en que son
extraídos.
▪ Una prioridad es un número entre 1 y p, donde 1 es
la prioridad más alta.
▪ En una cola de prioridad, se puede agregar un
elemento de cierta prioridad, o bien, extraer el
elemento de máxima prioridad.',
    22,
    'Página 22',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '59481c21-fe0a-501f-879e-da23ec6bd19a',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    15,
    'COLA DE PRIORIDAD
Definición: priority_queue<Type, Container, Functional>
▪ Type es el tipo de datos.
▪ Container es el tipo de contenedor. El contenedor debe ser un contenedor
implementado con una matriz, como vector, deque, etc., pero no una lista. El
valor predeterminado en STL es vector.
▪ Functional es la forma de comparación. Cuando necesite usar un tipo de
datos personalizado, debe pasar estos tres parámetros. Cuando use tipos
de datos básicos, solo necesita pasar el tipo de datos.
Ejemplo:
❖ priority_queue <int,vector<int>,greater<int> > q; // Cola ascendente
❖ priority_queue <int,vector<int>,less<int> >q; // Cola descendente',
    24,
    'Página 24',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '5374e02d-76f4-5111-87a9-9baef0d35c8b',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    16,
    'COLA DE PRIORIDAD
Operación básica:
❖empty () devuelve verdadero si la cola está vacía
❖pop () eliminar el elemento superior
❖push () agrega un elemento
❖size () devuelve el número de elementos en la cola de
prioridad
❖top () devuelve el elemento superior de la cola de
prioridad',
    25,
    'Página 25',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'b35ff640-0f90-500e-90b6-d69fc40f56e5',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    17,
    'EJEMPLOS HEAP
1
• Heap / cola de prioridad básico:
• https://onlinegdb.com/Oe5QmMv2T
2
• Heap / cola de prioridad ascendente:
• https://onlinegdb.com/GWOobMzCv
3
• Utilizando Heap para ordenar información de una clase Paciente
• https://onlinegdb.com/XhlozBlgb
4
• Clase Heap(string) implementada con vectores
• https://onlinegdb.com/vPXDjcu_H',
    26,
    'Página 26',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'c2497069-dd84-5185-bc46-406e6d4fc9e3',
    '97407932-6c8d-54b3-9878-ff24c31d67d7',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    18,
    'EJEMPLOS COMBINADOS
❑ Colas utilizando clase. Cola creada a partir de la librería Queue.
https://onlinegdb.com/C-s9-33P2
❑ Validación de datos de entrada
https://onlinegdb.com/sWGeJJKop
❑ Stack: verificación de una formula
https://onlinegdb.com/SgR5_8_NP
❑ Heap, Colas y Stack utilizando clase Persona
https://onlinegdb.com/ZGPqjIfG',
    27,
    'Página 27',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'fdaa0292-157e-551a-beb1-853f91ed6b4d',
    '6c5bd247-81e6-50f1-bca8-f112ce72173f',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    1,
    'COLAS
Una cola es un 
TAD de 
comportamiento 
FIFO, con las 
operaciones 
crear, agregar, 
extraer y vacía 
En una cola sólo 
se puede acceder 
a uno de 
extremos, 
denominado rear, 
para agregar un 
elemento y al 
otro, denominado 
front, para 
extraer un 
elemento
Primero en entrar, primero en salir (FIFO)',
    2,
    'Página 2',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'd7ad63c6-0c7d-5f14-a7b4-468b4ea6e8d2',
    '6c5bd247-81e6-50f1-bca8-f112ce72173f',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    2,
    'COLAS
Una cola es una lista con restricciones. En ésta, las inserciones ocurren en un 
extremo y los descartes en el otro. Si se conoce el máximo número de 
componentes que tendrán que esperar en la cola, se suele implementar en base a 
arreglos.
Una analogía que se utiliza como ejemplo es la “Fila de un Banco” donde el 
primero en entrar es el primero en salir. 
Una Cola requiere dos variables o índices: 
▪ Cola: que es un índice a donde insertar o encolar(AGREGAR).
▪ Cabeza(frente): es un índice al elemento a descartar o desencolar (EXTRAER)',
    3,
    'Página 3',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'f95ecab3-89f7-52bc-b8c7-5cf08c204107',
    '6c5bd247-81e6-50f1-bca8-f112ce72173f',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    3,
    'COLAS
Operaciones:
1. push(dato): Significa que vamos a agregar un dato a la cola.. 
2. pop(): Significa que vamos a sacar un dato de la cola.
3. empty(): A través de esta instrucción podemos ver si se llegó al final de la cola. 
Devuelve True o False.
4. front(): Muestra el primer nodo o dato de la cola.
Ejemplos de uso de colas:
• La aplicación más común de las colas es la organización de tareas de un ordenador. 
En general, los trabajos enviados a un ordenador son "encolados" por éste, para ir 
procesando secuencialmente todos los trabajos en el mismo orden en que se reciben.
• Cola en el Spooler de Impresión.
Las colas se utilizan en sistemas informáticos, transportes y operaciones de investigación 
(entre otros), dónde los objetos, personas o eventos son tomados como datos que se 
almacenan y se guardan mediante colas para su posterior procesamiento. Este tipo de 
estructura de datos abstracta se implementa en lenguajes orientados a objetos mediante 
clases, en forma de listas enlazadas.',
    4,
    'Página 4',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '075d1827-8eb3-5af9-94d1-8869c81e6d6a',
    '6c5bd247-81e6-50f1-bca8-f112ce72173f',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    4,
    'EJEMPLO COLA A TRAVÉS DE LISTA
Implementación por Lista
https://onlinegdb.com/xcWHeACJT
https://blog.martincruz.me/2012/10/colas-en-c.html',
    6,
    'Página 6',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'b2e2550e-9b9d-5edc-8d0c-05bb2bc872e6',
    '6c5bd247-81e6-50f1-bca8-f112ce72173f',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    5,
    'EJEMPLO BÁSICO DE 
STACK, COLA Y HEAP
https://onlinegdb.com/oxe2nItfQ
Material sobre Colas',
    10,
    'Página 10',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '281d8e8c-2d71-5994-b9c1-4e79ff229c07',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    1,
    'recursividad
¿En qué consiste la recursividad? 

– En el cuerpo de sentencias de la función se invoca a la propia función para resolver “una versión más pequeña” del problema original. 

– Habrá un caso (o varios) tan simple que pueda resolverse directamente sin necesidad de hacer otra llamada recursiva.
“Extracto del Material del Profesor David Castro Salinas”',
    3,
    'recursividad',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '161afd0a-d0cf-5df4-80a4-a1f8dbfe51aa',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    2,
    'Ejemplo factorial
5! =5*4!
 = 5*4*3!
 = 5*4*3*2!
 = 5*4*3*2*1
“Extracto del Material del Profesor David Castro Salinas”',
    4,
    'Ejemplo factorial',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'a61e2861-5ff2-552e-a924-3f7060b25f3d',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    3,
    'LA RECURSIVIDAD DEBE CUMPLIR con:
1.- CASO BASE: Es una salida NO RECURSIVA en que el problema funciona correctamente para ella. **Proceso que no efectúa cálculos recursivos 
2.- CASO GENERAL: Donde se hace necesaria la llamada a sí misma. **Proceso que continua realizado llamadas a si mismo, pero con un nuevo valor que se acerca a caso base. 
3.- CONDICIÓN DE TÉRMINO: Salida del proceso recursivo 
“Extracto del Material del Profesor David Castro Salinas”',
    5,
    'LA RECURSIVIDAD DEBE CUMPLIR con:',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '979eb977-caa5-5436-bf21-401d2a2480a3',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    4,
    'Estructura del Proceso Recursivo
¿Por dónde empiezo? 
1.- Obtener la definición exacta del problema. ¿Qué deseo resolver? 
2.- Determinar el tamaño completo y parámetros iniciales ¿Qué variables de entrada usaré? 
3.- Resolver los casos triviales (CASOS-BASE o no recursivos) ¿Esto no requiere recursividad? ¿Condición de Salida? 
4.- Resolver el CASO-GENERAL en términos de un caso más pequeño. Llamada recursiva
“Extracto del Material del Profesor David Castro Salinas”',
    6,
    'Estructura del Proceso Recursivo',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '6e281d92-e49a-5726-bb8e-f2b0af366df1',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    5,
    'EJEMPLO POTENCIA xn:
Cuando el exponente es un número natural N, éste indica las veces que aparece X multiplicando por sí mismo, siendo X un número cualquiera. Donde X es la base y N el exponente.

“Extracto del Material del Profesor David Castro Salinas”',
    7,
    'EJEMPLO POTENCIA xn:',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '32f526e0-893a-5b42-90b8-cd3c41d7c458',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    6,
    'Ventajas y desventajas de la recursividad
“Extracto del Material del Profesor David Castro Salinas”',
    9,
    'Ventajas y desventajas de la recursividad',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '3298c1bd-6ea4-5389-a3bc-1f924f91fa14',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    7,
    'Errores más comunes
– Tendencia a usar estructuras iterativas en lugar de estructuras selectivas. El algoritmo no se detiene. 

– Ausencia de ramas donde el algoritmo trate el caso-base (salida no recursiva). 

– Solución al problema incorrecta.
“Extracto del Material del Profesor David Castro Salinas”',
    10,
    'Errores más comunes',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '5894eedf-d691-5d59-b9bf-575df6521794',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    8,
    'ejercicio
Tomando los ejemplos anteriores, crear un programa que presente un menú donde el usuario pueda seleccionar si desea calcular el factorial o la potencia de un número, hasta que elija la opción Salir. En los casos solicitados se debe desarrollar una función recursiva por cada uno y mostrar los resultados en pantalla.',
    11,
    'ejercicio',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '6f0f9c21-4322-57e3-ba82-14a33a01f536',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    9,
    'MATRICES Y ESTRUCTURAS------------trabajo en parejas
En la comunidad de Pelotillehue se está realizando un censo de edificios y contrataron a su empresa para que desarrolle un programa bajo los siguientes requerimientos:
Se tiene un edificio de n pisos y de m departamentos (por piso), se registra la información de los residentes del edificio. Por cada departamento se almacena: apellidos de la familia, cantidad de personas que residen, conjunto de edades de los residentes (máximo 10), número de depto., número de piso. Ejemplo: Información del departamento ubicado en el piso 5 y donde hay 2 departamentos. 
EJERCICIO 1:
Se necesita disponer de una función para ingresar los datos del edificio.
Otra función, denominada MasPoblado(E, n, m), que retorna el número del piso del edificio E (de nxm) que contiene más residentes. 
Una función MayorPromedio(E, n, m), que retorna el mayor promedio de edad contenido en el edificio E. 
La comunidad de Pelotillehue, además requiere que el programa esté documentado.',
    13,
    'MATRICES Y ESTRUCTURAS',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'd343bc99-2c57-5bda-be01-17e501e355d2',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    10,
    'archivos------------trabajo en parejas
La compañía TresR, ha contratado a su empresa para que desarrolle un programa que le permita:

Leer archivos CSV.
Crear archivos CSV.
Agregar datos a un archivo CSV.
Este programa debe permitir al usuario elegir desde un menú, la opción a realizar hasta que el usuario elija la opción Salir.

Además su cliente ha solicitado que el programa esté documentado en cada sección, para que cualquier desarrollador lo pueda entender y mantener posteriormente.

EJERCICIO 2:',
    15,
    'archivos',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '5c0feb41-d085-5f73-81b5-456c1fefd02b',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    11,
    'recursividad------------trabajo en parejas
El colegio Tres Pinos, ha contratada a su empresa para desarrollar los siguientes requerimientos que permitirán enseñar a sus alumn@s tópicos matemáticos. Estos requerimientos deben ser desarrollados con funciones recursivas, que deben entregar autodocumentadas.

Se requiere un menú, que permita al alumno(a) seleccionar una de las siguientes alternativas.

Se requiere que calcule la suma de los n primeros números naturales. El alumno(a) ingresa el n.

Que imprima la lista de números naturales comprendidos entre dos valores a y d dados por el alumno(a). 

Que devuelva la cantidad de dígitos de un número entero ingresado por el alumno(a). 

Que calcule x^y mediante multiplicaciones sucesivas, siendo x e y dos números enteros. Donde x e y son ingresados por el alumno(a).

Que calcule x*y mediante sumas sucesivas, siendo x e y dos números enteros. 
EJERCICIO 3:',
    17,
    'recursividad',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '33501620-8f71-571e-b510-f792e7407318',
    '3303d74f-383b-5e27-b280-d55db7a6e32e',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    12,
    'Memoria estática v/s dinámica
Investigar sobre memoria estática y dinámica para próxima clase',
    19,
    'Memoria estática v/s dinámica',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'd1281db6-d78d-5ea7-b278-a439945bf21e',
    'db509e11-6fb0-5d15-aa02-d2600ae2b0bc',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    1,
    'PROGRAMACIÓN 
ORIENTADA A OBJETOS
La POO es una forma 
más cercana a como 
expresaríamos las 
cosas en la vida real.
Lo que busca es que la 
programación sea más 
entendible para las 
personas.
Se debe pensar en 
términos de objetos, 
propiedades, métodos, 
etc.
“Extracto del Material del Profesor David Castro Salinas”',
    2,
    'Página 2',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'eb016f3d-2b9e-56ff-a522-01b26e9cbf94',
    'db509e11-6fb0-5d15-aa02-d2600ae2b0bc',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    2,
    'DEFINICIÓN DE 
POLIMORFISMO
Polimorfismo es la habilidad 
de los objetos de diferentes 
clases que están relacionados, 
mediante la herencia, para 
responder en forma diferente 
al mismo mensaje (es decir, a 
la llamada de función 
miembro). El mismo mensaje 
que se envía a muchos tipos 
de objetos diferentes toma 
"muchas formas", y de ahí 
viene el término polimorfismo.
Cualidad que tienen los 
objetos a actuar de diferente 
manera ante el mismo 
mensaje.
El polimorfismo se implementa 
por medio de 
funciones virtual.',
    4,
    'Página 4',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'eae36d5b-fb24-5ccb-9d57-e36cb4080aab',
    'db509e11-6fb0-5d15-aa02-d2600ae2b0bc',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    3,
    'CÓMO ES EL CÓDIGO?
class Persona
{
private: // Atributos y encapsulamiento
string nombre;
int edad;
public: // Constructor y Método
Persona(string,int); //Constructor
virtual void mostrar(); //Método mostrar
};
Persona::Persona (string n, int e)
{nombre=n; edad=e;}
void mostrar()
{cout<<“Mi nombre es “<<nombre<<“ y mi edad es “<<edad 
<<endl;}
Definición de la clase Persona:
Al colocar la 
palabra 
reservada 
VIRTUAL, 
estamos 
señalando que 
este método 
tendrá la función 
de polimorfismo. 
La palabra 
VIRTUAL sólo va 
en la clase Padre.
1',
    6,
    'Página 6',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '2c8eb75a-456e-56a3-b3c3-b502df63807b',
    'db509e11-6fb0-5d15-aa02-d2600ae2b0bc',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    4,
    'CÓMO ES EL CÓDIGO?
class Alumno : public Persona
{
private: // Atributos y encapsulamiento
string asignatura;
float nota;
public: // Constructor y Método
Alumno(string, int, string, float); //Constructor
void mostrar(); //Método mostrar o visualizar
};
Alumno::Alumno(string n, int e, string a, float c) : Persona(n,e)
{asignatura=a; nota=c;}
void Alumno :: mostrar()
{Persona::mostrar(); cout<<“Mi asignatura es “<<asignatura<<“ y mi nota es ” 
<<nota<<endl;}
Definición de la clase hija Alumno:
2',
    7,
    'Página 7',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '6948ec22-fa34-5297-8878-2174d9abc4fb',
    'db509e11-6fb0-5d15-aa02-d2600ae2b0bc',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    5,
    'CÓMO ES EL CÓDIGO?
class Profesor : public Persona
{
private: // Atributos y encapsulamiento
string materia;
public: // Constructor y Método
Profesor(string, int, string); //Constructor
void mostrar(); //Método mostrar
};
Profesor::Profesor(string n, int e, string m) : Persona(n,e)
{materia=m;}
void Profesor :: mostrar()
{Persona::mostrar(); 
cout<<“Mi especialidad es la materia de ”<<materia<<endl;}
Definición de la clase hija Profesor:
3',
    8,
    'Página 8',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '0e17c855-3453-5813-ba9f-69d9016485fc',
    'db509e11-6fb0-5d15-aa02-d2600ae2b0bc',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    6,
    'Definidas las clases, se debe usar punteros
4
int main() 
{
Alumno a("Jorge",21,"Química",6.1);
a.mostrar();
Alumno b("Alicia",17,"Física",6.7);
b.mostrar();
Profesor p("Máximo",67,"Algebra");
p.mostrar();
return 0;
}
Programa 
principal:
CÓMO ES EL CÓDIGO?',
    9,
    'Página 9',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '0625355b-4ea8-567b-93f3-651b8ab7b0d5',
    '26047938-11ba-55ce-9d91-0e586d520c4b',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    1,
    'https://hhmosquera.wordpress.com/arbolesbinarios/
https://medium.com/@matematicasdiscretaslibro/cap%C3%ADtulo-12-teoria-de-arboles-binarios-f731baf470c0

ABB
https://www.utm.mx/~rruiz/cursos/ED/material/ABB.pdf
https://www6.uniovi.es/usr/cesar/Uned/EDA/Apuntes/TAD_apUM_04.pdf

https://tecpro-digital.com/ejemplos-de-arboles-binarios-en-c/

AVL
https://www.youtube.com/watch?v=r72a5MxQaJQ',
    NULL,
    'arbol_binario',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    'a492a91e-5714-53dc-b4c6-66aefd697c3b',
    '49f455c8-62ec-5829-99e9-ffe10a7edf72',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    1,
    '#include <iostream>
#include <stdlib.h>
#include <fstream>
#include <vector>
#include <sstream>
using namespace std;
struct vent
{
int anio;
int mes;
int dia;
int stock;
int ventas;
};
//función lleva a vector
vector<string> split(string lineaASeparar, char delimitador) 
{
 vector<string> vector_interno; //#include <vector>
 stringstream linea(lineaASeparar); // #include <sstream> 
 string parteDelString;
 while(getline(linea, parteDelString, delimitador))
 vector_interno.push_back(parteDelString);
 return vector_interno;
}
void leer(string nombreArchivo, vent v[], int &indice)
 {
 ifstream archivo;
 archivo.open(nombreArchivo.c_str(), ios::in);
 if(archivo.is_open())
 {
 string linea;
 bool primeraLinea =true;
 while (getline(archivo, linea))
 {
 //saltamos la primera línea que contiene los nombres de las columnas
 if(primeraLinea) 
 {
 primeraLinea = false;
 continue;
 }
 vector<string> items= split(linea, '';'');',
    NULL,
    'archivo_vector',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

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
VALUES (
    '1b5c70fe-c262-5b00-a4fe-74fc9249e6fe',
    '49f455c8-62ec-5829-99e9-ffe10a7edf72',
    (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1),
    2,
    'v[indice].anio = atoi(items[0].c_str());
 cout<<v[indice].anio<<" - ";
 v[indice].mes = atoi(items[1].c_str());
 cout<<v[indice].mes<<" - ";
 v[indice].dia = atoi(items[2].c_str());
 cout<<v[indice].dia<<" - ";
 v[indice].stock = atoi(items[3].c_str());
 cout<<v[indice].stock<<" - ";
 v[indice].ventas = atoi(items[4].c_str());
 cout<<v[indice].ventas<<endl;
 
 indice++;
 }
 cout <<"***Se han procesado "<< indice <<" registros"<<endl;
 } 
 else
 {
 cout << "Error en la apertura del archivo "+nombreArchivo;
 }
 }
void calcula(string nombreArchivoResumen, vent v[], int indice){
 
 if(indice <= 0)
 return; 
 
 ofstream archivo;
 archivo.open(nombreArchivoResumen, ios::out);
 if(archivo.is_open()) {
 //generamos cabecera
 archivo << "anio;mes;dia;stok_fin;" << endl;
 for(int i = 0; i< indice; i++) {
 archivo << v[i].anio << '';'';
 archivo << v[i].mes << '';'';
 archivo << v[i].dia << '';'';
 archivo << v[i].stock - v[i].ventas << '';'' << endl;
 }
 archivo.close();
 cout <<"archivo creado con éxito"<<endl;
 } else {
 cout <<"error";
 }
}
#define MAX_REG 100
int main() 
{
 vent vec_ven[MAX_REG];
 int indice = 0;
 string Archivo="pru.txt";
 leer(Archivo, vec_ven, indice);
 calcula("disponible.txt", vec_ven, indice);
 return 0;
}',
    NULL,
    'archivo_vector',
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    content = EXCLUDED.content,
    page_number = EXCLUDED.page_number,
    section_title = EXCLUDED.section_title,
    embedding_json = EXCLUDED.embedding_json;

-- Verificación
SELECT
    d.file_name,
    COUNT(dc.id) AS chunks
FROM documents d
LEFT JOIN document_chunks dc ON dc.document_id = d.id
WHERE d.course_id = (SELECT id FROM courses WHERE name = 'Estructura de datos' LIMIT 1)
GROUP BY d.file_name
ORDER BY d.file_name;