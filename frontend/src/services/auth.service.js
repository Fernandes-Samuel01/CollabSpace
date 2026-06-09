import api from "../api/axios.js";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  verifyEmail: (data) => api.post("/auth/verify-email", data),
  resendCode: (email) => api.post("/auth/resend-code", { email }),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};