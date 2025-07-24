import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SiteConfigProvider } from '@/contexts/SiteConfigContext';
import ThemeProvider from '@/components/ThemeProvider';
import Navigation from '@/components/Navigation';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentSiteConfig } from '@/lib/siteConfig';

const inter = Inter({ subsets: ['latin'] });

const siteConfig = getCurrentSiteConfig();

export const metadata: Metadata = {
  title: 'Pushti Bhai - Fresh Products Delivered',
  description: siteConfig.siteDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <SiteConfigProvider>
            <LanguageProvider>
              <NotificationProvider>
                <AdminProvider>
                  <Navigation />
                  <main>{children}</main>
                  <Toaster richColors position="top-right" />
                </AdminProvider>
              </NotificationProvider>
            </LanguageProvider>
          </SiteConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}