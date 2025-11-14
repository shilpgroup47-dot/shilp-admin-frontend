import { useNavigate, useLocation } from 'react-router';
import { ROUTES } from './constants';
import { RouteUtils } from './utils';

/**
 * Custom hook for admin navigation
 */
export const useAdminNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToAdminDashboard = () => {
    navigate(ROUTES.ADMIN.DASHBOARD);
  };

  const goToAdminLogin = () => {
    navigate(ROUTES.ADMIN.LOGIN);
  };

  const goToHome = () => {
    navigate(ROUTES.HOME);
  };

  const goBack = () => {
    navigate(-1);
  };

  const navigateWithState = (path: string, state?: any) => {
    navigate(path, { state });
  };

  return {
    goToAdminDashboard,
    goToAdminLogin,
    goToHome,
    goBack,
    navigateWithState,
    currentPath: location.pathname,
    isAdminRoute: RouteUtils.isAdminRoute(location.pathname),
    requiresAuth: RouteUtils.requiresAuth(location.pathname),
    isLoginRoute: RouteUtils.isLoginRoute(location.pathname),
  };
};

/**
 * Custom hook for authentication redirects
 */
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToLogin = () => {
    const loginPath = RouteUtils.getLoginPath(location.pathname);
    navigate(loginPath, { state: { from: location } });
  };

  const redirectAfterLogin = () => {
    const from = location.state?.from?.pathname;
    const redirectPath = RouteUtils.getPostLoginRedirect(from);
    navigate(redirectPath, { replace: true });
  };

  return {
    redirectToLogin,
    redirectAfterLogin,
  };
};

export default useAdminNavigation;