import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss()],server:{host:'127.0.0.1'},build:{rollupOptions:{output:{manualChunks(id){if(id.includes('node_modules')&&(/recharts|d3-|victory|react-smooth|decimal/.test(id)))return 'charts';}}}}});
