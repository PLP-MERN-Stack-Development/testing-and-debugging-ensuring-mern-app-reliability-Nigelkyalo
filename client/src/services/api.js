import axios from 'axios';

const browserBaseUrl = typeof window !== 'undefined' ? window.__API_BASE_URL__ : undefined;
const inferredBase =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || process.env.VITE_API_URL;

const API_BASE_URL = browserBaseUrl || inferredBase || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

function getToken() {
  if (typeof window === 'undefined') {
    return process.env.TEST_TOKEN || '';
  }
  return localStorage.getItem('token') || '';
}

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  async fetchPosts(params = {}) {
    const response = await apiClient.get('/posts', { params });
    return response.data;
  },
  async createPost(payload) {
    const response = await apiClient.post('/posts', payload);
    return response.data;
  },
  async updatePost(id, updates) {
    const response = await apiClient.put(`/posts/${id}`, updates);
    return response.data;
  },
  async deletePost(id) {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  }
};

export default apiClient;

