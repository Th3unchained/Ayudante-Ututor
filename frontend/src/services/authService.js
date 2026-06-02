import {
  apiRequest,
  removeAccessToken,
  setAccessToken,
} from "./apiClient";

export const authService = {
  login: async ({ email, password }) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    setAccessToken(data.access_token);

    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.full_name,
      role: data.user.role,
      isActive: data.user.is_active,
      token: data.access_token,
    };
  },

  getMe: async () => {
    const data = await apiRequest("/auth/me");

    return {
      id: data.id,
      email: data.email,
      name: data.full_name,
      role: data.role,
      isActive: data.is_active,
    };
  },

  logout: async () => {
    removeAccessToken();
    return true;
  },
};