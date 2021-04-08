module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      padding: {
        nav: "0px"
      },
      backgroundImage: {
        "hero-lg": "url(/static/network-c.gif)"
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
