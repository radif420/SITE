'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig, getWhatsAppUrl } from '@/lib/siteConfig';
import { useLanguage } from '@/contexts/LanguageContext';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function WhatsAppButton({ 
  message, 
  className = '', 
  variant = 'default',
  size = 'md' 
}: WhatsAppButtonProps) {
  const { language } = useLanguage();
  
  const buttonText = language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার করুন' : 'Order on WhatsApp';
  
  const handleWhatsAppClick = () => {
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      variant={variant}
      size="default"
      className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {buttonText}
    </Button>
  );
}