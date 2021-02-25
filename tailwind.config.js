module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      padding: {
        nav: "calc(4.5rem + 2px)"
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
