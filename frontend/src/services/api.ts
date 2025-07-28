// src/services/api.ts
import axios from 'axios';
import {
  Repository,
  CloneResponse,
  ProcessResponse,
  ChatResponse,
  RepositoryStatus,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message || 'An unexpected error occurred');
  }
);

export const repositoryApi = {
  // Clone a repository
  cloneRepository: async (url: string): Promise<CloneResponse> => {
    const response = await api.post('/repos/clone', { url });
    return response.data;
  },

  // Process repository for RAG
  processRepository: async (repoId: string): Promise<ProcessResponse> => {
    const response = await api.post(`/repos/${repoId}/process`);
    return response.data;
  },

  // Chat with repository
  chatWithRepository: async (repoId: string, question: string): Promise<ChatResponse> => {
    const response = await api.post(`/repos/${repoId}/chat`, { question });
    return response.data;
  },

  // Get repository status
  getRepositoryStatus: async (repoId: string): Promise<RepositoryStatus> => {
    const response = await api.get(`/repos/${repoId}/status`);
    return response.data;
  },

  // List all repositories
  listRepositories: async (): Promise<Repository[]> => {
    const response = await api.get('/repos');
    return response.data;
  },

  // Get repository info
  getRepositoryInfo: async (repoId: string): Promise<Repository> => {
    const response = await api.get(`/repos/${repoId}`);
    return response.data;
  },

  // Delete repository
  deleteRepository: async (repoId: string): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`/repos/${repoId}`);
    return response.data;
  },
};

export default api;
