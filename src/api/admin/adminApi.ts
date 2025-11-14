import type { ApiResponse } from '../config';
import { httpClient, API_CONFIG, ApiError } from '../config';

// Admin login request interface
export interface AdminLoginRequest {
  email: string;
  password: string;
  [key: string]: unknown;
}

// Admin login response interface
export interface AdminLoginResponse {
  token: string;
  admin: {
    id: string;
    username: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    lastLogin?: string;
  };
}

// Admin verify token response
export interface AdminVerifyTokenResponse {
  valid: boolean;
  admin: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Admin profile response
export interface AdminProfileResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  lastLogin?: string;
}

/**
 * Admin login function
 */
export const adminLogin = async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
  try {
    const response: ApiResponse<AdminLoginResponse> = await httpClient.post(
      API_CONFIG.ENDPOINTS.ADMIN.LOGIN,
      credentials
    );

    if (response.success && response.data) {
      // Store token and admin data in localStorage
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.admin));
      
      return response.data;
    }

    throw new ApiError(
      response.error?.message || 'Login failed',
      400,
      response.error?.code
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Login request failed', 500, 'LOGIN_ERROR');
  }
};

/**
 * Verify admin token function
 */
export const verifyAdminToken = async (): Promise<AdminVerifyTokenResponse> => {
  try {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new ApiError('No token found', 401, 'NO_TOKEN');
    }

    const response: ApiResponse<AdminVerifyTokenResponse> = await httpClient.post(
      API_CONFIG.ENDPOINTS.ADMIN.VERIFY_TOKEN,
      { token }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new ApiError(
      response.error?.message || 'Token verification failed',
      401,
      response.error?.code
    );
  } catch (error) {
    // Clear invalid token
    adminLogout();
    
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Token verification failed', 500, 'TOKEN_ERROR');
  }
};

/**
 * Get admin profile function
 */
export const getAdminProfile = async (): Promise<AdminProfileResponse> => {
  try {
    const response: ApiResponse<AdminProfileResponse> = await httpClient.get(
      API_CONFIG.ENDPOINTS.ADMIN.PROFILE
    );

    if (response.success && response.data) {
      // Update stored admin data
      localStorage.setItem('adminData', JSON.stringify(response.data));
      return response.data;
    }

    throw new ApiError(
      response.error?.message || 'Failed to fetch profile',
      400,
      response.error?.code
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Profile request failed', 500, 'PROFILE_ERROR');
  }
};

/**
 * Forgot password function
 */
export const forgotAdminPassword = async (email: string): Promise<{ message: string }> => {
  try {
    const response: ApiResponse<{ message: string }> = await httpClient.post(
      API_CONFIG.ENDPOINTS.ADMIN.FORGOT_PASSWORD,
      { email }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new ApiError(
      response.error?.message || 'Failed to send reset email',
      400,
      response.error?.code
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Forgot password request failed', 500, 'FORGOT_PASSWORD_ERROR');
  }
};

/**
 * Logout admin function
 */
export const adminLogout = (): void => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};

/**
 * Check if admin is logged in function
 */
export const isAdminLoggedIn = (): boolean => {
  const token = localStorage.getItem('adminToken');
  const adminData = localStorage.getItem('adminData');
  return !!(token && adminData);
};

/**
 * Get stored admin data function
 */
export const getStoredAdminData = (): AdminLoginResponse['admin'] | null => {
  try {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  } catch (error) {
    console.error('Error parsing admin data:', error);
    return null;
  }
};

/**
 * Get stored admin token function
 */
export const getStoredAdminToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

// Admin API object for backward compatibility
export const AdminApi = {
  login: adminLogin,
  verifyToken: verifyAdminToken,
  getProfile: getAdminProfile,
  forgotPassword: forgotAdminPassword,
  logout: adminLogout,
  isLoggedIn: isAdminLoggedIn,
  getStoredAdminData,
  getStoredToken: getStoredAdminToken,
};

export default AdminApi;