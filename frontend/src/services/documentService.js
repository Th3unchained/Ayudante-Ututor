import { apiRequest } from "./apiClient";

export const documentService = {
  getCourseDocuments: async (courseId) => {
    const data = await apiRequest(`/courses/${courseId}/documents`);

    return data.documents.map((document) => ({
      id: document.id,
      fileName: document.file_name,
      filePath: document.file_path,
      mimeType: document.mime_type,
      status: document.status,
      createdAt: document.created_at,
      updatedAt: document.updated_at,
    }));
  },

  getDocumentDetail: async (documentId) => {
    const data = await apiRequest(`/documents/${documentId}`);

    return {
      id: data.id,
      courseId: data.course_id,
      courseName: data.course_name,
      fileName: data.file_name,
      filePath: data.file_path,
      mimeType: data.mime_type,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  getDocumentChunks: async (documentId) => {
    const data = await apiRequest(`/documents/${documentId}/chunks`);

    return data.chunks.map((chunk) => ({
      id: chunk.id,
      chunkIndex: chunk.chunk_index,
      content: chunk.content,
      pageNumber: chunk.page_number,
      sectionTitle: chunk.section_title,
      createdAt: chunk.created_at,
    }));
  },
};