import { apiRequest } from "./apiClient";

export const folderService = {
  getFolders: async (courseId) => {
    const data = await apiRequest(`/courses/${courseId}/folders`);

    return data.folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      createdAt: folder.created_at,
      updatedAt: folder.updated_at,
    }));
  },

  createFolder: async ({ courseId, name }) => {
    const data = await apiRequest(`/courses/${courseId}/folders`, {
      method: "POST",
      body: JSON.stringify({
        name,
      }),
    });

    return {
      id: data.id,
      name: data.name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },
};