'use client';

import { useEffect } from 'react';
import { generateThemeCSS } from '@/lib/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inject theme CSS variables
    const styleElement = document.createElement('style');
    styleElement.textContent = generateThemeCSS();
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return <>{children}</>;
}