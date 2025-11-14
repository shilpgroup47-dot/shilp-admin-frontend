import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { RouteUtils } from '../routes/utils';
import { ROUTES } from '../routes/constants';
import { AdminApi } from '../api';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectIfAuthenticated?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requireAuth = false,
  redirectIfAuthenticated = false 
}) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check if admin is logged in using AdminApi
        if (AdminApi.isLoggedIn()) {
          // Only verify token if not on login page to avoid unnecessary calls
          if (location.pathname !== '/login') {
            try {
              await AdminApi.verifyToken();
              setIsAuthenticated(true);
            } catch (error) {
              console.error('Token verification failed:', error);
              // Token is invalid, clear it
              AdminApi.logout();
              setIsAuthenticated(false);
            }
          } else {
            // On login page, trust localStorage for now
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
        AdminApi.logout();
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, [location.pathname]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  // Redirect to admin login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate 
      to={ROUTES.ADMIN.LOGIN} 
      state={{ from: location }} 
      replace 
    />;
  }

  // Redirect authenticated admins away from login pages
  if (redirectIfAuthenticated && isAuthenticated) {
    const from = location.state?.from?.pathname;
    const redirectPath = RouteUtils.getPostLoginRedirect(from);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;