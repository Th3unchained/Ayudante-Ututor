import React from "react";

export function MessageBubble({ message }) {
  const isUser = message.role === "user";

  const validSources = (message.sources ?? []).filter(
    (source) => source.documentName || source.sectionTitle || source.pageNumber
  );

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] rounded-[26px] border px-6 py-5 shadow-sm ${
          isUser
            ? "border-teal-300 bg-gradient-to-br from-cyan-50 to-teal-50 text-slate-900"
            : "border-slate-200 bg-white text-slate-900"
        }`}
      >
        <p
          className={`mb-3 text-xs font-bold uppercase tracking-wider ${
            isUser ? "text-teal-700" : "text-slate-400"
          }`}
        >
          {isUser ? "Consulta" : "Respuesta del tutor"}
        </p>

        <p className="whitespace-pre-wrap text-sm leading-7">{message.text}</p>

        {!isUser && validSources.length > 0 && (
          <div className="mt-5 rounded-2xl border border-teal-200 bg-gradient-to-r from-cyan-50 to-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Fuentes utilizadas
            </p>

            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              {validSources.map((source, index) => (
                <li
                  key={source.chunkId ?? `${source.documentId}-${index}`}
                  className="rounded-xl bg-white/80 px-3 py-2"
                >
                  <span className="font-semibold text-slate-800">
                    {source.documentName ?? "Documento del curso"}
                  </span>

                  {source.sectionTitle && (
                    <span> · {source.sectionTitle}</span>
                  )}

                  {source.pageNumber && <span> · pág. {source.pageNumber}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}