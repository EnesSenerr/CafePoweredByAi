/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#F6F2EE',
          100: '#EAE0D9',
          200: '#DAC2B3',
          300: '#C7A58C',
          400: '#B58865',
          500: '#997049',
          600: '#7C5A3A',
          700: '#5F462C',
          800: '#42301D',
          900: '#25190F',
        },
        mocha: {
          100: '#F5EBDC',
          500: '#8B5A2B',
          900: '#513519',
        },
        cream: {
          50: '#FFFAF0',
          100: '#FEEBC8',
          200: '#FBD38D',
          300: '#F6AD55',
          400: '#ED8936',
          500: '#DD6B20',
          600: '#C05621',
          700: '#9C4221',
          800: '#7B341E',
          900: '#652B19',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'coffee-pattern': "url('/images/coffee-pattern.png')",
        'cafe-hero': "url('/images/cafe-hero.jpg')",
        'coffee-beans': "url('/images/coffee-beans.jpg')",
      }
    },
  },
  plugins: [],
} 