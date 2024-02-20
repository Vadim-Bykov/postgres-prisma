const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        logo: "Logotype",
        head: "HeaderType",
      },
      transitionProperty: {
        "max-height": "max-height",
        height: "height",
        width: "width",
      },
      colors: {
        purple: {
          DEFAULT: "#622BEF",
          hover: "#4f11eb",
          active: "#460fd1",
          light: "#706C7C",
          dark: "#3B3252",
        },
        gray: {
          DEFAULT: "#DAE2E6",
          light: "#F0F2F2",
        },
        pink: {
          DEFAULT: "#EE3A78",
        },
        yellow: {
          DEFAULT: "#ffdd00",
          hover: "#ffce29",
        },
        red: {
          DEFAULT: "#FF3B30",
          hover: "#D52027",
        },
        primary: {
          DEFAULT: "#141024",
        },
      },
    },
  },
  plugins: [],
};
