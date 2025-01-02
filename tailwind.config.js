/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#222222",
        paperBrown: '#f5deb3',
      },
      backgroundImage: {
        'custom-gradient': 'radial-gradient(ellipse farthest-corner at center center, #e4cece 0%, #e21212 80%)',
      },
      screens: {
        xs: "480px",
      },
      animation: {
        slideOut: "slideOut 0.5s",
        slideIn: "slideIn 0.5s",
        pulsate: "pulsate 0.5s ease-in-out 3",
        deleteBtn: "deleteBtn 0.3s",
        like: "like 1.1s ease-in-out ",
      },
      boxShadow: {
        content: "0px 0px 11px 4px rgba(34,34,34,0.75) inset",
        story: "0px 0px 9px 2px rgba(34,34,34,0.75)",
      },
      keyframes: {
        slideOut: {
          "0%": { left: "-100%" },
          "100%": { left: "0" },
        },
        slideIn: {
          "0%": { left: "0" },
          "100%": { left: "-100%" },
        },
        pulsate: {
          "0%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.2)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        deleteBtn: {
          "0%": {
            opacity: "0",
            transform: "translateY(-40%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        like: {
          "0%": {
            transform: "scale(1)",

          },
          "25%": {
            transform: "scale(1.1)",
          },
          "50%": {
            transform: "scale(1)",
          },
          "75%": {
            transform: "scale(1.3)",
          },
          "100%": {
            transform: "scale(1.4)",
            // "transform-origin": "bottom",
            transform: "translateY(-50%)",
            opacity: "0",

            
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss/plugin")(({ addVariant }) => {
      addVariant("search-cancel", "&::-webkit-search-cancel-button");
    }),
  ],
};
