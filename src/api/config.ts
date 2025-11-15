// API configuration
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// Simple URL configuration
const getBaseUrl = (): string => {
  // Always use production API URL
  return 'https://backend.shilpgroup.com';
};

// Simple image URL generator
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Always use production image URL
  return `https://admin.shilpgroup.com${cleanPath}`;
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    ADMIN: {
      LOGIN: '/api/admin/login',
      VERIFY_TOKEN: '/api/admin/verify-token',
      FORGOT_PASSWORD: '/api/admin/forgot-password',
      PROFILE: '/api/admin/profile',
    },
  },
  TIMEOUT: 30000, // 30 seconds for better connectivity
} as const;

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  message?: string;
}

// Common error handling
export class ApiError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// HTTP client utility
export const httpClient = {
  async request<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...Object.fromEntries(Object.entries(options.headers || {}).map(([k, v]) => [k, v ?? ''])),
    };
    
    // Add admin token if available
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      defaultHeaders['Authorization'] = `Bearer ${adminToken}`;
    }
    
    console.log('🔗 Making API request to:', url);
    
    try {
      const axiosConfig: AxiosRequestConfig = {
        url,
        method: options.method || 'GET',
        headers: defaultHeaders,
        data: options.data,
        timeout: API_CONFIG.TIMEOUT,
        withCredentials: false,
      };
      
      const response = await axios.request<ApiResponse<T>>(axiosConfig);
      
      console.log('✅ API Response received:', response.status);
      
      if (!response.data.success) {
        throw new ApiError(
          response.data.error?.message || response.data.message || 'Request failed',
          response.status,
          response.data.error?.code
        );
      }
      return response.data;
  } catch (error: unknown) {
      console.error('❌ API Request failed:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (axios.isAxiosError(error)) {
        console.error('🌐 Axios Error Details:', {
          code: error.code,
          message: error.message,
          status: error.response?.status,
          url: error.config?.url
        });
        
        if (error.code === 'ECONNABORTED') {
          throw new ApiError(
            'Connection timeout - Please check your internet connection and try again', 
            408, 
            'TIMEOUT'
          );
        }
        
        if (error.code === 'ERR_NETWORK') {
          throw new ApiError(
            'Network error - Unable to connect to server', 
            0, 
            'NETWORK_ERROR'
          );
        }
        
        if (error.response?.status === 404) {
          throw new ApiError(
            'API endpoint not found', 
            404, 
            'NOT_FOUND'
          );
        }
        
        if (error.response?.status === 500) {
          throw new ApiError(
            'Server error - Please try again later', 
            500, 
            'SERVER_ERROR'
          );
        }
        
        throw new ApiError(
          error.response?.data?.error?.message || error.message || 'Network connection failed',
          error.response?.status || 0,
          error.response?.data?.error?.code || 'NETWORK_ERROR'
        );
      }
      
      throw new ApiError('Unexpected error occurred', 0, 'UNKNOWN_ERROR');
    }
  },

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', data });
  },

  put<T>(endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', data });
  },

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};

export default httpClient;