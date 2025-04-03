/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Use Vitest global APIs (describe, test, expect, etc.)
    environment: 'jsdom', // Simulate browser environment
    setupFiles: './src/setupTests.js', // Optional setup file
    // include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'], // Default pattern
    css: false, // Disable CSS processing for tests if not needed, can speed up
  },
})
