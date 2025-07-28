/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'mcm-accent': '#EAB308', // Gold
        'mcm-accent-light': '#FCD34D',
        
        // Light Theme
        'background': '#F9FAFB',         // gray-50
        'surface': '#FFFFFF',
        'primary': '#111827',       // gray-900
        'secondary': '#4B5563', // gray-600
        'border': '#E5E7EB',       // gray-200
        'action-text-light': '#FFFFFF',

        // Dark Theme
        'dark-background': '#111827',           // gray-900
        'dark-surface': '#1F2937',      // gray-800
        'dark-primary': '#F3F4F6', // gray-100
        'dark-secondary': '#9CA3AF',// gray-400
        'dark-border': '#374151',       // gray-700
        'action-text-dark': '#111827', // For buttons with accent bg
      },
    },
  },
  plugins: [],
}
