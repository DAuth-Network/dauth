/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main': '#9352FF',
        'green': '#40AA84',
        'green-dark': '#D1FAE5',
        'red': '#CB6462',
        'red-dark': '#3F292C',
        'light-grey': '#EBEBEB',
        'mid-light-grey': '#A1A1A1',
        'mid-grey': '#5C5C5E',
        'dark-grey': '#373737',
      },  
    },
  },
  plugins: [], 
}

