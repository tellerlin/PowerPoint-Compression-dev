/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#007bff',
                    50: '#e6f2ff',
                    100: '#b3dcff',
                    200: '#80c6ff',
                    300: '#4db0ff',
                    400: '#1a9aff',
                    500: '#007bff',
                    600: '#0062cc',
                    700: '#004c99',
                    800: '#003366',
                    900: '#001a33'
                },
                secondary: {
                    DEFAULT: '#6c757d',
                    50: '#f8f9fa',
                    100: '#e9ecef',
                    200: '#dee2e6',
                    300: '#ced4da',
                    400: '#adb5bd',
                    500: '#6c757d',
                    600: '#495057',
                    700: '#343a40',
                    800: '#212529',
                    900: '#161a1d'
                },
                success: {
                    DEFAULT: '#28a745',
                    50: '#e6f4ea',
                    100: '#b3e0c1',
                    200: '#80cc98',
                    300: '#4db86e',
                    400: '#1aa445',
                    500: '#28a745',
                    600: '#1e8d37',
                    700: '#15732a',
                    800: '#0c591d',
                    900: '#034010'
                },
                danger: {
                    DEFAULT: '#dc3545',
                    50: '#fbe9ec',
                    100: '#f5c2c7',
                    200: '#ea9ba4',
                    300: '#df7480',
                    400: '#d44d5c',
                    500: '#dc3545',
                    600: '#b72c38',
                    700: '#92232b',
                    800: '#6e1a20',
                    900: '#4b1115'
                },
                warning: {
                    DEFAULT: '#ffc107',
                    50: '#fff3cd',
                    100: '#ffecb5',
                    200: '#ffe69c',
                    300: '#ffdf82',
                    400: '#ffd768',
                    500: '#ffc107',
                    600: '#d39e00',
                    700: '#aa7f00',
                    800: '#805f00',
                    900: '#574000'
                },
                info: {
                    DEFAULT: '#17a2b8',
                    50: '#e7f3f6',
                    100: '#b3dbe6',
                    200: '#80c3d6',
                    300: '#4dabc6',
                    400: '#1a93b6',
                    500: '#17a2b8',
                    600: '#12869a',
                    700: '#0c6b7b',
                    800: '#07505d',
                    900: '#03363e'
                },
                dark: {
                    DEFAULT: '#343a40',
                    50: '#f1f3f5',
                    100: '#dee2e6',
                    200: '#ced4da',
                    300: '#adb5bd',
                    400: '#6c757d',
                    500: '#343a40',
                    600: '#2b3036',
                    700: '#22262b',
                    800: '#191c1f',
                    900: '#0f1113'
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
                mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular']
            },
            boxShadow: {
                'custom-light': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'custom-dark': '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)'
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                }
            }
        }
    },
    plugins: []
};