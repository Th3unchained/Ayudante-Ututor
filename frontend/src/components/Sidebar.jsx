import React, { useMemo, useState } from "react";
import { DeleteConversationModal } from "./DeleteConversationModal";
import { DeleteFolderModal } from "./DeleteFolderModal";

export function Sidebar({
  course,
  folders = [],
  conversations = [],
  activeFolderId = null,
  activeConversationId = null,
  onSelectFolder,
  onSelectConversation,
  onCreateFolder,
  onDeleteFolder,
  onNewConversation,
  onDeleteConversation,
}) {
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderError, setFolderError] = useState("");
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);

  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isDeletingConversation, setIsDeletingConversation] = useState(false);

  const [folderToDelete, setFolderToDelete] = useState(null);
  const [isDeletingFolder, setIsDeletingFolder] = useState(false);

  const visibleConversations = useMemo(() => {
    if (!activeFolderId) {
      return conversations;
    }

    return conversations.filter(
      (conversation) => conversation.folderId === activeFolderId
    );
  }, [conversations, activeFolderId]);

  const activeFolderName = useMemo(() => {
    if (!activeFolderId) {
      return "Todas las consultas";
    }

    const folder = folders.find((item) => item.id === activeFolderId);

    return folder?.name ?? "Carpeta";
  }, [folders, activeFolderId]);

  const handleSubmitFolder = async (event) => {
    event.preventDefault();

    const cleanName = newFolderName.trim();

    if (!cleanName) {
      setFolderError("Ingresa un nombre para la carpeta.");
      return;
    }

    try {
      setIsCreatingFolder(true);
      setFolderError("");

      await onCreateFolder(cleanName);

      setNewFolderName("");
      setIsFolderFormOpen(false);
    } catch (error) {
      setFolderError(error.message || "No se pudo crear la carpeta.");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleToggleFolderForm = () => {
    setFolderError("");
    setNewFolderName("");
    setIsFolderFormOpen((currentValue) => !currentValue);
  };

  const handleRequestDeleteConversation = (conversation) => {
    setConversationToDelete(conversation);
  };

  const handleCancelDeleteConversation = () => {
    if (isDeletingConversation) {
      return;
    }

    setConversationToDelete(null);
  };

  const handleConfirmDeleteConversation = async () => {
    if (!conversationToDelete) {
      return;
    }

    try {
      setIsDeletingConversation(true);

      await onDeleteConversation(conversationToDelete.id);

      setConversationToDelete(null);
    } finally {
      setIsDeletingConversation(false);
    }
  };

  const handleRequestDeleteFolder = (folder) => {
    setFolderToDelete(folder);
  };

  const handleCancelDeleteFolder = () => {
    if (isDeletingFolder) {
      return;
    }

    setFolderToDelete(null);
  };

  const handleConfirmDeleteFolder = async () => {
    if (!folderToDelete) {
      return;
    }

    try {
      setIsDeletingFolder(true);

      await onDeleteFolder(folderToDelete.id);

      setFolderToDelete(null);
    } finally {
      setIsDeletingFolder(false);
    }
  };

  return (
    <>
      <aside className="flex h-full w-[320px] shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="shrink-0 border-b border-slate-100 px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-600">
                UTutor
              </p>
              <h2 className="mt-1 line-clamp-2 text-lg font-black text-slate-900">
                Panel de consultas
              </h2>
            </div>
          </div>

          {onNewConversation && (
            <button
              type="button"
              onClick={onNewConversation}
              className="mt-3 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-teal-500/25 transition hover:scale-[1.01]"
            >
              Nueva consulta
            </button>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 p-5">
          <section className="flex min-h-[330px] max-h-[55%] flex-col rounded-[30px] border border-teal-100 bg-gradient-to-br from-white to-teal-50/70 p-5 shadow-sm">
            <div className="shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1.5">
                    <h3 className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">
                      Carpetas
                    </h3>
                  </div>

                  <p className="mt-2 text-xs font-medium text-slate-400">
                    Organiza tus consultas por tema.
                  </p>
                </div>

                {onCreateFolder && (
                  <button
                    type="button"
                    onClick={handleToggleFolderForm}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg font-black shadow-sm transition ${
                      isFolderFormOpen
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-teal-500 text-white hover:bg-teal-600"
                    }`}
                    title={
                      isFolderFormOpen ? "Cancelar creación" : "Crear carpeta"
                    }
                  >
                    {isFolderFormOpen ? "×" : "+"}
                  </button>
                )}
              </div>

              {onCreateFolder && isFolderFormOpen && (
                <form
                  onSubmit={handleSubmitFolder}
                  className="mt-4 shrink-0 space-y-2 rounded-3xl border border-teal-100 bg-white p-3 shadow-sm"
                >
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(event) => setNewFolderName(event.target.value)}
                    placeholder="Nombre de carpeta"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
                    autoFocus
                  />

                  {folderError && (
                    <p className="text-xs font-semibold text-red-500">
                      {folderError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isCreatingFolder}
                    className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCreatingFolder ? "Creando..." : "Guardar carpeta"}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => onSelectFolder?.(null)}
                  className={`w-full rounded-2xl px-4 py-3.5 text-left text-sm font-bold transition ${
                    activeFolderId === null
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20"
                      : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                  }`}
                >
                  Todas las consultas
                </button>

                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className={`group flex items-center gap-2 rounded-2xl transition ${
                      activeFolderId === folder.id
                        ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20"
                        : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectFolder?.(folder.id)}
                      className="min-w-0 flex-1 px-4 py-3.5 text-left text-sm font-bold"
                    >
                      <span className="line-clamp-1">{folder.name}</span>
                    </button>

                    {onDeleteFolder && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRequestDeleteFolder(folder);
                        }}
                        className={`mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 ${
                          activeFolderId === folder.id
                            ? "text-white/80 hover:bg-white/20 hover:text-white"
                            : "text-slate-400 hover:bg-red-50 hover:text-red-500"
                        }`}
                        title="Eliminar carpeta"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex min-h-0 flex-1 flex-col rounded-[30px] border border-cyan-100 bg-gradient-to-br from-white to-cyan-50/70 p-5 shadow-sm">
            <div className="shrink-0">
              <div className="inline-flex items-center rounded-full bg-cyan-100 px-3 py-1.5">
                <h3 className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">
                  Consultas
                </h3>
              </div>

              <p className="mt-2 text-xs font-semibold text-slate-500">
                {activeFolderName}
              </p>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
              {visibleConversations.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-7 text-center shadow-sm">
                  <p className="text-sm font-bold text-slate-500">
                    No hay consultas en esta sección.
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Crea una nueva consulta para comenzar.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleConversations.map((conversation) => {
                    const isActive = activeConversationId === conversation.id;

                    return (
                      <div
                        key={conversation.id}
                        className={`group flex items-center gap-3 rounded-2xl border px-4 py-4 transition ${
                          isActive
                            ? "border-teal-200 bg-teal-50 shadow-sm"
                            : "border-transparent bg-white shadow-sm hover:bg-slate-100"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            onSelectConversation?.(conversation.id)
                          }
                          className="min-w-0 flex-1 text-left"
                        >
                          <p
                            className={`line-clamp-2 text-sm font-bold leading-5 ${
                              isActive ? "text-teal-800" : "text-slate-700"
                            }`}
                          >
                            {conversation.title || "Nueva consulta"}
                          </p>

                          {conversation.folderName && (
                            <p className="mt-1.5 line-clamp-1 text-xs font-semibold text-slate-400">
                              {conversation.folderName}
                            </p>
                          )}
                        </button>

                        {onDeleteConversation && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleRequestDeleteConversation(conversation);
                            }}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 opacity-100 transition hover:bg-red-50 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                            title="Eliminar consulta"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </aside>

      <DeleteConversationModal
        isOpen={Boolean(conversationToDelete)}
        conversationTitle={conversationToDelete?.title}
        isDeleting={isDeletingConversation}
        onCancel={handleCancelDeleteConversation}
        onConfirm={handleConfirmDeleteConversation}
      />

      <DeleteFolderModal
        isOpen={Boolean(folderToDelete)}
        folderName={folderToDelete?.name}
        isDeleting={isDeletingFolder}
        onCancel={handleCancelDeleteFolder}
        onConfirm={handleConfirmDeleteFolder}
      />
    </>
  );
}