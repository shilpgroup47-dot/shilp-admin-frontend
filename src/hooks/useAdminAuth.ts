import { useState, useEffect, useCallback } from 'react';
import { AdminApi, apiUtils } from '../api';
import type { AdminLoginRequest, AdminLoginResponse } from '../api';

interface UseAdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminData: AdminLoginResponse['admin'] | null;
  error: string | null;
}

interface UseAdminAuthActions {
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  clearError: () => void;
}

export type UseAdminAuth = UseAdminAuthState & UseAdminAuthActions;

/**
 * Custom hook for admin authentication management
 */
export const useAdminAuth = (): UseAdminAuth => {
  const [state, setState] = useState<UseAdminAuthState>({
    isAuthenticated: false,
    isLoading: true,
    adminData: null,
    error: null,
  });

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (AdminApi.isLoggedIn()) {
          const adminData = AdminApi.getStoredAdminData();
          
          // Try to verify token with server, but don't fail initialization if it fails
          try {
            await AdminApi.verifyToken();
          } catch (error) {
            // Don't logout here - let the user try to use the app
            // If token is truly invalid, it will be caught during actual API calls
          }
          
          setState(prev => ({
            ...prev,
            isAuthenticated: true,
            adminData,
            isLoading: false,
            error: null,
          }));
        } else {
          setState(prev => ({
            ...prev,
            isAuthenticated: false,
            adminData: null,
            isLoading: false,
            error: null,
          }));
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        AdminApi.logout();
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          adminData: null,
          isLoading: false,
          error: apiUtils.formatError(error),
        }));
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: AdminLoginRequest): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await AdminApi.login(credentials);
      
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        adminData: response.admin,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        adminData: null,
        isLoading: false,
        error: apiUtils.formatError(error),
      }));
      throw error; // Re-throw for component handling
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    AdminApi.logout();
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      adminData: null,
      error: null,
    }));
  }, []);

  // Verify token function
  const verifyToken = useCallback(async (): Promise<boolean> => {
    try {
      await AdminApi.verifyToken();
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
      return false;
    }
  }, [logout]);

  // Clear error function
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    logout,
    verifyToken,
    clearError,
  };
};

export default useAdminAuth;