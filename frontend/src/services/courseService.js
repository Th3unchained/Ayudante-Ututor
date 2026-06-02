import { apiRequest } from "./apiClient";

export const courseService = {
  getStudentCourses: async () => {
    const data = await apiRequest("/students/me/courses");

    return data.courses.map((course) => ({
      id: course.id,
      name: course.name,
      code: course.code,
      description: course.description,
      status: course.is_active ? "Disponible" : "No disponible",
      isActive: course.is_active,
    }));
  },
};