/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#2d545e',   // Night Blue
                    secondary: '#e1b382', // Sand Tan
                    accent: '#c89666',    // Sand Tan Shadow
                    dark: '#12343b',      // Night Blue Shadow
                    light: '#fdfbf9',     // Ultra light sand for background
                    muted: '#7a8f94'      // Muted night blue
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            }
        },
    },
    plugins: [],
}