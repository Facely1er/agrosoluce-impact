import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['agrosoluce.png', 'favicon.ico'],
      manifest: {
        name: 'AgroSoluce Intelligence - Field Operations',
        short_name: 'AgroSoluce Intel',
        description: 'Field Intelligence & Operations Platform - For ERMITS team, cooperative managers, and farmers. Offline-first field operations tool.',
        theme_color: '#2E7D32',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/agrosoluce.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/agrosoluce.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        categories: ['business', 'productivity', 'agriculture'],
        shortcuts: [
          {
            name: 'Directory',
            short_name: 'Directory',
            description: 'Browse cooperatives',
            url: '/cooperatives',
            icons: [{ src: '/agrosoluce.png', sizes: '192x192' }],
          },
          {
            name: 'Buyer Portal',
            short_name: 'Buyers',
            description: 'Buyer dashboard',
            url: '/buyer',
            icons: [{ src: '/agrosoluce.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native': 'react-native-web',
    },
  },
  server: {
    port: 5174, // Different port from web app (5173)
    host: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true,
  },
});

