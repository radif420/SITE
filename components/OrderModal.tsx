'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { districts, thanasByDistrict, quantityOptions } from '@/lib/data';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  unit: string;
}

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    district: '',
    thana: '',
    quantity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'district' ? { thana: '' } : {})
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      toast.error(t('requiredField'));
      return false;
    }
    if (!formData.phoneNumber.trim() || !/^(\+88)?01[3-9]\d{8}$/.test(formData.phoneNumber)) {
      toast.error(t('invalidPhone'));
      return false;
    }
    if (!formData.district || !formData.thana || !formData.quantity) {
      toast.error(t('requiredField'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const orderData = {
        ...formData,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        orderDate: new Date().toISOString()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        toast.success(t('orderSuccess'));
        
        // Add notification for admin
        addNotification({
          type: 'order',
          title: 'New Order Received!',
          message: `Order from ${formData.customerName} for ${product.name} (${formData.quantity})`
        });
        
        setFormData({
          customerName: '',
          phoneNumber: '',
          district: '',
          thana: '',
          quantity: ''
        });
        onClose();
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableThanas = formData.district ? thanasByDistrict[formData.district] || [] : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {t('orderForm')} - {product.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">{t('customerName')} *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder={t('customerName')}
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">{t('phoneNumber')} *</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="01XXXXXXXXX"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="district">{t('district')} *</Label>
              <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDistrict')} />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="thana">{t('thana')} *</Label>
              <Select 
                value={formData.thana} 
                onValueChange={(value) => handleInputChange('thana', value)}
                disabled={!formData.district}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectThana')} />
                </SelectTrigger>
                <SelectContent>
                  {availableThanas.map((thana) => (
                    <SelectItem key={thana} value={thana}>
                      {thana}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="quantity">{t('quantity')} *</Label>
            <Select value={formData.quantity} onValueChange={(value) => handleInputChange('quantity', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectQuantity')} />
              </SelectTrigger>
              <SelectContent>
                {quantityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">{t('orderForm')} Summary:</h4>
            <p className="text-sm text-gray-600">{product.name}</p>
            <p className="text-sm text-gray-600">{t('price')}: ৳{product.price}/{product.unit}</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? t('loading') : t('placeOrder')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}