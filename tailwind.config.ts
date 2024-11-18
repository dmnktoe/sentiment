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
        tertiary: '#5e6a7d',
        text: '#0a0440',
      },
    },
  },
  plugins: [],
};

export default config;
