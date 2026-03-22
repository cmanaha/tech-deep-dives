import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/tech-deep-dives/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true, passes: 2 },
      mangle: true,
    },
    assetsInlineLimit: 4096,
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
