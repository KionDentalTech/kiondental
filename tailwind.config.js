/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        turquesa: '#00B1D2',
        ciano: '#00DCFF',
        amarelo: '#F9EC1F',
        escuro: '#282828',
        cinza1: '#5A5A5A',
        cinza2: '#8D8E8F',
      },
      fontFamily: {
        sans: ['Nunito', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
