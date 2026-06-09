import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // send cookies (JWT)
  headers: { "Content-Type": "application/json" },
});

// ---- Request interceptor: attach token from localStorage as fallback ----
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Response interceptor: normalize errors ----
api.interceptors.response.use(
  (response) => response.data, // unwrap { success, data, message }
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    const status = error.response?.status;

    // Auto-logout on 401 (except on auth endpoints themselves)
    const url = error.config?.url || "";
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register");
    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      // Don't hard redirect — let AuthContext handle it
    }

    return Promise.reject({ message, status, raw: error });
  }
);

export default api;