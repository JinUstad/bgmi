import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const cashfreeApiUrl = process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION' 
      ? `https://api.cashfree.com/pg/orders/${order_id}`
      : `https://sandbox.cashfree.com/pg/orders/${order_id}`;

    // 1. Fetch order status from Cashfree
    const cashfreeResponse = await fetch(cashfreeApiUrl, {
      method: 'GET',
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID || '',
        'x-client-secret': process.env.CASHFREE_SECRET_KEY || '',
        'x-api-version': '2023-08-01',
      }
    });

    const orderData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      console.error('Cashfree verify error:', orderData);
      return NextResponse.json({ error: 'Failed to verify payment with Cashfree' }, { status: 500 });
    }

    // Determine our internal status based on Cashfree's order_status
    let internalStatus = 'pending';
    if (orderData.order_status === 'PAID') {
      internalStatus = 'verified';
    } else if (orderData.order_status === 'ACTIVE') {
      internalStatus = 'pending'; // Still paying
    } else {
      internalStatus = 'failed';
    }

    // 2. Update Supabase record
    const { error: dbError } = await supabase
      .from('registrations')
      .update({ payment_status: internalStatus })
      .eq('cashfree_order_id', order_id);

    if (dbError) {
      console.error('Database update error:', dbError);
      return NextResponse.json({ error: 'Failed to update registration status' }, { status: 500 });
    }

    return NextResponse.json({ 
      status: internalStatus,
      orderData
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
