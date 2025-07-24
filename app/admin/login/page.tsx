'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const { t } = useLanguage();
  const { loginAdmin } = useAdmin();
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = loginAdmin(formData.username, formData.password);
      if (success) {
        toast.success('Login successful');
        router.push('/admin/dashboard');
      } else {
        toast.error(t('loginError'));
      }
    } catch (error) {
      toast.error(t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t('adminLogin')}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('username')}
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder={t('username')}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t('password')}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder={t('password')}
                required
                className="mt-1"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? t('loading') : t('login')}
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              Demo credentials: admin / pustibhai2025
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}