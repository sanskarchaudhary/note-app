/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  safelist: [
    {
      pattern: /^bg-/,
    },
    {
      pattern: /^text-/,
    },
    {
      pattern: /^border-/,
    },
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        "blue-400": "#60a5fa",
        "blue-500": "#3b82f6",
        "blue-600": "#2563eb",
        "gray-100": "#f3f4f6",
        "gray-200": "#e5e7eb",
        "gray-700": "#374151",
        "gray-800": "#1f2937",
        "gray-900": "#111827",
        "green-400": "#4ade80",
        "yellow-500": "#eab308",
        "yellow-600": "#ca8a04",
        "teal-400": "#2dd4bf",
        "teal-800": "#115e59",
        "teal-900": "#134e4a",
        "pink-500": "#ec4899",
        "orange-500": "#f97316",
      },
    },
  },
};
