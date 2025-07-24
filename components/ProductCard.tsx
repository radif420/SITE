'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OrderModal from './OrderModal';
import WhatsAppButton from './WhatsAppButton';
import { siteConfig } from '@/lib/siteConfig';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  unit: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const whatsappMessage = `Hello ${siteConfig.siteName}! I want to order ${product.name} (৳${product.price}/${product.unit}). Please confirm availability and delivery details.`;
  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <Badge 
              className="absolute top-2 right-2 text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              ৳{product.price}/{product.unit}
            </Badge>
          </div>
          
          <div className="p-4">
            <h3 
              className="font-semibold text-lg mb-2 text-gray-900 group-hover:transition-colors"
              style={{ '--hover-color': 'var(--color-primary)' } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
            >
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span 
                className="text-2xl font-bold"
                style={{ color: 'var(--color-primary)' }}
              >
                ৳{product.price}
              </span>
              <span className="text-sm text-gray-500">
                {t('unit')}: {product.unit}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 px-4 pb-4">
          <div className="w-full space-y-2">
            <Button 
              onClick={() => setIsOrderModalOpen(true)}
              className="w-full text-white transition-colors"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                '--hover-bg': 'var(--color-primary-dark)'
              } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
            >
              {t('orderNow')}
            </Button>
            
            {siteConfig.features.enableWhatsAppOrdering && (
              <WhatsAppButton
                message={whatsappMessage}
                variant="outline"
                size="sm"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              />
            )}
          </div>
        </CardFooter>
      </Card>

      <OrderModal
        product={product}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
}