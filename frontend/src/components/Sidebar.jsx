import React, { useState } from "react";

export function Sidebar({
  folders,
  activeFolderId,
  conversations,
  activeConversationId,
  onSelectFolder,
  onCreateFolder,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
}) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState("");

  const activeFolder = folders.find((folder) => folder.id === activeFolderId);

  const filteredConversations = activeFolderId
    ? conversations.filter(
        (conversation) => conversation.folderId === activeFolderId
      )
    : conversations;

  const handleCreateFolder = () => {
    const name = folderName.trim();

    if (!name) return;

    onCreateFolder(name);
    setFolderName("");
    setIsCreatingFolder(false);
  };

  return (
    <aside className="hidden h-full w-72 shrink-0 border-r border-teal-200 bg-white/65 backdrop-blur lg:flex lg:flex-col">
      <div className="shrink-0 border-b border-teal-200 bg-gradient-to-r from-cyan-100 to-teal-100 px-5 py-5">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
          Espacio de trabajo
        </p>

        <h2 className="mt-2 truncate text-xl font-bold text-teal-950">
          {activeFolder ? activeFolder.name : "Consultas"}
        </h2>

        <button
          type="button"
          onClick={onNewConversation}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-300/30 transition hover:scale-[1.01]"
        >
          Nueva consulta
        </button>
      </div>

      <div className="shrink-0 border-b border-teal-200 p-4">
        <section className="rounded-3xl border border-teal-200 bg-white/85 shadow-lg shadow-teal-100/50">
          <div className="flex items-center justify-between border-b border-teal-100 px-4 py-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Carpetas
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Organización del curso
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreatingFolder((current) => !current)}
              className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100"
            >
              Añadir
            </button>
          </div>

          {isCreatingFolder && (
            <div className="border-b border-teal-100 bg-teal-50/60 p-3">
              <input
                type="text"
                value={folderName}
                onChange={(event) => setFolderName(event.target.value)}
                placeholder="Nombre de carpeta"
                className="h-9 w-full rounded-xl border border-teal-200 bg-white px-3 text-sm outline-none focus:border-teal-400"
              />

              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCreateFolder}
                  className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700"
                >
                  Crear
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setFolderName("");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto p-3">
            <div className="space-y-2">
              {folders.map((folder) => {
                const isActive = folder.id === activeFolderId;
                const count = conversations.filter(
                  (conversation) => conversation.folderId === folder.id
                ).length;

                return (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => onSelectFolder(folder.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm shadow-sm transition ${
                      isActive
                        ? "border-teal-400 bg-gradient-to-r from-cyan-50 to-emerald-50"
                        : "border-teal-100 bg-white hover:border-teal-300 hover:bg-teal-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-semibold text-slate-800">
                        {folder.name}
                      </span>

                      <span className="shrink-0 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-700">
                        {count}
                      </span>
                    </div>
                  </button>
                );
              })}

              {folders.length === 0 && (
                <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/40 px-4 py-6 text-center">
                  <p className="text-sm font-semibold text-teal-800">
                    Sin carpetas
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Crea una carpeta para organizar tus consultas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-1">
        <section className="flex h-full min-h-0 flex-col rounded-3xl border border-teal-200 bg-white/85 shadow-lg shadow-teal-100/50">
          <div className="shrink-0 border-b border-teal-100 px-4 py-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Historial de consultas
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {activeFolder
                ? `Consultas en ${activeFolder.name}`
                : "Todas las conversaciones"}
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {filteredConversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;

                return (
                  <div
                    key={conversation.id}
                    className={`group rounded-2xl border transition ${
                      isActive
                        ? "border-teal-300 bg-gradient-to-r from-cyan-50 to-emerald-50 shadow-md shadow-teal-100/60"
                        : "border-teal-100 bg-white hover:border-teal-300 hover:bg-teal-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectConversation(conversation.id)}
                      className="w-full px-4 py-3 text-left text-sm"
                    >
                      <p className="truncate font-semibold text-slate-800">
                        {conversation.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Consulta guardada
                      </p>
                    </button>

                    <div className="flex items-center justify-between border-t border-teal-100 px-4 py-2">
                      <span className="text-[11px] font-medium text-slate-400">
                        {conversation.folderName ?? "Sin carpeta"}
                      </span>

                      <button
                        type="button"
                        onClick={() => onDeleteConversation(conversation.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredConversations.length === 0 && (
                <div className="rounded-2xl border border-dashed border-teal-200 bg-teal-50/40 px-4 py-6 text-center">
                  <p className="text-sm font-semibold text-teal-800">
                    Sin consultas
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Esta carpeta aún no tiene conversaciones.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}