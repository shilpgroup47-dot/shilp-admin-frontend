import axios from 'axios';
import { API_CONFIG } from '../config';

/**
 * Project API
 * Handles all project-related API calls
 */

// Create axios instance for project API
const projectApiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Add auth interceptor
projectApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Project {
  _id: string;
  projectTitle: string;
  slug: string;
  projectState: 'on-going' | 'completed';
  projectType: 'residential' | 'commercial' | 'plot';
  shortAddress: string;
  projectStatusPercentage: number;
  aboutUsDetail: {
    description1: string;
    description2: string;
    description3: string;
    description4: string;
    image: {
      url: string;
      alt: string;
    };
  };
  floorPlans: Array<{
    title: string;
    image: string;
    alt: string;
  }>;
  projectImages: Array<{
    image: string;
    alt: string;
  }>;
  amenities: Array<{
    title: string;
    svgOrImage: string;
    alt: string;
  }>;
  youtubeUrl: string;
  updatedImagesTitle: string;
  updatedImages: Array<{
    image: string;
    alt: string;
  }>;
  locationTitle: string;
  locationTitleText: string;
  locationArea: string;
  number1: string;
  number2: string;
  email1: string;
  email2: string;
  mapIframeUrl: string;
  cardImage: string;
  cardLocation: string;
  cardAreaFt: string;
  cardProjectType: 'residential' | 'commercial' | 'plot';
  cardHouse: 'Ready to Move' | 'Sample House Ready';
  reraNumber: string;
  brochure?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetProjectsResponse {
  success: boolean;
  message?: string;
  data?: {
    projects: Project[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data?: {
    projectId: string;
    projectTitle: string;
    slug: string;
  };
  errors?: Array<{
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
  }>;
}

/**
 * Get all projects with optional filtering by type
 * @param type - Filter by project type (residential, commercial, plot) - optional
 * @returns Promise with the API response
 */
export const getProjects = async (type?: 'residential' | 'commercial' | 'plot'): Promise<GetProjectsResponse> => {
  try {
    const params = type ? { type } : {};
    const response = await projectApiClient.get('/api/projects', { params });
    
    // The API returns: { success: true, data: [...projects], pagination: {...} }
    // We need to transform it to: { success: true, data: { projects: [...], pagination: {...} } }
    return {
      success: response.data.success || true,
      data: {
        projects: response.data.data || [],
        pagination: response.data.pagination || {
          current: 1,
          pages: 1,
          total: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
    };
  } catch (error: unknown) {
    console.error('Get projects error:', error);
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error 
      ? error.message 
      : 'Network error occurred';
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Create a new project
 * @param formData - FormData containing all project information and files
 * @returns Promise with the API response
 */
export const createProject = async (formData: FormData): Promise<CreateProjectResponse> => {
  try {
    console.log('🔗 Making API request to /api/projects...');
    console.log('📊 FormData entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [FILE] ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    const response = await projectApiClient.post('/api/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ API Response:', response.data);
    return {
      success: true,
      message: response.data.message || 'Project created successfully',
      data: response.data.data,
    };
  } catch (error: unknown) {
    console.error('❌ Create project error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('📋 Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        }
      });
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || 'Failed to create project',
          errors: error.response.data?.errors,
        };
      }
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

/**
 * Get a single project by ID
 * @param projectId - The project ID
 * @returns Promise with the API response
 */
export const getProjectById = async (projectId: string): Promise<{ success: boolean; data?: Project; message?: string }> => {
  try {
    const response = await projectApiClient.get(`/api/projects/${projectId}`);
    
    return {
      success: true,
      data: response.data.data || response.data.project,
    };
  } catch (error: unknown) {
    console.error('Get project by ID error:', error);
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error 
      ? error.message 
      : 'Network error occurred';
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Update an existing project
 * @param projectId - The project ID to update
 * @param formData - FormData containing updated project information and files
 * @returns Promise with the API response
 */
export const updateProject = async (projectId: string, formData: FormData): Promise<CreateProjectResponse> => {
  try {
    const response = await projectApiClient.put(`/api/projects/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      message: response.data.message || 'Project updated successfully',
      data: response.data.data,
    };
  } catch (error: unknown) {
    console.error('Update project error:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('❌ API Error Response:', {
        status: error.response.status,
        message: error.response.data?.message,
        errors: error.response.data?.errors,
        data: error.response.data
      });
      
      return {
        success: false,
        message: error.response.data?.message || 'Failed to update project',
        errors: error.response.data?.errors,
      };
    }
    
    console.error('❌ Network or unknown error:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

/**
 * Delete a project
 * @param projectId - The project ID to delete
 * @returns Promise with the API response
 */
export const deleteProject = async (projectId: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await projectApiClient.delete(`/api/projects/${projectId}`);
    
    return {
      success: true,
      message: response.data.message || 'Project deleted successfully',
    };
  } catch (error: unknown) {
    console.error('Delete project error:', error);
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error 
      ? error.message 
      : 'Network error occurred';
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Toggle project active status
 */
export const toggleProjectStatus = async (projectId: string, isActive: boolean): Promise<{ success: boolean; message?: string; data?: Project }> => {
  try {
    const response = await projectApiClient.patch(`/api/projects/${projectId}/toggle-status`, { isActive });
    
    return {
      success: true,
      message: response.data.message || 'Project status updated successfully',
      data: response.data.data,
    };
  } catch (error: unknown) {
    console.error('Toggle status error:', error);
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error 
      ? error.message 
      : 'Network error occurred';
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Export default object for easier imports
export const projectApi = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectStatus,
};

export default projectApi;
