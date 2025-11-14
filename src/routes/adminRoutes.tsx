import type { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';
import RouteGuard from '../components/RouteGuard';
import Layout from '../components/Layout';
import { PageLoading } from '../components/LoadingComponents';

// Lazy load all admin pages for better code splitting
const BannerPage = lazy(() => import('../pages/admin/BannerPage'));
const NewProjectsPage = lazy(() => import('../pages/admin/NewProjectsPage'));
const PlotsPage = lazy(() => import('../pages/admin/PlotsPage'));
const CommercialPage = lazy(() => import('../pages/admin/CommercialPage'));
const ResidentialPage = lazy(() => import('../pages/admin/ResidentialPage'));
const EditProjectPage = lazy(() => import('../pages/admin/EditProjectPage'));
const ViewProjectPage = lazy(() => import('../pages/admin/ViewProjectPage'));
const ProjectTreePage = lazy(() => import('../pages/admin/ProjectTreePage'));
const BlogsPage = lazy(() => import('../pages/admin/BlogsPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Banner Management">
          <Suspense fallback={<PageLoading />}>
            <BannerPage />
          </Suspense>
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Create Project">
          <Suspense fallback={<PageLoading />}>
            <NewProjectsPage />
          </Suspense>
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects/view/:id",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="View Project">
          <Suspense fallback={<PageLoading />}>
            <ViewProjectPage />
          </Suspense>
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects/edit/:id",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Edit Project">
          <Suspense fallback={<PageLoading />}>
            <EditProjectPage />
          </Suspense>
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects/plots",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Plots">
          <Suspense fallback={<PageLoading />}>
            <PlotsPage />
          </Suspense>
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects/commercial",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Commercial Projects">
          <Suspense fallback={<PageLoading />}>
            <CommercialPage />
          </Suspense>
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/projects/residential",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Residential Projects">
          <Suspense fallback={<PageLoading />}>
            <ResidentialPage />
          </Suspense>
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/project-tree",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Project Tree">
          <Suspense fallback={<PageLoading />}>
            <ProjectTreePage />
          </Suspense>
        </Layout>
      </RouteGuard>
    ),
  },
  {
    path: "/admin/blogs",
    element: (
      <RouteGuard requireAuth={true}>
        <Layout title="Blogs">
          <Suspense fallback={<PageLoading />}>
            <BlogsPage />
          </Suspense>
        </Layout>
      </RouteGuard>
    ),
  },
];

export default adminRoutes;