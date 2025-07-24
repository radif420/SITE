// Theme utilities and CSS variable generator
import { getCurrentSiteConfig } from './siteConfig';

// Generate CSS custom properties from theme config
export const generateThemeCSS = (customTheme?: any) => {
  const { theme } = customTheme ? { theme: customTheme } : getCurrentSiteConfig();
  
  return `
    :root {
      --color-primary: ${theme.primary};
      --color-primary-dark: ${theme.primaryDark};
      --color-secondary: ${theme.secondary};
      --color-success: ${theme.success};
      --color-warning: ${theme.warning};
      --color-error: ${theme.error};
      --color-background: ${theme.background};
      --color-surface: ${theme.surface};
      --color-text: ${theme.text};
      --color-text-secondary: ${theme.textSecondary};
      
      /* RGB values for opacity usage */
      --color-primary-rgb: ${hexToRgb(theme.primary)};
      --color-primary-dark-rgb: ${hexToRgb(theme.primaryDark)};
      --color-secondary-rgb: ${hexToRgb(theme.secondary)};
    }
  `;
};

// Convert hex to RGB
export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ].join(', ');
};

// Tailwind CSS class generator for dynamic colors
export const getThemeClasses = () => {
  return {
    primary: 'text-[var(--color-primary)]',
    primaryBg: 'bg-[var(--color-primary)]',
    primaryHover: 'hover:bg-[var(--color-primary-dark)]',
    secondary: 'text-[var(--color-secondary)]',
    secondaryBg: 'bg-[var(--color-secondary)]',
    success: 'text-[var(--color-success)]',
    successBg: 'bg-[var(--color-success)]',
    warning: 'text-[var(--color-warning)]',
    warningBg: 'bg-[var(--color-warning)]',
    error: 'text-[var(--color-error)]',
    errorBg: 'bg-[var(--color-error)]',
    surface: 'bg-[var(--color-surface)]',
    text: 'text-[var(--color-text)]',
    textSecondary: 'text-[var(--color-text-secondary)]'
  };
};