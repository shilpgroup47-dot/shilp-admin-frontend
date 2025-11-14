import axios from 'axios';
import { API_CONFIG } from '../config';

export interface ProjectTree {
  _id: string;
  no: number;
  year: number;
  title: string;
  location: string;
  image: string;
  imageMetadata: {
    uploadedAt: string;
    filename: string;
    originalName: string;
    size: number;
  };
  typeofproject: 'plot' | 'commercial' | 'residential';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTreeFilters {
  year?: number;
  typeofproject?: string;
  search?: string;
}

export interface ProjectTreeStats {
  totalYears: number;
  years: number[];
  typeBreakdown: Array<{
    _id: string;
    count: number;
  }>;
}

export interface ProjectTreeApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get all project trees with optional filters
export const getAllProjectTrees = async (filters?: ProjectTreeFilters): Promise<ProjectTreeApiResponse<ProjectTree[]>> => {
  const params = new URLSearchParams();
  
  if (filters?.year) params.append('year', filters.year.toString());
  if (filters?.typeofproject) params.append('typeofproject', filters.typeofproject);
  if (filters?.search) params.append('search', filters.search);

  const response = await apiClient.get(`/api/projecttree?${params.toString()}`);
  return response.data;
};

// Get a single project tree by ID
export const getProjectTreeById = async (id: string): Promise<ProjectTreeApiResponse<ProjectTree>> => {
  const response = await apiClient.get(`/api/projecttree/${id}`);
  return response.data;
};

// Create a new project tree
export const createProjectTree = async (formData: FormData): Promise<ProjectTreeApiResponse<ProjectTree>> => {
  const response = await apiClient.post('/api/projecttree', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update a project tree
export const updateProjectTree = async (id: string, formData: FormData): Promise<ProjectTreeApiResponse<ProjectTree>> => {
  const response = await apiClient.put(`/api/projecttree/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete a project tree
export const deleteProjectTree = async (id: string): Promise<ProjectTreeApiResponse<ProjectTree>> => {
  const response = await apiClient.delete(`/api/projecttree/${id}`);
  return response.data;
};

// Get statistics
export const getProjectTreeStatistics = async (): Promise<ProjectTreeApiResponse<ProjectTreeStats>> => {
  const response = await apiClient.get('/api/projecttree/statistics');
  return response.data;
};
