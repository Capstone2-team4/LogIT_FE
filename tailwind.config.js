import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
    function ({ addUtilities }) {
      addUtilities({
        ".tooltip-line:hover::after": {
          content: 'attr(data-tooltip)',
          position: "absolute",
          bottom: "100%",
          left: "0",
          transform: "translateX(10px)",
          backgroundColor: "#111",
          color: "#fff",
          padding: "6px 10px",
          fontSize: "12px",
          borderRadius: "4px",
          whiteSpace: "pre-line",
          wordBreak: "keep-all",
          minWidth: "200px",       // 너무 좁은 말풍선 방지
          maxWidth: "500vw",       // 기존 80vw → 고정된 적절한 폭
          width: "max-content", 
          maxHeight: "300px",
          overflowY: "auto",
          zIndex: "9999",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        },
      });
    },
  ],
};
