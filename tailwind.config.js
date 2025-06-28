/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.html"],
    theme: {
        extend: {},
    },
    plugins: [],
    theme: {
        extend: {
            colors: {
                '2b': '#2B2B2B',
                'd4': '#D4D4D4',
            },
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
            }
        }
    }
}