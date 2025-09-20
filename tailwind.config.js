/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
        display: ['Space Grotesk', 'Poppins', 'ui-sans-serif']
      },
      colors: {
        nv: {
          primary: '#4B3F72',
          secondary: '#A786DF',
          accent: '#00B8A9',
          lightText: '#2D2D2D'
        }
      },
      backgroundImage: {
        'nv-gradient-dark': 'linear-gradient(135deg, #1a1630 0%, #4B3F72 45%, #0c3f3b 100%)',
        'nv-gradient-light': 'linear-gradient(135deg, #ffffff 0%, #f7f3ff 50%, #ecfffd 100%)'
      }
    },
  },
  plugins: [],
};
