import React from "react";

export function DeleteConversationModal({
  isOpen,
  conversationTitle,
  isDeleting = false,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-red-100 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <span className="text-2xl">!</span>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
              Eliminar consulta
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              ¿Quieres eliminar esta consulta?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Esta acción eliminará la conversación y sus mensajes asociados. No
              podrás recuperarla después.
            </p>
          </div>
        </div>

        {conversationTitle && (
          <div className="mb-5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Consulta
            </p>
            <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-700">
              {conversationTitle}
            </p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}