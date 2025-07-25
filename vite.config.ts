import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { envReplacementPlugin } from './src/plugins/envReplacement';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      // Replace environment variables in static files
      envReplacementPlugin({
        files: [
          'index.html',
          'sitemap.xml',
          'robots.txt',
          'manifest.json'
        ],
        envPrefix: 'VITE_'
      })
    ],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      target: 'es2015',
      minify: 'esbuild' as const,
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            'ui-vendor': ['framer-motion', 'lucide-react'],
            'monaco-vendor': ['@monaco-editor/react', 'monaco-editor']
          }
        }
      }
    },
    server: {
      port: 5173,
      host: true
    }
  };
});
