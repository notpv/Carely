module.exports = {
  darkMode: ['class', 'class'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				light: '#9179ff',
  				DEFAULT: '#5227ff',
  				dark: '#3a00ff',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				light: '#fca5a5',
  				DEFAULT: 'hsl(var(--secondary))',
  				dark: '#b91c1c',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			background: '#0A0A0A',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'rgba(15, 15, 15, 0.8)',
  				hover: 'rgba(25, 25, 25, 0.9)',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Raleway',
  				'sans-serif'
  			],
  			heading: [
  				'Montserrat',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		backdropBlur: {
  			xs: '2px',
  		},
  		transitionDuration: {
  			'400': '400ms',
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-out forwards',
  			'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
  			'scale-in': 'scaleIn 0.3s ease-out forwards',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
