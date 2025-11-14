import type { RouteObject } from 'react-router';
import { Navigate } from 'react-router';
import AdminLogin from '../pages/admin/AdminLogin';
import NotFound from '../pages/NotFound';
import RouteGuard from '../components/RouteGuard';

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/login",
    element: (
      <RouteGuard redirectIfAuthenticated={true}>
        <AdminLogin />
      </RouteGuard>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default publicRoutes;