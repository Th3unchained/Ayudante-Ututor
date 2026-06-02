import { apiRequest } from "./apiClient";

export const messageService = {
  getMessages: async (conversationId) => {
    const data = await apiRequest(`/conversations/${conversationId}/messages`);

    return data.messages.map((message) => ({
      id: message.id,
      conversationId: message.conversation_id,
      role: message.role,
      text: message.content,
      modelName: message.model_name,
      tokensInput: message.tokens_input,
      tokensOutput: message.tokens_output,
      createdAt: message.created_at,
      sources: (message.sources ?? []).map((source) => ({
        documentId: source.document_id,
        chunkId: source.chunk_id,
        documentName: source.document_name,
        pageNumber: source.page_number,
        sectionTitle: source.section_title,
        })),
    }));
  },

  createMessage: async ({
    conversationId,
    role,
    content,
    modelName = null,
    tokensInput = 0,
    tokensOutput = 0,
  }) => {
    const data = await apiRequest(`/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({
        role,
        content,
        model_name: modelName,
        tokens_input: tokensInput,
        tokens_output: tokensOutput,
      }),
    });

    return {
      id: data.id,
      conversationId: data.conversation_id,
      role: data.role,
      text: data.content,
      modelName: data.model_name,
      tokensInput: data.tokens_input,
      tokensOutput: data.tokens_output,
      createdAt: data.created_at,
      sources: [],
    };
  },
};