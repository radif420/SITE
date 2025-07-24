'use client';

import { supabase } from '@/lib/supabaseClient';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ArrowLeft, Save, Palette, Globe, Phone, MapPin, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient'; // <-- Supabase import

export default function SettingsPage() {
  const { isAdminLoggedIn } = useAdmin();
  const { t } = useLanguage();
  const { config: siteConfig, updateConfig } = useSiteConfig();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Site Settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: siteConfig.siteName || 'Pushti Bhai',
    siteDescription: siteConfig.siteDescription || 'Fresh and nutritious products delivered to your doorstep',
    tagline: siteConfig.tagline || 'Fresh • Nutritious • Delivered'
  });

  // Theme Settings
  const [themeSettings, setThemeSettings] = useState({
    primary: siteConfig.theme?.primary || '#4CAF50',
    primaryDark: siteConfig.theme?.primaryDark || '#388E3C',
    secondary: siteConfig.theme?.secondary || '#FF9800',
    success: siteConfig.theme?.success || '#4CAF50',
    warning: siteConfig.theme?.warning || '#FF9800',
    error: siteConfig.theme?.error || '#F44336',
    background: siteConfig.theme?.background || '#F5F5F5',
    surface: siteConfig.theme?.surface || '#FFFFFF',
    text: siteConfig.theme?.text || '#212121',
    textSecondary: siteConfig.theme?.textSecondary || '#757575'
  });

  // Contact Settings
  const [contactSettings, setContactSettings] = useState({
    phone: siteConfig.contact?.phone || '+880 1712-345678',
    whatsapp: siteConfig.contact?.whatsapp || '+8801712345678',
    whatsappDisplayText: siteConfig.contact?.whatsappDisplayText || '+880 1712-345678',
    email: siteConfig.contact?.email || 'order@pustibhai.com',
    address: siteConfig.contact?.address || 'Dhaka, Bangladesh'
  });

  // Delivery Areas
  const [deliveryAreas, setDeliveryAreas] = useState(
    siteConfig.contact?.deliveryAreas || ['Dhaka City', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal']
  );
  const [newArea, setNewArea] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(siteConfig.logo?.path || null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    siteConfig.coverPhoto?.path || null
  );
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(
    siteConfig.coverPhoto?.path || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
  );
  const [newThana, setNewThana] = useState('');
  const [selectedDistrictForThana, setSelectedDistrictForThana] = useState('');
  const [thanasByDistrict, setThanasByDistrict] = useState<Record<string, string[]>>(
    require('@/lib/data').thanasByDistrict
  );

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
    }
    
    // Update state when siteConfig changes
    setSiteSettings({
      siteName: siteConfig.siteName || 'Pushti Bhai',
      siteDescription: siteConfig.siteDescription || 'Fresh and nutritious products delivered to your doorstep',
      tagline: siteConfig.tagline || 'Fresh • Nutritious • Delivered'
    });
    
    setThemeSettings({
      primary: siteConfig.theme?.primary || '#4CAF50',
      primaryDark: siteConfig.theme?.primaryDark || '#388E3C',
      secondary: siteConfig.theme?.secondary || '#FF9800',
      success: siteConfig.theme?.success || '#4CAF50',
      warning: siteConfig.theme?.warning || '#FF9800',
      error: siteConfig.theme?.error || '#F44336',
      background: siteConfig.theme?.background || '#F5F5F5',
      surface: siteConfig.theme?.surface || '#FFFFFF',
      text: siteConfig.theme?.text || '#212121',
      textSecondary: siteConfig.theme?.textSecondary || '#757575'
    });
    
    setCoverPhotoPreview(siteConfig.coverPhoto?.path || null);
    setCoverPhotoUrl(siteConfig.coverPhoto?.path || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg');
    setLogoPreview(siteConfig.logo?.path || null);
  }, [isAdminLoggedIn, router, siteConfig]);

  const handleSiteSettingsChange = (field: string, value: string) => {
    setSiteSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = (field: string, value: string) => {
    setThemeSettings(prev => ({ ...prev, [field]: value }));
    // Apply theme changes immediately
    document.documentElement.style.setProperty(`--color-${field.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
  };

  const handleContactChange = (field: string, value: string) => {
    setContactSettings(prev => ({ ...prev, [field]: value }));
  };

  const addDeliveryArea = () => {
    if (newArea.trim() && !deliveryAreas.includes(newArea.trim())) {
      setDeliveryAreas(prev => [...prev, newArea.trim()]);
      setNewArea('');
    }
  };

  const removeDeliveryArea = (area: string) => {
    setDeliveryAreas(prev => prev.filter(a => a !== area));
  };

  // --- Supabase Logo Upload Handler ---
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { data, error } = await supabase.storage
        .from('logos') // Make sure you have a 'logos' bucket in Supabase Storage
        .upload(`public/${Date.now()}_${file.name}`, file, { upsert: true });

      if (error) {
        toast.error('Logo upload failed');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(data.path);

      setLogoPreview(publicUrl);
    }
  };
  // --- End Supabase Logo Upload Handler ---

 const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('cover-photos') // Make sure you have a 'cover-photos' bucket in Supabase Storage
      .upload(`public/${Date.now()}_${file.name}`, file, { upsert: true });

    if (error) {
      toast.error('Cover photo upload failed');
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('cover-photos')
      .getPublicUrl(data.path);

    setCoverPhotoPreview(publicUrl);
    setCoverPhotoUrl(publicUrl);
  }
};
  const handleCoverPhotoUrlChange = (url: string) => {
    setCoverPhotoUrl(url);
    setCoverPhotoPreview(url);
  };
  const addThanaToDistrict = () => {
    if (newThana.trim() && selectedDistrictForThana && !thanasByDistrict[selectedDistrictForThana]?.includes(newThana.trim())) {
      setThanasByDistrict(prev => ({
        ...prev,
        [selectedDistrictForThana]: [...(prev[selectedDistrictForThana] || []), newThana.trim()]
      }));
      setNewThana('');
    }
  };

  const removeThanaFromDistrict = (district: string, thana: string) => {
    setThanasByDistrict(prev => ({
      ...prev,
      [district]: prev[district]?.filter(t => t !== thana) || []
    }));
  };

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    try {
      const updatedConfig = {
        ...siteSettings,
        theme: themeSettings,
        contact: {
          ...contactSettings,
          deliveryAreas,
          businessHours: siteConfig.contact?.businessHours || {
            en: 'Daily 8:00 AM - 10:00 PM',
            bn: 'প্রতিদিন সকাল ৮টা - রাত ১০টা'
          }
        },
        logo: {
          path: logoPreview || siteConfig.logo?.path || '/logo.png',
          alt: siteConfig.logo?.alt || 'Logo',
          width: siteConfig.logo?.width || 120,
          height: siteConfig.logo?.height || 40
        },
        coverPhoto: {
          path: coverPhotoUrl,
          alt: 'Cover Photo'
        },
        updatedAt: new Date().toISOString()
      };

      const success = await updateConfig(updatedConfig);
      
      if (success) {
        toast.success('Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }

    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdminLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back')}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Website Settings
          </h1>
        </div>

        <Tabs defaultValue="site" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="site" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Site Info
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="cover" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Cover
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site">
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo">Logo Upload</Label>
                  <div className="space-y-2">
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <div className="mb-2">
                          {logoPreview ? (
                            <img 
                              src={logoPreview} 
                              alt="Logo preview" 
                              className="h-16 w-auto mx-auto border rounded"
                            />
                          ) : (
                            <div className="h-16 w-16 mx-auto bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Logo</span>
                            </div>
                          )}
                        </div>
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Upload PNG, JPG, or SVG. Recommended size: 120x40px
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) => handleSiteSettingsChange('siteName', e.target.value)}
                    placeholder="Your Site Name"
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={siteSettings.siteDescription}
                    onChange={(e) => handleSiteSettingsChange('siteDescription', e.target.value)}
                    placeholder="Brief description of your business"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={siteSettings.tagline}
                    onChange={(e) => handleSiteSettingsChange('tagline', e.target.value)}
                    placeholder="Your business tagline"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* ...rest of your code remains unchanged... */}
        </Tabs>

        <div className="flex justify-end pt-6">
          <Button 
            onClick={handleSaveSettings}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
