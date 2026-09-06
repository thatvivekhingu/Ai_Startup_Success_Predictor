/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        navy: {
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Montserrat', 'sans-serif'],
        display: ['Poppins', 'Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        dmsans: ['"DM Sans"', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        samsung: ['"Samsung Sharp Sans"', '"SamsungOne"', 'Poppins', 'Inter', 'sans-serif'],
        'samsung-one': ['"SamsungOne"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
