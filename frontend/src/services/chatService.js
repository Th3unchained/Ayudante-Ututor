import { apiRequest } from "./apiClient";

function mapSource(source) {
  return {
    documentId: source.document_id,
    chunkId: source.chunk_id,
    documentName: source.document_name,
    pageNumber: source.page_number,
    sectionTitle: source.section_title,
  };
}

export const chatService = {
  askTutor: async ({
    courseId,
    question,
    conversationId = null,
    folderId = null,
  }) => {
    const data = await apiRequest("/chat/ask", {
      method: "POST",
      body: JSON.stringify({
        course_id: courseId,
        question,
        conversation_id: conversationId,
        folder_id: folderId,
      }),
    });

    return {
      conversation: {
        id: data.conversation.id,
        title: data.conversation.title,
        folderId: data.conversation.folder_id,
        isSaved: data.conversation.is_saved,
        createdAt: data.conversation.created_at,
        updatedAt: data.conversation.updated_at,
        wasCreated: data.conversation.was_created,
      },
      userMessage: {
        id: data.user_message.id,
        role: data.user_message.role,
        text: data.user_message.content,
        createdAt: data.user_message.created_at,
        sources: [],
      },
      assistantMessage: {
        id: data.assistant_message.id,
        role: data.assistant_message.role,
        text: data.assistant_message.content,
        modelName: data.assistant_message.model_name,
        createdAt: data.assistant_message.created_at,
        sources: (data.assistant_message.sources ?? []).map(mapSource),
      },
    };
  },
};