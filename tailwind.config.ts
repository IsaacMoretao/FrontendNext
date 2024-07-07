import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-left-to-right': 'linear-gradient(to right, #7658EA, #5C46B2)',
      },
      colors: {
        blue: {
          '300': '#7557E9',
        },
        gray: {
          '50': '#F2F5F3',
          '100': '#D9D9D9',
          '200': '#656565',
          '300': '#232323',
          '400': '#1E1E1E',
        },
      },
    },
  },
  plugins: [],
}
export default config
