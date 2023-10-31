/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            blur: {
                color: '218px'
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
            },
            colors: {
                // New colors
                black: '#0D0D0D',
                'dark-gray': '#666666',
                white: '#E6E6E6',

                // Old colors
                cardano: '#0C1420'
            },
            height: {
                22: '88px'
            },
            fontFamily: {
                ibm: ['IBM Plex Mono', 'Open Sans', 'monospace']
            }
        }
    },
    plugins: []
};
