/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cube: {
          red: '#ff4444',
          orange: '#ff8800',
          yellow: '#ffff00',
          white: '#ffffff',
          green: '#00ff00',
          blue: '#0044ff',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-gentle': 'bounce 2s infinite',
      },
      boxShadow: {
        'cube': '0 10px 30px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
};