import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("ss_token") || sessionStorage.getItem("ss_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (error) => {
    const requestUrl = error.config?.url || "";
    if (
      error.response?.status === 401 &&
      !requestUrl.endsWith("/login") &&
      requestUrl !== "/me"
    ) {
      localStorage.removeItem("ss_token");
      localStorage.removeItem("ss_user");
      sessionStorage.removeItem("ss_token");
      sessionStorage.removeItem("ss_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
export default api;
