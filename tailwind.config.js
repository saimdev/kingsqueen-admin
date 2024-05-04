/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4FD1C5',
        'secondary': '#F7FAFC',
        'heading': '#1f2733',
        'text': '#A0AEC0',
      },
      boxShadow: {
        'soft': 'rgba(0, 0, 0, 0.02) 0px 3.5px 5.5px',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}

