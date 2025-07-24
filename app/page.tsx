'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import ProductCard from '@/components/ProductCard';
import ContactInfo from '@/components/ContactInfo';
import WhatsAppButton from '@/components/WhatsAppButton';
import Logo from '@/components/Logo';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Star, Truck, Shield } from 'lucide-react';
import { loadProducts } from '@/lib/storage';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  unit: string;
}

export default function Home() {
  const { t } = useLanguage();
  const { config: siteConfig, isLoading: configLoading } = useSiteConfig();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Try to load from Supabase first, fallback to API
      const data = await loadProducts();
      if (data.length > 0) {
        setProducts(data);
      } else {
        // Fallback to API
        const response = await fetch('/api/products');
        if (response.ok) {
          const apiData = await response.json();
          setProducts(apiData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || configLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: 'var(--color-primary)' }}
          ></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Star,
      title: t('freshProducts'),
      description: 'Premium quality products sourced daily'
    },
    {
      icon: Shield,
      title: t('qualityGuaranteed'),
      description: '100% satisfaction guarantee'
    },
    {
      icon: Truck,
      title: t('fastDelivery'),
      description: 'Same day delivery available'
    }
  ];
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Hero Section */}
      <section 
        className="text-white py-16 relative overflow-hidden"
        style={{ 
          background: siteConfig.coverPhoto?.path 
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${siteConfig.coverPhoto.path})`
            : `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Logo size="lg" className="justify-center text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            {t('welcomeMessage')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {siteConfig.siteDescription}
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
            <Package className="h-5 w-5" />
            <span className="font-medium">{t('tagline')}</span>
          </div>
          
          {siteConfig.features.enableWhatsAppOrdering && (
            <div className="mt-8">
              <WhatsAppButton 
                message={`Hello ${siteConfig.siteName}! I want to explore your products and place an order.`}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
              />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}
                >
                  <feature.icon 
                    className="h-8 w-8"
                    style={{ color: 'var(--color-primary)' }}
                  />
                </div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--color-text)' }}
            >
              {t('productCatalog')}
            </h2>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Discover our wide selection of fresh and quality products, carefully sourced for your satisfaction.
            </p>
          </div>

          {products.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 
                  className="text-lg font-medium mb-2"
                  style={{ color: 'var(--color-text)' }}
                >
                  No products available
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Please check back later for our latest products.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="text-white py-12"
        style={{ backgroundColor: 'var(--color-text)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <Logo size="md" className="mb-4 text-white" />
              <p className="text-gray-300">
                {siteConfig.siteDescription}
              </p>
              
              {siteConfig.features.enableWhatsAppOrdering && (
                <div className="mt-4">
                  <WhatsAppButton 
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-green-600"
                  />
                </div>
              )}
            </div>
            
            <div>
              <ContactInfo />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t('about')} {siteConfig.siteName}
              </h3>
              <p className="text-gray-300">
                We are committed to providing fresh, nutritious products with the highest quality standards. 
                Our mission is to make healthy eating accessible to everyone.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2025 {siteConfig.siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}