import { NextRequest, NextResponse } from 'next/server';
import { loadOrders, saveOrder } from '@/lib/storage';

// In-memory storage for demo purposes
// In production, this would be replaced with a database
let orders: any[] = [];

export async function GET() {
  try {
    // Try to load from Supabase first
    const supabaseOrders = await loadOrders();
    if (supabaseOrders.length > 0) {
      // Sort orders by date (newest first)
      const sortedOrders = supabaseOrders.sort((a, b) => 
        new Date(b.created_at || b.orderDate).getTime() - new Date(a.created_at || a.orderDate).getTime()
      );
      return NextResponse.json(sortedOrders);
    }
    
    // Sort orders by date (newest first)
    const sortedOrders = orders.sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
    return NextResponse.json(sortedOrders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      phoneNumber, 
      district, 
      thana, 
      quantity, 
      productId, 
      productName, 
      productPrice, 
      orderDate 
    } = body;

    if (!customerName || !phoneNumber || !district || !thana || !quantity || !productId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate phone number format
    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const newOrder = {
      id: Date.now().toString(),
      customerName,
      phoneNumber,
      district,
      thana,
      quantity,
      productId,
      productName,
      productPrice,
      orderDate: orderDate || new Date().toISOString()
    };

    orders.push(newOrder);
    
    // Save to Supabase
    await saveOrder(newOrder);
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}