import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ✅ RESPONSE: Handle token expiry */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // ❌ DO NOT redirect for login failures
    if (status === 401 && !url.includes("/auth/login")) {
      console.warn("Token expired or unauthorized");

      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);



export default api;
