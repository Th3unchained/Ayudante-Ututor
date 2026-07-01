import { useEffect, useState } from "react";
import tutorMascot from "../assets/tutor-mascot.png";

const MESSAGES = [
  "Revisando el material del curso...",
  "Buscando la mejor explicación para ti...",
  "Consultando los apuntes...",
  "Analizando tu pregunta con cuidado...",
  "Preparando una respuesta clara...",
  "Casi listo, un momento más...",
  "Leyendo los documentos del curso...",
  "Armando la respuesta perfecta para ti...",
];

export function TutorTypingIndicator() {
  const [messageIndex, setMessageIndex] = useState(
    () => Math.floor(Math.random() * MESSAGES.length)
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setMessageIndex((current) => (current + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end gap-3">
      <div className="relative shrink-0">
        <img
          src={tutorMascot}
          alt="Tutor UTutor"
          className="h-14 w-14 rounded-full border-2 border-teal-200 bg-white object-cover shadow-md"
        />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 shadow">
          <span className="h-2 w-2 animate-ping rounded-full bg-emerald-300 opacity-75" />
        </span>
      </div>

      <div className="max-w-xs rounded-2xl rounded-bl-sm border border-teal-100 bg-white px-5 py-4 shadow-md sm:max-w-sm">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-teal-600">
          UTutor está escribiendo
        </p>

        <p
          className={`text-sm text-slate-600 transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {MESSAGES[messageIndex]}
        </p>

        <div className="mt-3 flex gap-1.5">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-teal-400"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-teal-400"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-teal-400"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
