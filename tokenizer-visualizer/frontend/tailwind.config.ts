/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#0a0a14',
                    card: '#0f0f1e',
                    border: '#1e1e3a',
                    input: '#080812',
                    hover: '#12122a',
                },
                neon: {
                    purple: '#7c6af5',
                    pink: '#f56a9a',
                    green: '#6af5a0',
                    yellow: '#f5c96a',
                    cyan: '#6ac8f5',
                    orange: '#f5896a',
                }
            },
            fontFamily: {
                sans: ['system-ui', 'ui-sans-serif', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
