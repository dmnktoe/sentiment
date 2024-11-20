import defaultTheme from 'tailwindcss/defaultTheme';

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Roobert', ...defaultTheme.fontFamily.sans],
        secondary: ['Tobias', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        primary: '#D2D05B',
        secondary: '#71cecb',
        tertiary: '#8b9094',
        text: '#0a0440',
        grid: '#f2f2f2',
      },
    },
  },
  plugins: [],
};

export default config;
