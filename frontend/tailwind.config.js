/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { fontFamily: { sans: ['Inter', 'Segoe UI', 'sans-serif'] }, colors: { success: '#237a45', mint: '#a7e8bd', coral: '#ef6a56', line: '#dfe3df', canvas: '#f5f6f3', night: '#111512', ink: '#18201b', muted: '#657069', surface: '#ffffff' } } },
  plugins: [],
}
