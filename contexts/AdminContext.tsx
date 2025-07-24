'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { siteConfig } from '@/lib/siteConfig';

interface AdminContextType {
  isAdminLoggedIn: boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const loginAdmin = (username: string, password: string): boolean => {
    // In production, this should validate against backend/environment variables
    if (username === siteConfig.admin.username && password === siteConfig.admin.password) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}