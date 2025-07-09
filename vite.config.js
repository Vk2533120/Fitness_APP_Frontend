import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // This might already be there
import tailwindcss from '@tailwindcss/vite' // Add this line

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // Keep your existing React plugin
    tailwindcss(), // Add this line
  ],
})