/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jungle: {
          950: '#0B2B2B',
          900: '#0F3630',
          700: '#1F6F5C',
          500: '#2F8F6F',
        },
        ocean: {
          800: '#14364A',
          600: '#1D4E68',
        },
        sand: {
          400: '#E8B84B',
          300: '#F0CD79',
        },
        ivory: {
          50: '#FBF6EC',
          100: '#F5EEDD',
        },
        ink: {
          900: '#16211F',
          700: '#3A4744',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        hero: ['"Instrument Serif"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        card: '0 20px 40px -20px rgba(15, 54, 48, 0.35)',
        soft: '0 10px 30px -12px rgba(15, 54, 48, 0.25)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        widen: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        rise: 'rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        widen: 'widen 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        'ken-burns': 'ken-burns 8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}