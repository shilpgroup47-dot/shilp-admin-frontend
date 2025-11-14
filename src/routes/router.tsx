import { createBrowserRouter } from 'react-router';
import { adminRoutes } from './adminRoutes';
import { publicRoutes } from './publicRoutes';

// Debug: Log routes to verify they're loaded correctly

// Combine all routes - admin routes MUST come before catch-all routes
export const router = createBrowserRouter([
  ...adminRoutes,
  ...publicRoutes,
]);

export default router;