import { apiRequest } from "./apiClient";

export const conversationService = {
  getCourseConversations: async (courseId) => {
    const data = await apiRequest(`/courses/${courseId}/conversations`);

    return data.conversations.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      folderId: conversation.folder_id,
      folderName: conversation.folder_name,
      isSaved: conversation.is_saved,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
    }));
  },

  createConversation: async ({
    courseId,
    title = "Nueva consulta",
    folderId = null,
    isSaved = true,
  }) => {
    const data = await apiRequest(`/courses/${courseId}/conversations`, {
      method: "POST",
      body: JSON.stringify({
        title,
        folder_id: folderId,
        is_saved: isSaved,
      }),
    });

    return {
      id: data.id,
      title: data.title,
      folderId: data.folder_id,
      folderName: data.folder_name ?? null,
      isSaved: data.is_saved,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  getConversationDetail: async (conversationId) => {
    const data = await apiRequest(`/conversations/${conversationId}`);

    return {
      id: data.id,
      title: data.title,
      courseId: data.course_id,
      courseName: data.course_name,
      folderId: data.folder_id,
      folderName: data.folder_name,
      isSaved: data.is_saved,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      messages: data.messages.map((message) => ({
        id: message.id,
        role: message.role,
        text: message.content,
        modelName: message.model_name,
        tokensInput: message.tokens_input,
        tokensOutput: message.tokens_output,
        createdAt: message.created_at,
        sources: message.sources ?? [],
      })),
    };
  },

  updateConversation: async ({
    conversationId,
    title = null,
    folderId = null,
    isSaved = null,
  }) => {
    const data = await apiRequest(`/conversations/${conversationId}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        folder_id: folderId,
        is_saved: isSaved,
      }),
    });

    return {
      id: data.id,
      title: data.title,
      folderId: data.folder_id,
      folderName: data.folder_name ?? null,
      isSaved: data.is_saved,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  deleteConversation: async (conversationId) => {
    const data = await apiRequest(`/conversations/${conversationId}`, {
      method: "DELETE",
    });

    return data;
  },
};