/**
 * API Service
 * Centralized API client for backend communication
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (future)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (clear token, redirect to login, etc.)
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

// Calendar API
export const calendarApi = {
  list: (params?: {
    start_date?: string;
    end_date?: string;
    category?: string;
    page?: number;
    page_size?: number;
  }) => api.get('/api/calendar/', { params }),
  
  get: (id: string) => api.get(`/api/calendar/${id}`),
  
  create: (data: any) => api.post('/api/calendar/', data),
  
  update: (id: string, data: any) => api.patch(`/api/calendar/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/calendar/${id}`),
  
  getToday: () => api.get('/api/calendar/today/'),
};

// Wrapper for consistent naming
export const calendarAPI = {
  getEvents: async () => {
    const response = await api.get('/api/calendar/?page_size=100');
    return response.data;
  },
  createEvent: async (event: any) => {
    const response = await api.post('/api/calendar/', event);
    return response.data;
  },
  updateEvent: async (id: string, event: any) => {
    const response = await api.patch(`/api/calendar/${id}`, event);
    return response.data;
  },
  deleteEvent: async (id: string) => {
    await api.delete(`/api/calendar/${id}`);
  },
};

// Todos API
export const todosApi = {
  list: (params?: {
    completed?: boolean;
    priority?: string;
    category?: string;
    page?: number;
    page_size?: number;
  }) => api.get('/api/todos/', { params }),
  
  get: (id: string) => api.get(`/api/todos/${id}`),
  
  create: (data: any) => api.post('/api/todos/', data),
  
  update: (id: string, data: any) => api.patch(`/api/todos/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/todos/${id}`),
  
  complete: (id: string) => api.post(`/api/todos/${id}/complete`),
  
  uncomplete: (id: string) => api.post(`/api/todos/${id}/uncomplete`),
  
  getStats: () => api.get('/api/todos/stats'),
};

// Shopping API
export const shoppingApi = {
  getOffers: (params?: {
    store?: string;
    category?: string;
    min_discount?: number;
    page?: number;
    page_size?: number;
  }) => api.get('/api/shopping/offers', { params }),
  
  scrapeOffers: (params?: {
    store?: string;
    use_mock?: boolean;
  }) => api.post('/api/shopping/scrape', null, { params }),
  
  getStats: () => api.get('/api/shopping/stats'),
};

// LLM API
export const llmApi = {
  getStatus: () => api.get('/api/llm/status'),
  
  listModels: () => api.get('/api/llm/models'),
  
  loadModel: (modelName: string) => api.post(`/api/llm/models/${modelName}/load`),
  
  unloadModel: (modelName: string) => api.post(`/api/llm/models/${modelName}/unload`),
  
  pullModel: (modelName: string) => api.post(`/api/llm/models/${modelName}/pull`),
  
  deleteModel: (modelName: string) => api.delete(`/api/llm/models/${modelName}`),
  
  getRunningModels: () => api.get('/api/llm/models/running'),
  
  generate: (data: {
    prompt: string;
    model?: string;
    system?: string;
  }) => api.post('/api/llm/generate', data),
  
  ensureDefault: () => api.post('/api/llm/ensure-default'),
  
  getRecommended: () => api.get('/api/llm/recommended'),
};

// Media API
export const mediaApi = {
  getStatus: () => api.get('/api/media/status'),
  
  // Plex
  getPlexContinueWatching: (limit?: number) => 
    api.get('/api/media/plex/continue-watching', { params: { limit } }),
  getPlexRecentlyAdded: (limit?: number) => 
    api.get('/api/media/plex/recently-added', { params: { limit } }),
  getPlexStats: () => api.get('/api/media/plex/stats'),
  
  // Calibre
  getCalibreCurrentlyReading: () => 
    api.get('/api/media/calibre/currently-reading'),
  getCalibreRecent: (limit?: number) => 
    api.get('/api/media/calibre/recent', { params: { limit } }),
  getCalibreStats: () => api.get('/api/media/calibre/stats'),
  searchCalibre: (query: string, limit?: number) => 
    api.get('/api/media/calibre/search', { params: { q: query, limit } }),
  
  // Immich
  getImmichRecentPhotos: () => api.get('/api/media/immich/recent-photos'),
  
  // Tapo
  getTapoCameras: () => api.get('/api/media/tapo/cameras'),
};

// Expenses API
export const expensesAPI = {
  getExpenses: async (params?: {
    category?: string;
    store?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get('/api/expenses/', { params });
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/api/expenses/stats');
    return response.data;
  },
  createExpense: async (expense: any) => {
    const response = await api.post('/api/expenses/', expense);
    return response.data;
  },
  updateExpense: async (id: string, expense: any) => {
    const response = await api.patch(`/api/expenses/${id}`, expense);
    return response.data;
  },
  deleteExpense: async (id: string) => {
    await api.delete(`/api/expenses/${id}`);
  },
};

// Health check
export const healthApi = {
  check: () => api.get('/health'),
};

export default api;

