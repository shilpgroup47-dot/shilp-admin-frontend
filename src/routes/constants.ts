// Route paths constants for better maintainability
export const ROUTES = {
  // Public routes
  HOME: '/',
  
  // Admin routes
  ADMIN: {
    LOGIN: '/login',
    DASHBOARD: '/admin', // BannerPage is the admin dashboard
  },
} as const;

// Route names for easier reference
export const ROUTE_NAMES = {
  HOME: 'Home',
  ADMIN_LOGIN: 'Admin Login',
  ADMIN_DASHBOARD: 'Banner Management',
} as const;

export default ROUTES;