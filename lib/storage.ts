// Persistent storage utilities for saving changes online
import { supabase } from './supabaseClient';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url_here' &&
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your_supabase_anon_key_here';
};

export interface SiteSettings {
  id?: string;
  siteName: string;
  siteDescription: string;
  tagline: string;
  theme: {
    primary: string;
    primaryDark: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    whatsappDisplayText: string;
    email: string;
    address: string;
    deliveryAreas: string[];
    businessHours: {
      en: string;
      bn: string;
    };
  };
  logo: {
    path: string;
    alt: string;
    width: number;
    height: number;
  };
  coverPhoto: {
    path: string;
    alt: string;
  };
  updatedAt: string;
}

// Save site settings to Supabase
export const saveSiteSettings = async (settings: SiteSettings): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({
        id: 'main',
        ...settings,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving settings:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// Load site settings from Supabase
export const loadSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading settings:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

// Save products to Supabase
export const saveProducts = async (products: any[]): Promise<boolean> => {
  try {
    // Clear existing products
    await supabase.from('products').delete().neq('id', '');

    // Insert new products
    const { error } = await supabase
      .from('products')
      .insert(products.map(product => ({
        ...product,
        updated_at: new Date().toISOString()
      })));

    if (error) {
      console.error('Error saving products:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

// Load products from Supabase
export const loadProducts = async (): Promise<any[]> => {
  try {
    // Check if Supabase is configured, if not use in-memory storage
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using in-memory storage');
      return inMemoryProducts;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.log('Supabase unavailable, falling back to in-memory storage');
    return inMemoryProducts;
  }
};

// Save orders to Supabase
export const saveOrder = async (order: any): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .insert({
        ...order,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving order:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving order:', error);
    return false;
  }
};

// Load orders from Supabase
export const loadOrders = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading orders:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};