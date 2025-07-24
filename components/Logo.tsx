'use client';

import Image from 'next/image';
import { siteConfig } from '@/lib/siteConfig';
import { ShoppingBag } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-16 w-auto'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  // Check if custom logo exists, otherwise use default icon + text
  const hasCustomLogo = false; // Set to true when you upload your logo

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {hasCustomLogo ? (
        <Image
          src={siteConfig.logo.path}
          alt={siteConfig.logo.alt}
          width={siteConfig.logo.width}
          height={siteConfig.logo.height}
          className={sizeClasses[size]}
          priority
        />
      ) : (
        <ShoppingBag 
          className={`${sizeClasses[size]} text-[var(--color-primary)]`} 
          style={{ color: 'var(--color-primary)' }}
        />
      )}
      
      {showText && (
        <span 
          className={`${textSizeClasses[size]} font-bold`}
          style={{ color: 'var(--color-primary)' }}
        >
          {siteConfig.siteName}
        </span>
      )}
    </div>
  );
}