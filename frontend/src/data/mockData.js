export const coursesMock = [
  {
    id: "estructura-datos",
    name: "Estructura de datos",
    teacher: "Profesor asignado",
    description: "Curso inicial para el prototipo UTutor.",
    status: "Disponible",
  },
];

export const foldersMock = [
  {
    id: "general",
    name: "General",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ejercicios",
    name: "Ejercicios",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "evaluaciones",
    name: "Evaluaciones",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

export const conversationsMock = [
  {
    id: "consulta-1",
    title: "Consulta 1",
    folderId: "general",
  },
  {
    id: "consulta-2",
    title: "Consulta 2",
    folderId: "general",
  },
  {
    id: "consulta-3",
    title: "Consulta 3",
    folderId: "ejercicios",
  },
  {
    id: "consulta-4",
    title: "Consulta 4",
    folderId: "ejercicios",
  },
  {
    id: "consulta-5",
    title: "Consulta 5",
    folderId: "evaluaciones",
  },
  {
    id: "consulta-6",
    title: "Consulta 6",
    folderId: "evaluaciones",
  },
];

export const initialAssistantMessage = {
  id: 1,
  role: "assistant",
  text: "Hola, soy UTutor. Selecciona una carpeta o inicia una consulta para comenzar.",
  sources: [],
};