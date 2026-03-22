import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/tech-deep-dives/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
