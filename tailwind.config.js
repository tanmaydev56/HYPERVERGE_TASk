/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: "#2563EB",   // Blue (trust, reliability)
        secondary: "#9333EA", // Purple (innovation, premium)
        accent: "#F59E0B",    // Amber (attention / highlight)

        // Neutral palette (UI backgrounds, borders, text)
        background: "#F9FAFB", // Light background
        surface: "#FFFFFF",   // Cards, modals
        border: "#E5E7EB",    // Light gray border
        text: "#111827",      // Dark text
        muted: "#6B7280",     // Subtext / labels

        // State colors
        success: "#10B981",   // Green (verified)
        error: "#EF4444",     // Red (failed)
        warning: "#F59E0B",   // Orange (attention)
        info: "#3B82F6",      // Light blue (status updates)
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"], // Clean modern font
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.05)", // Soft shadow for cards
        button: "0 2px 6px rgba(0,0,0,0.1)", // Button hover shadow
      },
    },
  },
  plugins: [],
}