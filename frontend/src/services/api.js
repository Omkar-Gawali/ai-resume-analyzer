import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 300000, // 5 minutes global timeout
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem("resumeUser");
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const uploadResume = (form) =>
  API.post("/resume/upload", form, {
    timeout: 300000,
  });
export const getMyResumes = () => API.get("/resume");
export const getResumeById = (id) => API.get(`/resume/${id}`);
export const deleteResume = (id) => API.delete(`/resume/${id}`);
