/** @type {import('tailwindcss').Config} */
module.exports = {
  // THIS IS THE MOST IMPORTANT PART
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Extending fonts to use your custom fonts
      fontFamily: {
        serif: ['Ubuntu', 'serif'], // Becomes .font-serif
        sans: ['Poppins', 'sans-serif'],    // Becomes .font-sans
      },
      // Extending colors to use your custom theme palette
      colors: {
        primary: 'var(--theme-primary)',
        'primary-light': 'var(--theme-primary-light)',
        secondary: 'var(--theme-secondary)',
        accent: 'var(--theme-accent)',
        'light-bg': 'var(--light-bg-color)',
        'dark-bg': 'var(--dark-bg-color)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-on-dark': 'var(--text-on-dark)',
        'border-color': 'var(--border-color)',
      },
      // Extending box-shadow to use your custom shadow
      boxShadow: {
        'custom': '0 10px 25px -5px var(--shadow-color), 0 8px 10px -6px var(--shadow-color)',
        'custom-hover': '0 20px 30px -5px var(--shadow-hover), 0 10px 15px -6px var(--shadow-hover)',
        'card': '0 4px 6px -1px var(--card-shadow-color), 0 2px 4px -2px var(--card-shadow-color)',
      },
      // Optional: Defining the gradient for easy reuse
      backgroundImage: {
        'theme-gradient': 'linear-gradient(135deg, var(--theme-accent) 20%, var(--theme-primary) 80%)',
      }
      
    },
  },
  plugins: [],
}