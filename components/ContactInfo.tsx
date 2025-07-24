'use client';

import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { siteConfig, getWhatsAppUrl, getPhoneUrl, getEmailUrl } from '@/lib/siteConfig';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export default function ContactInfo() {
  const { language, t } = useLanguage();

  const contactItems = [
    {
      icon: Phone,
      label: language === 'bn' ? 'ফোন' : 'Phone',
      value: siteConfig.contact.phone,
      action: () => window.open(getPhoneUrl(), '_self'),
      color: 'text-blue-600'
    },
    {
      icon: MessageCircle,
      label: language === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp',
      value: siteConfig.contact.whatsappDisplayText,
      action: () => window.open(getWhatsAppUrl(), '_blank'),
      color: 'text-green-600'
    },
    {
      icon: Mail,
      label: language === 'bn' ? 'ইমেইল' : 'Email',
      value: siteConfig.contact.email,
      action: () => window.open(getEmailUrl(), '_self'),
      color: 'text-purple-600'
    },
    {
      icon: MapPin,
      label: language === 'bn' ? 'ঠিকানা' : 'Address',
      value: siteConfig.contact.address,
      action: null,
      color: 'text-red-600'
    },
    {
      icon: Clock,
      label: language === 'bn' ? 'ব্যবসার সময়' : 'Business Hours',
      value: siteConfig.contact.businessHours[language],
      action: null,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">
        {language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Information'}
      </h3>
      
      <div className="space-y-3">
        {contactItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <item.icon className={`h-5 w-5 ${item.color} flex-shrink-0`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-text)]">{item.label}</p>
              {item.action ? (
                <button
                  onClick={item.action}
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  {item.value}
                </button>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Areas */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-3 text-[var(--color-text)]">
          {language === 'bn' ? 'ডেলিভারি এলাকা' : 'Delivery Areas'}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {siteConfig.contact.deliveryAreas.map((area, index) => (
            <div
              key={index}
              className="text-sm text-[var(--color-text-secondary)] bg-[var(--color-background)] px-3 py-2 rounded-lg"
            >
              {area}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}