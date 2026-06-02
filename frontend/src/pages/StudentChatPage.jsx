import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { ChatInput } from "../components/ChatInput";
import { MessageBubble } from "../components/MessageBubble";
import { SaveConversationModal } from "../components/SaveConversationModal";
import { folderService } from "../services/folderService";
import { conversationService } from "../services/conversationService";
import { messageService } from "../services/messageService";
import { chatService } from "../services/chatService";

const initialAssistantMessage = {
  id: "initial-message",
  role: "assistant",
  text: "Hola, soy UTutor. Selecciona una consulta existente o crea una nueva para comenzar.",
  sources: [],
};

export function StudentChatPage({ selectedCourse, onLogout, onBackToCourses }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([initialAssistantMessage]);
  const [isSending, setIsSending] = useState(false);

  const [folders, setFolders] = useState([]);
  const [activeFolderId, setActiveFolderId] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const courseId = selectedCourse?.id;

  useEffect(() => {
    if (!courseId) return;

    const loadInitialData = async () => {
      try {
        setErrorMessage("");
        setSaveMessage("");

        const [loadedFolders, loadedConversations] = await Promise.all([
          folderService.getFolders(courseId),
          conversationService.getCourseConversations(courseId),
        ]);

        setFolders(loadedFolders);
        setConversations(loadedConversations);

        if (loadedFolders.length > 0) {
          setActiveFolderId(loadedFolders[0].id);
        } else {
          setActiveFolderId(null);
        }

        setActiveConversationId(null);
        setMessages([initialAssistantMessage]);
        setInput("");
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    loadInitialData();
  }, [courseId]);

  const handleCreateFolder = async (name) => {
    try {
      setErrorMessage("");
      setSaveMessage("");

      const newFolder = await folderService.createFolder({
        courseId,
        name,
      });

      setFolders((currentFolders) => [...currentFolders, newFolder]);
      setActiveFolderId(newFolder.id);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSelectFolder = (folderId) => {
    setActiveFolderId(folderId);
  };

  const handleSelectConversation = async (conversationId) => {
    try {
      setErrorMessage("");
      setSaveMessage("");
      setActiveConversationId(conversationId);

      const loadedMessages = await messageService.getMessages(conversationId);

      setMessages(
        loadedMessages.length > 0 ? loadedMessages : [initialAssistantMessage]
      );
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleNewConversation = async () => {
    try {
      setErrorMessage("");
      setSaveMessage("");

      const newConversation = await conversationService.createConversation({
        courseId,
        title: `Nueva consulta ${conversations.length + 1}`,
        folderId: activeFolderId,
        isSaved: true,
      });

      setConversations((currentConversations) => [
        newConversation,
        ...currentConversations,
      ]);

      setActiveConversationId(newConversation.id);

      setMessages([
        {
          id: "new-conversation-message",
          role: "assistant",
          text: "Nueva consulta creada. Escribe tu pregunta para comenzar.",
          sources: [],
        },
      ]);

      setInput("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleOpenSaveModal = () => {
    setSaveMessage("");
    setErrorMessage("");
    setIsSaveModalOpen(true);
  };

  const handleSaveConversation = async (folderId) => {
    try {
      setErrorMessage("");

      let conversationId = activeConversationId;

      if (!conversationId) {
        const newConversation = await conversationService.createConversation({
          courseId,
          title: "Consulta guardada",
          folderId,
          isSaved: true,
        });

        setConversations((currentConversations) => [
          newConversation,
          ...currentConversations,
        ]);

        setActiveConversationId(newConversation.id);
        conversationId = newConversation.id;
      } else {
        const updatedConversation = await conversationService.updateConversation({
          conversationId,
          folderId,
          isSaved: true,
        });

        setConversations((currentConversations) =>
          currentConversations.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  folderId: updatedConversation.folderId,
                  folderName: updatedConversation.folderName,
                  isSaved: updatedConversation.isSaved,
                  updatedAt: updatedConversation.updatedAt,
                }
              : conversation
          )
        );
      }

      setActiveFolderId(folderId);
      setIsSaveModalOpen(false);
      setSaveMessage("Consulta guardada correctamente.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar esta consulta? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSaveMessage("");

      await conversationService.deleteConversation(conversationId);

      setConversations((currentConversations) =>
        currentConversations.filter(
          (conversation) => conversation.id !== conversationId
        )
      );

      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setMessages([initialAssistantMessage]);
        setInput("");
      }

      setSaveMessage("Consulta eliminada correctamente.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

const handleSend = async () => {
  const question = input.trim();

  if (!question || isSending || !courseId) {
    return;
  }

  try {
    setIsSending(true);
    setErrorMessage("");
    setSaveMessage("");

    setInput("");

    const response = await chatService.askTutor({
      courseId,
      question,
      conversationId: activeConversationId,
      folderId: activeFolderId,
    });

    if (response.conversation.wasCreated) {
      setConversations((currentConversations) => [
        {
          id: response.conversation.id,
          title: response.conversation.title,
          folderId: response.conversation.folderId,
          isSaved: response.conversation.isSaved,
          createdAt: response.conversation.createdAt,
          updatedAt: response.conversation.updatedAt,
        },
        ...currentConversations,
      ]);

      setActiveConversationId(response.conversation.id);
    }

    setMessages((currentMessages) => [
      ...currentMessages.filter(
        (message) =>
          message.id !== "initial-message" &&
          message.id !== "new-conversation-message"
      ),
      response.userMessage,
      response.assistantMessage,
    ]);
  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    setIsSending(false);
  }
};

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-cyan-100 via-teal-50 to-emerald-100 p-3">
      <div className="relative h-full w-full overflow-visible rounded-[28px] border border-teal-300 bg-white/75 shadow-2xl shadow-teal-200/60 backdrop-blur-md">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="absolute right-[-90px] top-20 h-80 w-80 rounded-full bg-emerald-300/40 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 rounded-full bg-teal-300/30 blur-3xl" />

        <div className="relative z-10 flex h-full min-h-0 flex-col">
          <Header
            courseName={selectedCourse?.name}
            onLogout={onLogout}
            onBackToCourses={onBackToCourses}
          />

          <div className="flex min-h-0 flex-1">
            <Sidebar
              folders={folders}
              activeFolderId={activeFolderId}
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectFolder={handleSelectFolder}
              onCreateFolder={handleCreateFolder}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={handleDeleteConversation}
              onNewConversation={handleNewConversation}
            />

            <section className="flex min-w-0 flex-1 flex-col">
              <div className="shrink-0 border-b border-teal-200 bg-white/70 px-8 py-5 backdrop-blur">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Tutor IA activo
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-teal-950">
                      {selectedCourse?.name ?? "Asignatura"}
                    </h1>

                    <p className="mt-1 text-sm text-slate-600">
                      Realiza consultas, revisa respuestas y organiza tus
                      conversaciones.
                    </p>

                    {saveMessage && (
                      <p className="mt-2 text-sm font-semibold text-emerald-700">
                        {saveMessage}
                      </p>
                    )}

                    {errorMessage && (
                      <p className="mt-2 text-sm font-semibold text-red-600">
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleOpenSaveModal}
                      className="rounded-2xl border border-teal-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-teal-800 shadow-sm transition hover:border-teal-400 hover:bg-teal-50"
                    >
                      Guardar consulta
                    </button>

                    <button
                      type="button"
                      className="rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-300/30 transition hover:scale-[1.01]"
                    >
                      Modelo IA
                    </button>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 p-6">
                <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-teal-200 bg-white/90 shadow-xl shadow-teal-100/60 backdrop-blur">
                  <div className="shrink-0 border-b border-teal-100 bg-gradient-to-r from-cyan-50 to-emerald-50 px-7 py-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-teal-950">
                          Conversación
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Los mensajes ya se guardan en PostgreSQL.
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        Sesión activa
                      </span>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-8 py-8">
                    <div className="mx-auto flex max-w-5xl flex-col gap-7 pb-8">
                      {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                      ))}

                      {isSending && (
                        <div className="flex justify-start">
                          <div className="rounded-2xl border border-teal-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
                            Generando respuesta simulada...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    disabled={isSending}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {isSaveModalOpen && (
        <SaveConversationModal
          folders={folders}
          defaultFolderId={activeFolderId}
          onCancel={() => setIsSaveModalOpen(false)}
          onSave={handleSaveConversation}
        />
      )}
    </main>
  );
}