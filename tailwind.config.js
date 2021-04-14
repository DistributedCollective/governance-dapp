module.exports = {
  purge: ['src/**/*.ts', 'src/**/*.tsx', 'public/**/*.html'],
  future: {
    purgeLayersByDefault: true,
  },
  theme: {
    screens: {
      sm: '100%',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    fontFamily: {
      montserrat: ['Montserrat', 'sans-serif'],
      worksans: ['Work Sans', 'sans-serif'],
    },
    fontSize: {
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '4-5xl': '2.5rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    container: {
      center: true,
      padding: '1.875rem',
      screens: {
        sm: '100%',
        md: { min: '1920px' },
      },
    },
    opacity: {
      '0': '0',
      '10': '.1',
      '20': '.2',
      '30': '.3',
      '40': '.4',
      '50': '.5',
      '60': '.6',
      '70': '.7',
      '80': '.8',
      '90': '.9',
      '100': '1',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      gray: {
        100: '#1f1f1f',
        200: '#2F2F2F',
        300: '#EDEDED',
        600: '#F4F4F4',
        700: '#191919',
        800: '#282828',
        900: '#686868',
        dark: '#707070',
        light: '#181818',
        lighter: '#161616',
      },
      gold: '#FEC004',
      white: 'white',
      black: 'black',
      turquoise: '#4ECDC4',
      red: '#CD4E4E',
      theme: {
        white: '#E9EAE9',
        blue: '#2274A5',
      }
    },
    extend: {
      minHeight: {
        header: '70px',
      },
    },
  },
  variants: {
    opacity: ['responsive', 'hover'],
  },
  plugins: [require('tailwindcss')],
};
