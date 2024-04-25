/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            screens: {
                xs: '360px',
                '2xs': '480px',
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px'
            },
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
            minHeight: {
                'calc-68': 'calc(100vh - 68px)'
            },
            height: {
                22: '88px',
                'calc-88': 'calc(100vh - 88px)'
            },
            fontFamily: {
                ibm: ['IBM Plex Mono', 'Open Sans', 'monospace']
            },
            keyframes: {
                shimmer: {
                    '100%': {
                        transform: 'translateX(100%)'
                    }
                }
            }
        }
    },
    plugins: []
};
