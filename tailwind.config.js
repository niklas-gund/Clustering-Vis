/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'bismark': {
        '50': '#f4f6f7',
        '100': '#e2e8eb',
        '200': '#c9d4d8',
        '300': '#a3b4bd',
        '400': '#768d9a',
        '500': '#586f7c',
        '600': '#4e606c',
        '700': '#43515b',
        '800': '#3c454e',
        '900': '#363d43',
        '950': '#21262b',
        "DEFAULT": '#586f7c'
    },
    
      }
    }
  },
  plugins: []
};