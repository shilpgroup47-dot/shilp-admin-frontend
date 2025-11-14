// Main routes export file
export { router } from './router';

// Route constants and utilities
export { ROUTES, ROUTE_NAMES } from './constants';
export { RouteUtils } from './utils';

// Route hooks
export { useAdminNavigation, useAuthRedirect } from './hooks';

// Individual route modules
export { adminRoutes } from './adminRoutes';
export { publicRoutes } from './publicRoutes';