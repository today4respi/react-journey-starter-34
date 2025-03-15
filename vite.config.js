
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode !== 'development',
    },
    server: {
      port: 8080,
      open: true,
      // Serve the docs directory at /docs
      fs: {
        strict: false,
        allow: ['..'],
      },
    },
    // Add static assets to be included in the build
    publicDir: 'public',
  };
});
