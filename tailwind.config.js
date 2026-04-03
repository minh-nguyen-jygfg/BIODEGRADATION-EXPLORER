/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/modules/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#212B36',
        secondary: '#637381',
        'primary-main': '#159947',
        'secondary-light': '#FF91DA',
        'secondary-main': '#EC38BC',

        'success-main': '#21C45D',
        neutral: '#F4F6F8',
        disabled: '#919EAB',
        'transparent-grey': '#919EAB14',
        'transparent-secondary': '#EC38BC14',
        'transparent-success': '#4CAF5014',
        'transparent-quaternary': '#5070FF14',
        'transparent-warning': '#FF980014',
        'transparent-primary': '#9075FF14',
        'transparent-error': '#F4433614',
        'input-outline': '#919EAB52',
        'component-divider': '#919EAB3D',
      },
    },
  },
  plugins: [],
}
