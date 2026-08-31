export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#241B22",
        plum: "#4A2E3A",
        rose: "#C17F87",
        "rose-light": "#E8C9CD",
        porcelain: "#FBF6F4",
        sand: "#F1E5E1",
        gold: "#B0895A",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};