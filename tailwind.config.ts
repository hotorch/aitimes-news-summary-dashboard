import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Shadcn/ui 기본 컬러
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // AI Times 디자인 시스템 - 오렌지 기반 팔레트
        primary: {
          50: '#FFF5F1',    // Ultra light peach
          100: '#FFE8DD',   // Light peach
          200: '#FFD1BB',   // Soft peach
          300: '#FFB088',   // Light orange
          400: '#FF8A55',   // Medium orange
          500: '#FF6B35',   // Primary brand orange
          600: '#E25822',   // Deep orange
          700: '#C4470E',   // Dark orange
          800: '#A13908',   // Very dark orange
          900: '#7D2D06',   // Darkest orange
          DEFAULT: '#FF6B35',
          foreground: '#FFFFFF',
        },
        
        secondary: {
          50: '#FFFCF0',    // Ultra light yellow
          100: '#FFF8DC',   // Light cream
          200: '#FFF0B3',   // Soft yellow
          300: '#FFE580',   // Light yellow
          400: '#FFD94D',   // Medium yellow
          500: '#F7931E',   // Secondary brand yellow
          600: '#E6820B',   // Deep yellow
          700: '#CC6F00',   // Dark yellow
          800: '#B35C00',   // Very dark yellow
          900: '#994A00',   // Darkest yellow
          DEFAULT: '#F7931E',
          foreground: '#FFFFFF',
        },
        
        accent: {
          50: '#FFF3F1',    // Ultra light red
          100: '#FFE4DF',   // Light red
          200: '#FFC5B8',   // Soft red
          300: '#FF9D88',   // Light coral
          400: '#FF6B55',   // Medium coral
          500: '#E25822',   // Accent red-orange
          600: '#C4470E',   // Deep red
          700: '#A63808',   // Dark red
          800: '#8B2D06',   // Very dark red
          900: '#702405',   // Darkest red
          DEFAULT: '#E25822',
          foreground: '#FFFFFF',
        },
        
        neutral: {
          50: '#FAFAFA',    // Almost white
          100: '#F5F5F5',   // Light gray
          200: '#E5E5E5',   // Soft gray
          300: '#D4D4D4',   // Medium light gray
          400: '#A3A3A3',   // Medium gray
          500: '#737373',   // Base gray
          600: '#525252',   // Dark gray
          700: '#404040',   // Very dark gray
          800: '#262626',   // Almost black
          900: '#171717',   // Black
        },
        
        // Shadcn/ui 호환성을 위한 매핑
        destructive: {
          DEFAULT: '#E25822',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#737373',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#171717',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#171717',
        },
      },
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), 
    require('@tailwindcss/typography')
  ],
} satisfies Config;

export default config;
