/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#2563eb',
        success: '#16a34a',
        warning: '#f59e0b',
        accent: '#7c3aed'
      }
    }
  },
  plugins: []
}
