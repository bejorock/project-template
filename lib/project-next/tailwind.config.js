module.exports = {
  // important: true,
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      margin: {
        0: "0px !important",
      },
    },
  },
  variants: {
    extend: {
      animation: ["responsive", "motion-safe", "motion-reduce"],
      opacity: ["disabled", "group-disabled"],
      backgroundColor: ["disabled", "group-disabled"],
      textColor: ["disabled", "group-disabled"],
      padding: ["hover"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-interaction-variants"),
  ],
};
