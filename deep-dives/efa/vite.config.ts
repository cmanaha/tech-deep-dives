import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/tech-deep-dives/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@cloudscape-design')) {
            return 'cloudscape';
          }
          if (id.includes('@xyflow/react') || id.includes('reactflow')) {
            return 'reactflow';
          }
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
});
