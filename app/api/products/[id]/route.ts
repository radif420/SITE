import { NextRequest, NextResponse } from 'next/server';
import { sampleProducts } from '@/lib/data';
import { loadProducts, saveProducts } from '@/lib/storage';

// In-memory storage for demo purposes
let products = [...sampleProducts];

// Helper function to get current products
const getCurrentProducts = async () => {
  const supabaseProducts = await loadProducts();
  return supabaseProducts.length > 0 ? supabaseProducts : products;
};
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentProducts = await getCurrentProducts();
    const product = currentProducts.find(p => p.id === params.id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, price, image, description, unit } = body;

    const currentProducts = await getCurrentProducts();
    const productIndex = currentProducts.findIndex(p => p.id === params.id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    currentProducts[productIndex] = {
      ...currentProducts[productIndex],
      name,
      price: parseFloat(price),
      image,
      description,
      unit
    };

    // Save updated products
    await saveProducts(currentProducts);
    products = currentProducts; // Update in-memory fallback
    
    return NextResponse.json(currentProducts[productIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentProducts = await getCurrentProducts();
    const productIndex = currentProducts.findIndex(p => p.id === params.id);
    
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    currentProducts.splice(productIndex, 1);
    
    // Save updated products
    await saveProducts(currentProducts);
    products = currentProducts; // Update in-memory fallback
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}