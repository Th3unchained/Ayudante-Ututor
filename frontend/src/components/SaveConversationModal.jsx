import React, { useState } from "react";

export function SaveConversationModal({
  folders,
  defaultFolderId,
  onCancel,
  onSave,
}) {
  const [selectedFolderId, setSelectedFolderId] = useState(
    defaultFolderId ?? folders[0]?.id ?? ""
  );

  const handleSave = () => {
    if (!selectedFolderId) return;
    onSave(selectedFolderId);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-teal-200 bg-white p-6 shadow-2xl shadow-teal-900/20">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Guardar consulta
          </p>

          <h2 className="mt-2 text-2xl font-bold text-teal-950">
            Selecciona una carpeta
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Elige dónde quieres guardar esta conversación para encontrarla
            después en el historial.
          </p>
        </div>

        <div className="space-y-3">
          {folders.map((folder) => {
            const isSelected = folder.id === selectedFolderId;

            return (
              <button
                key={folder.id}
                type="button"
                onClick={() => setSelectedFolderId(folder.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? "border-teal-400 bg-gradient-to-r from-cyan-50 to-emerald-50 shadow-md shadow-teal-100"
                    : "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50"
                }`}
              >
                <p className="text-sm font-semibold text-slate-800">
                  {folder.name}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Guardar en esta carpeta
                </p>
              </button>
            );
          })}
        </div>

        {folders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/50 px-4 py-6 text-center">
            <p className="text-sm font-semibold text-teal-800">
              No hay carpetas disponibles
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Crea una carpeta antes de guardar la consulta.
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!selectedFolderId}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-300/30 disabled:cursor-not-allowed disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:shadow-none"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}