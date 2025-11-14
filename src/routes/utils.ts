// Navigation utilities for route management
import { ROUTES } from './constants';

export class RouteUtils {
  /**
   * Check if current path is admin route
   */
  static isAdminRoute(pathname: string): boolean {
    // Since this is an admin-only app, all routes except login are admin routes
    return pathname !== ROUTES.ADMIN.LOGIN;
  }

  /**
   * Get redirect path after login based on route type
   */
  static getPostLoginRedirect(fromPath?: string): string {
    if (fromPath && fromPath !== ROUTES.ADMIN.LOGIN) {
      return fromPath;
    }
    return ROUTES.ADMIN.DASHBOARD;
  }

  /**
   * Get login path based on current route
   */
  static getLoginPath(currentPath?: string): string {
    if (currentPath && this.isAdminRoute(currentPath)) {
      return ROUTES.ADMIN.LOGIN;
    }
    return ROUTES.ADMIN.LOGIN; // Default to admin login since this is admin-only app
  }

  /**
   * Get home path
   */
  static getHomePath(): string {
    return ROUTES.HOME;
  }

  /**
   * Check if route requires authentication
   */
  static requiresAuth(pathname: string): boolean {
    const protectedRoutes: string[] = [
      ROUTES.ADMIN.DASHBOARD,
    ];
    return protectedRoutes.includes(pathname);
  }

  /**
   * Check if route is a login page
   */
  static isLoginRoute(pathname: string): boolean {
    const loginRoutes: string[] = [
      ROUTES.ADMIN.LOGIN,
    ];
    return loginRoutes.includes(pathname);
  }
}

export default RouteUtils;