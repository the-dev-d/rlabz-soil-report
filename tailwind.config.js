/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      zIndex: {
        "1100": "1100"
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light", {
      srlight : {
        "primary": "#A9FDAC"
      }
    }]
  }
}

