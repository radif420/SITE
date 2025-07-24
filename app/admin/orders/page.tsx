'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, Package, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  district: string;
  thana: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: string;
  orderDate: string;
}

export default function OrdersPage() {
  const { isAdminLoggedIn } = useAdmin();
  const { t } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
      return;
    }
    
    fetchOrders();
  }, [isAdminLoggedIn, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back')}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('orderManagement')}
          </h1>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Orders will appear here when customers place them.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Information */}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-3">
                        {t('customer')} Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {order.customerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{order.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{order.thana}, {order.district}</span>
                        </div>
                      </div>
                    </div>

                    {/* Product Information */}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-3">
                        {t('product')} Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-900">{order.productName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">{t('price')}:</span>
                          <span className="font-medium text-blue-600">৳{order.productPrice}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">{t('quantity')}:</span>
                          <Badge variant="secondary">{order.quantity}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Order Information */}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-3">
                        Order Details
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-sm">Order ID:</span>
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {order.id.slice(0, 8)}
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          New Order
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}