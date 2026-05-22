import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = document.cookie.match(/token=([^;]+)/)?.[1];
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      document.cookie = "token=; path=/; max-age=0";
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const getServices = (params) => api.get("/services", { params });
export const getStats = () => api.get("/services/stats");
export const createService = (data) => api.post("/services", data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

export const getProjects = (params) => api.get("/projects", { params });
export const getProjectStats = () => api.get("/projects/stats");
export const createProject = (data) => api.post("/projects", data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getBackups = () => api.get("/backups");
export const createBackup = (data) => api.post("/backups", data);
export const updateBackup = (id, data) => api.put(`/backups/${id}`, data);
export const deleteBackup = (id) => api.delete(`/backups/${id}`);

export const getNotes = () => api.get("/notes");
export const createNote = (data) => api.post("/notes", data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
