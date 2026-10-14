/** @type {import('tailwindcss').Config} */
export default {
content: ["./index.html", "./src/**/*.{js,jsx}"],
theme: {
  extend: {
    // Tonos definidos por marca en src/config/marca.js
    colors: {
      marca: Object.fromEntries(
        [50, 100, 300, 500, 600, 700, 800].map((t) => [t, `var(--marca-${t})`])
      ),
    },
  },
},
plugins: [],

}

