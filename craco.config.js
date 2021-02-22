module.exports = {
  reactScriptsVersion: 'react-scripts',
  style: {
    postcss: {
      mode: 'extends',
      plugins: [require('tailwindcss')],
    },
  },
};
