'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 transition-colors hover:bg-blue-50"
    >
      <Globe className="h-4 w-4" />
      {language === 'en' ? 'বাংলা' : 'English'}
    </Button>
  );
}