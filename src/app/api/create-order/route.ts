import { NextRequest, NextResponse } from 'next/server';

// Mock Razorpay order creation for development
// In production, you would use the actual Razorpay SDK
export async function POST(request: NextRequest) {
  try {
    const { amount, currency } = await request.json();

    // Validate input
    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Amount and currency are required' },
        { status: 400 }
      );
    }

    // Mock order creation (replace with actual Razorpay integration)
    const order = {
      id: `order_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      entity: 'order',
      amount: amount * 100, // Amount in paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes: {},
      created_at: Math.floor(Date.now() / 1000)
    };

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// For production, use this implementation with actual Razorpay:
/*
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency } = await request.json();

    const options = {
      amount: amount * 100, // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
*/
