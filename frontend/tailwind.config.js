// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // CRITICAL: This path must be correct
    ],
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'], // For Inter font
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar'), // Required for custom scrollbar
    ],
}