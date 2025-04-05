import defaultTheme from 'tailwindcss/defaultTheme';

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['CircularStd', ...defaultTheme.fontFamily.sans],
        secondary: [...defaultTheme.fontFamily.serif],
      },
      colors: {
        primary: '#FF5C24',
        secondary: '#1F35A5',
        tertiary: '#8b9094',
        text: '#000000',
        grid: '#f2f2f2',
      },
    },
  },
  plugins: [],
};

export default config;
