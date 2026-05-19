/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#09090f',
        bg2: '#11111c',
        bg3: '#18182a',
        border: '#22223a',
        accent: '#ff6b35',
        accent2: '#ffbb33',
        blue: '#4e9eff',
        green: '#2ecc71',
        purple: '#aa77ff',
        text: '#f0f0f8',
        muted: '#7070a0',
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
