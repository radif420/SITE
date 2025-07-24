import { NextRequest, NextResponse } from 'next/server';
import { sampleProducts } from '@/lib/data';
import { loadProducts, saveProducts } from '@/lib/storage';

// In-memory storage for demo purposes
// In production, this would be replaced with a database
let products = [...sampleProducts];

export async function GET() {
  try {
    // Try to load from Supabase first
    const supabaseProducts = await loadProducts();
    if (supabaseProducts.length > 0) {
      return NextResponse.json(supabaseProducts);
    }
    
    // Fallback to in-memory products
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, image, description, unit } = body;

    if (!name || !price || !image || !description || !unit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      image,
      description,
      unit
    };

    products.push(newProduct);
    
    // Save to Supabase
    await saveProducts(products);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}