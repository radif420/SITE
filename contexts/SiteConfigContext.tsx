'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { currentSiteConfig, updateSiteConfig } from '@/lib/siteConfig';
import { loadSiteSettings, saveSiteSettings, SiteSettings } from '@/lib/storage';
import { generateThemeCSS } from '@/lib/theme';

interface SiteConfigContextType {
  config: any;
  updateConfig: (newConfig: Partial<SiteSettings>) => Promise<boolean>;
  isLoading: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState(currentSiteConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await loadSiteSettings();
        if (savedSettings) {
          updateSiteConfig(savedSettings);
          setConfig({ ...currentSiteConfig, ...savedSettings });
          
          // Apply theme changes immediately
          const styleElement = document.createElement('style');
          styleElement.textContent = generateThemeCSS(savedSettings.theme);
          document.head.appendChild(styleElement);
        }
      } catch (error) {
        console.error('Failed to load site settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateConfigAndSave = async (newConfig: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const updatedConfig = { ...config, ...newConfig };
      
      // Save to Supabase
      const success = await saveSiteSettings(updatedConfig);
      
      if (success) {
        // Update local state
        updateSiteConfig(updatedConfig);
        setConfig(updatedConfig);
        
        // Apply theme changes if theme was updated
        if (newConfig.theme) {
          const styleElement = document.createElement('style');
          styleElement.textContent = generateThemeCSS(newConfig.theme);
          document.head.appendChild(styleElement);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to update site config:', error);
      return false;
    }
  };

  return (
    <SiteConfigContext.Provider value={{
      config,
      updateConfig: updateConfigAndSave,
      isLoading
    }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
}