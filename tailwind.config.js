module.exports = {
  purge: ['src/**/*.ts', 'src/**/*.tsx', 'public/**/*.html'],
  future: {
    purgeLayersByDefault: true,
  },
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
    },
    container: {
      center: true,
      padding: '15px',
    },
    extend: {},
  },
  variants: {
    opacity: ['responsive', 'hover'],
  },
  plugins: [],
};
