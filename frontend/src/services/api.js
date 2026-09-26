import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==============================
// Auth API
// ==============================

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
};

export const registerUser = async (fullName, email, password) => {
  const response = await api.post("/auth/register", {
    full_name: fullName,
    email,
    password,
  });
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// ==============================
// AI Chat API
// ==============================

export const askAI = async (message, history = []) => {
  const response = await api.post("/chatbot/", {
    message,
    history,
  });
  return response.data.response;
};

// ==============================
// Vision / Emotion API
// ==============================

export const getVisionStatus = async () => {
  const response = await api.get("/vision/status");
  return response.data;
};

export const detectEmotion = async (imageBase64) => {
  const response = await api.post("/vision/predict", { image: imageBase64 });
  return response.data;
};

// ==============================
// Profile, Progress & Report API
// ==============================

export const getProfile = async () => {
  const response = await api.get("/profile/");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/profile/", profileData);
  return response.data;
};

export const getProgress = async () => {
  const response = await api.get("/progress/");
  return response.data;
};

export const logProgressEvent = async (eventType, eventData = {}) => {
  const response = await api.post("/progress/event", { event_type: eventType, event_data: eventData });
  return response.data;
};

export const downloadPdfReport = async (days = 7) => {
  const response = await api.get(`/report/pdf?days=${days}`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Observational_Report_${days}d.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default api;