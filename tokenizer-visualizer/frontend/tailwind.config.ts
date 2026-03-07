import type { Config } from 'tailwindcss'

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Fira Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            colors: {
                dark: {
                    bg: '#020617',     // Deepest OLED black
                    card: '#0F172A',   // Slate 900
                    border: '#1E293B', // Slate 800
                },
                accent: {
                    primary: '#7c6af5',   // Neon Purple
                    secondary: '#f56a9a', // Neon Pink
                    success: '#22C55E',   // UX recommended success
                },
                token: {
                    word: '#7c6af5',      // Purple
                    subword: '#f5c96a',   // Gold
                    punctuation: '#f56a7c', // Red-Pink
                    special: '#6ac8f5',     // Light Blue
                    number: '#6af5a0',      // Mint Green
                },
            },
            boxShadow: {
                'neon-glow': '0 0 10px rgba(124, 106, 245, 0.4)',
                'neon-glow-hover': '0 0 16px rgba(124, 106, 245, 0.6)',
            }
        },
    },
    plugins: [],
} satisfies Config
