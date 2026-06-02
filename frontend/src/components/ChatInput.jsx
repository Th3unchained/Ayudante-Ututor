import React from "react";

export function ChatInput({ value, onChange, onSend, disabled = false }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="shrink-0 border-t border-teal-100 bg-white/90 px-6 py-5">
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_130px] gap-4">
        <textarea
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu consulta sobre la asignatura..."
          className="min-h-[64px] max-h-40 resize-none rounded-2xl border border-teal-200 bg-teal-50/40 px-5 py-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100 disabled:bg-slate-100"
        />

        <button
          type="button"
          disabled={disabled || !value.trim()}
          onClick={onSend}
          className="rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-sm font-bold text-white shadow-lg shadow-teal-300/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none"
        >
          Enviar
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        UTutor es una herramienta de apoyo. Valida siempre tu razonamiento y las
        fuentes entregadas.
      </p>
    </div>
  );
}