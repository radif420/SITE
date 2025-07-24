'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Package, ShoppingCart, Plus, List } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdminLoggedIn } = useAdmin();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, router]);

  if (!isAdminLoggedIn) {
    return null;
  }

  const dashboardCards = [
    {
      title: t('products'),
      icon: Package,
      description: 'Manage your product catalog',
      href: '/admin/products',
      color: 'bg-blue-500'
    },
    {
      title: t('orders'),
      icon: ShoppingCart,
      description: 'View and manage customer orders',
      href: '/admin/orders',
      color: 'bg-green-500'
    },
    {
      title: 'Settings',
      icon: List,
      description: 'Customize website appearance and settings',
      href: '/admin/settings',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard')}
          </h1>
          <p className="text-gray-600">
            Welcome to your admin dashboard. Manage your products and orders from here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card) => (
            <Link key={card.href} href={card.href}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/products/new">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addProduct')}
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="outline" className="w-full justify-start">
                  <List className="h-4 w-4 mr-2" />
                  {t('products')} List
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t('orders')} List
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Admin Status</span>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm font-medium text-gray-900">Just now</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Health</span>
                  <span className="text-sm font-medium text-green-600">Good</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}