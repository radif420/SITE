// Site Configuration File
// Edit this file to customize your site easily

import { SiteSettings } from './storage';

// Default configuration - will be overridden by saved settings
export const siteConfig = {
  // Site Identity
  siteName: 'Pushti Bhai',
  siteDescription: 'Fresh and nutritious products delivered to your doorstep',
  tagline: 'Fresh • Nutritious • Delivered',
  
  // Theme Colors (use hex codes)
  theme: {
    primary: '#4CAF50',      // Main brand color (green)
    primaryDark: '#388E3C',  // Darker shade for hover states
    secondary: '#FF9800',    // Secondary accent color (orange)
    success: '#4CAF50',      // Success messages
    warning: '#FF9800',      // Warning messages
    error: '#F44336',        // Error messages
    background: '#F5F5F5',   // Page background
    surface: '#FFFFFF',      // Card/surface background
    text: '#212121',         // Primary text color
    textSecondary: '#757575', // Secondary text color
  },
  
  // Contact Information
  contact: {
    phone: '+880 1560044565',
    whatsapp: '+8801560044565', // WhatsApp number (without + for URL)
    whatsappDisplayText: '+880 1560044565',
    email: 'jahirradif@gmail.com',
    address: 'Dhaka, Bangladesh',
    
    // Delivery Areas
    deliveryAreas: [
      'Dhaka City',
      'Chittagong',
      'Sylhet',
      'Rajshahi',
      'Khulna',
      'Barisal'
    ],
    
    // Business Hours
    businessHours: {
      en: 'Daily 8:00 AM - 10:00 PM',
      bn: 'প্রতিদিন সকাল ৮টা - রাত ১০টা'
    },
    
    // Social Media
    social: {
      facebook: 'https://facebook.com/pustibhai',
      instagram: 'https://instagram.com/pustibhai',
      youtube: 'https://youtube.com/@pustibhai'
    }
  },
  
  // Logo Configuration
  logo: {
    // To upload your logo:
    // 1. Add your logo file to the 'public' folder (e.g., public/logo.png)
    // 2. Update the path below (e.g., '/logo.png')
    // 3. Recommended size: 120x40px for header, 200x80px for footer
    path: '/logo.png', // Change this to your logo file path
    alt: 'Pushti Bhai Logo',
    width: 120,
    height: 40
  },
  
  // Cover Photo Configuration
  coverPhoto: {
    path: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', // Default cover photo
    alt: 'Fresh Products Cover'
  },
  
  // Features
  features: {
    enableMultiLanguage: true,
    enableWhatsAppOrdering: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false
  },
  
  // Admin Credentials (for demo - use environment variables in production)
  admin: {
    username: 'admin',
    password: 'pustibhai2025' // Change this password!
  }
};

// Global site configuration that can be updated
export let currentSiteConfig = { ...siteConfig };

// Update the current site configuration
export const updateSiteConfig = (newConfig: Partial<SiteSettings>) => {
  currentSiteConfig = { ...currentSiteConfig, ...newConfig };
};

// Get current site configuration
export const getCurrentSiteConfig = () => currentSiteConfig;

// Helper function to get WhatsApp URL
export const getWhatsAppUrl = (message?: string) => {
  const defaultMessage = `Hello ${currentSiteConfig.siteName}! I want to place an order.`;
  const encodedMessage = encodeURIComponent(message || defaultMessage);
  return `https://wa.me/${currentSiteConfig.contact.whatsapp}?text=${encodedMessage}`;
};

// Helper function to get phone URL
export const getPhoneUrl = () => {
  return `tel:${currentSiteConfig.contact.phone}`;
};

// Helper function to get email URL
export const getEmailUrl = (subject?: string) => {
  const defaultSubject = `Order Inquiry - ${currentSiteConfig.siteName}`;
  const encodedSubject = encodeURIComponent(subject || defaultSubject);
  return `mailto:${currentSiteConfig.contact.email}?subject=${encodedSubject}`;
};
