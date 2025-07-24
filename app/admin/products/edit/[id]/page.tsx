'use client';
import { supabase } from '@/lib/supabaseClient';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  unit: string;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { isAdminLoggedIn } = useAdmin();
  const { t } = useLanguage();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    unit: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
      return;
    }
    fetchProduct();
  }, [isAdminLoggedIn, router, params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setFormData({
          name: data.name,
          price: data.price.toString(),
          image: data.image,
          description: data.description,
          unit: data.unit
        });
        setImagePreview(data.image);
      } else {
        toast.error('Product not found');
        router.push('/admin/products');
      }
    } catch (error) {
      toast.error('Failed to fetch product');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'image') {
      setImagePreview(value);
    }
  };

  // --- Supabase Image Upload Handler ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(`public/${Date.now()}_${file.name}`, file, { upsert: true });

      if (error) {
        toast.error('Image upload failed');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      setImagePreview(publicUrl);
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, image: publicUrl }));
    }
  };
  // --- End Supabase Image Upload Handler ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image || !formData.description || !formData.unit) {
      toast.error(t('requiredField'));
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      const response = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        toast.success(t('productUpdated'));
        router.push('/admin/products');
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdminLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back')}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('editProduct')}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('editProduct')}: {product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">{t('productName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('productName')}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">{t('productPrice')} (৳) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">{t('productUnit')} *</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    placeholder="kg, ltr, pcs, etc."
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">{t('productImage')} *</Label>
                <div className="space-y-2">
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <div className="mb-4">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border mx-auto"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          id="imageFile"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-500">or</div>
                        <Input
                          id="imageUrl"
                          type="url"
                          value={formData.image}
                          onChange={(e) => handleInputChange('image', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Upload an image file or enter an image URL
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t('productDescription')} *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t('productDescription')}
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Link href="/admin/products" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    {t('cancel')}
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? t('loading') : t('save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
