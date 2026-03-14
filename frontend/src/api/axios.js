import axios from "axios";

// Use environment variable for API base URL, fallback to /api for development
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// If it's a full URL (starts with http), append /api if not already there
if (API_BASE_URL.startsWith("http") && !API_BASE_URL.endsWith("/api")) {
  API_BASE_URL = API_BASE_URL + "/api";
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add Groq API key if available
  const apiKey = localStorage.getItem("groqApiKey");
  if (apiKey) {
    config.headers["X-Groq-API-Key"] = apiKey;
  }
  
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect to login for actual 401 auth errors, not for API key validation errors (403)
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
