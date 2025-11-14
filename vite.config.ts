import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const devPort = parseInt(env.VITE_DEV_PORT || '5174', 10)
  const prodPort = parseInt(env.VITE_PROD_PORT || '5174', 10)
  
  // Get the first URL from comma-separated list for proxy
  const apiBaseUrl = env.VITE_API_BASE_URL?.split(',')[0] || 'http://localhost:8081'
  
  const port = mode === 'production' ? prodPort : devPort

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: port,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', () => {});
            proxy.on('proxyReq', () => {});
            proxy.on('proxyRes', () => {});
          },
        },
        '/uploads': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', () => {});
            proxy.on('proxyReq', () => {});
            proxy.on('proxyRes', () => {});
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['react-router'],
            'vendor-icons': ['lucide-react'],
            'vendor-http': ['axios'],
            
            // UI component chunks
            'components-admin': [
              './src/components/admin/projects/index.ts'
            ],
            'components-common': [
              './src/components/Layout.tsx',
              './src/components/Sidebar.tsx',
              './src/components/RouteGuard.tsx',
              './src/components/modals/index.ts'
            ],
            
            // Page chunks - split by admin sections
            'pages-admin': [
              './src/pages/admin/BannerPage.tsx',
              './src/pages/admin/BlogsPage.tsx',
              './src/pages/admin/ProjectTreePage.tsx'
            ],
            'pages-project': [
              './src/pages/admin/NewProjectsPage.tsx',
              './src/pages/admin/EditProjectPage.tsx',
              './src/pages/admin/ViewProjectPage.tsx'
            ],
            'pages-project-types': [
              './src/pages/admin/ResidentialPage.tsx',
              './src/pages/admin/CommercialPage.tsx',
              './src/pages/admin/PlotsPage.tsx'
            ],
            
            // API chunks
            'api': [
              './src/api/index.ts',
              './src/api/config.ts'
            ]
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
              : 'chunk'
            return `chunks/${facadeModuleId}-[hash].js`
          }
        }
      },
      chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
      target: 'esnext', // Use modern JS for smaller bundles
      minify: 'terser' // Use terser for better compression
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router',
        'lucide-react',
        'axios'
      ]
    }
  }
})
