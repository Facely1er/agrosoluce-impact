import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

/** SPA fallback for preview: serve index.html for non-asset routes (run after static) */
function spaPreviewFallback() {
  return {
    name: 'spa-preview-fallback',
    configurePreviewServer(server: any) {
      return () => {
        server.middlewares.use((req: any, res: any, next: any) => {
          const url = (req.url ?? '/').split('?')[0];
          if (
            !url.startsWith('/assets/') &&
            !url.startsWith('/data/') &&
            !/\.\w+$/.test(url) &&
            url !== '/'
          ) {
            const indexPath = path.join(__dirname, 'build', 'index.html');
            if (fs.existsSync(indexPath)) {
              res.setHeader('Content-Type', 'text/html');
              res.end(fs.readFileSync(indexPath, 'utf-8'));
              return;
            }
          }
          next();
        });
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), spaPreviewFallback()],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    copyPublicDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Supabase
          'supabase-vendor': ['@supabase/supabase-js'],
          // Chart libraries (large dependencies)
          'charts-vendor': ['chart.js', 'react-chartjs-2', 'recharts'],
          // Map libraries (large dependencies)
          'maps-vendor': ['leaflet', 'react-leaflet'],
          // Icons (can be large)
          'icons-vendor': ['lucide-react'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
    ],
  },
});

