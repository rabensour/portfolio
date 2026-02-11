import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'category-work': '#2563eb',
        'category-personal': '#16a34a',
        'category-newsletter': '#9333ea',
        'category-finance': '#059669',
        'category-shopping': '#ec4899',
        'category-social': '#ea580c',
        'category-travel': '#0891b2',
        'category-health': '#dc2626',
        'category-other': '#4b5563',
      },
    },
  },
  plugins: [],
} satisfies Config
