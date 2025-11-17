// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------ AUTENTICAÇÃO ------------------

export async function login(credentials) {
  const response = await api.post("/login", credentials);
  return response.data;
}

export async function register(data) {
  const response = await api.post("/register", data);
  return response.data;
}

// ------------------ FILMES ------------------

export async function getMovies() {
  const response = await api.get("/filmes");
  return response.data;
}

export async function getMovieById(id) {
  const response = await api.get(`/filmes/${id}`);
  return response.data;
}

export async function addMovie(data) {
  const response = await api.post("/filmes", data);
  return response.data;
}

export async function updateMovie(id, data) {
  const response = await api.put(`/filmes/${id}`, data);
  return response.data;
}

export async function deleteMovie(id) {
  const response = await api.delete(`/filmes/${id}`);
  return response.data;
}

export async function approveMovie(id) {
  const response = await api.post(`/filmes/${id}/aprovar`);
  return response.data;
}

export default api;
