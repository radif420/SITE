'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNotifications } from '@/contexts/NotificationContext';
import LanguageToggle from './LanguageToggle';
import Logo from './Logo';
import NotificationBell from './NotificationBell';
import { Button } from '@/components/ui/button';
import { Settings, LogOut } from 'lucide-react';

export default function Navigation() {
  const { t } = useLanguage();
  const { isAdminLoggedIn, logoutAdmin } = useAdmin();
  const { addNotification } = useNotifications();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          
          <div className="flex items-center gap-4">
            <LanguageToggle />
            
            {isAdminLoggedIn && <NotificationBell />}
            
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t('dashboard')}
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Button 
                  onClick={logoutAdmin}
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 text-[var(--color-error)] hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  {t('logout')}
                </Button>
              </div>
            ) : (
              <Link href="/admin/login">
                <Button variant="ghost" size="sm">
                  {t('admin')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}