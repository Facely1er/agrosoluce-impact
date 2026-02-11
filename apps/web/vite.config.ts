import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
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

