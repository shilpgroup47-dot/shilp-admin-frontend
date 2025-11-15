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
  TIMEOUT: 10000, // 10 seconds
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
      ...Object.fromEntries(Object.entries(options.headers || {}).map(([k, v]) => [k, v ?? ''])),
    };
    // Add admin token if available
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      defaultHeaders['Authorization'] = `Bearer ${adminToken}`;
    }
    try {
      const axiosConfig: AxiosRequestConfig = {
        url,
        method: options.method,
        headers: defaultHeaders,
        data: options.data,
        timeout: API_CONFIG.TIMEOUT,
      };
      const response = await axios.request<ApiResponse<T>>(axiosConfig);
      if (!response.data.success) {
        throw new ApiError(
          response.data.error?.message || response.data.message || 'Request failed',
          response.status,
          response.data.error?.code
        );
      }
      return response.data;
  } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new ApiError('Request timeout', 408, 'TIMEOUT');
        }
        throw new ApiError(
          error.response?.data?.error?.message || error.message || 'Network error',
          error.response?.status || 0,
          error.response?.data?.error?.code || 'NETWORK_ERROR'
        );
      }
      throw new ApiError('Network error', 0, 'NETWORK_ERROR');
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