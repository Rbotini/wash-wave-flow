import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				water: {
					light: 'hsl(var(--water-light))',
					medium: 'hsl(var(--water-medium))',
					dark: 'hsl(var(--water-dark))'
				},
				soap: 'hsl(var(--soap))',
				foam: 'hsl(var(--foam))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'water-fill': {
					'0%': { 
						'clip-path': 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
						opacity: '0.8'
					},
					'100%': { 
						'clip-path': 'polygon(0 100%, 100% 100%, 100% 0%, 0 0%)',
						opacity: '1'
					}
				},
				'bubble-float': {
					'0%': { 
						transform: 'translateY(20px) scale(0.8)',
						opacity: '0'
					},
					'50%': {
						opacity: '1'
					},
					'100%': { 
						transform: 'translateY(-20px) scale(1.2)',
						opacity: '0'
					}
				},
				'progress-shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'water-fill': 'water-fill var(--duration, 10s) ease-in-out forwards',
				'bubble-float': 'bubble-float 2s ease-in-out infinite',
				'progress-shimmer': 'progress-shimmer 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-water': 'var(--gradient-water)',
				'gradient-wash': 'var(--gradient-wash)',
				'gradient-clean': 'var(--gradient-clean)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
