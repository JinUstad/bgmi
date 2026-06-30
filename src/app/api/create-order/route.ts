import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generate a unique order ID
    const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    const orderAmount = 99; // Set your tournament registration fee here

    const cashfreeApiUrl = process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION' 
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';

    // 1. Create order on Cashfree
    const cashfreeResponse = await fetch(cashfreeApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID || '',
        'x-client-secret': process.env.CASHFREE_SECRET_KEY || '',
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: 'INR',
        customer_details: {
          customer_id: `cust_${crypto.randomBytes(4).toString('hex')}`,
          customer_name: data.fullName,
          customer_email: data.email || 'support@bgmiesports.in',
          customer_phone: data.mobileNumber,
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contact?order_id={order_id}`
        }
      })
    });

    const cashfreeData = await cashfreeResponse.json();

    if (!cashfreeResponse.ok) {
      console.error('Cashfree error:', cashfreeData);
      return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
    }

    // 2. Insert pending registration into Supabase
    const { error: dbError } = await supabase
      .from('registrations')
      .insert([
        {
          full_name: data.fullName,
          bgmi_id: data.bgmiId,
          team_name: data.teamName,
          mobile_number: data.mobileNumber,
          email: data.email,
          tournament_type: data.tournamentType,
          time_slot: data.timeSlot,
          message: data.message,
          cashfree_order_id: orderId,
          payment_status: 'pending'
        }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to save registration' }, { status: 500 });
    }

    // 3. Return payment session id to frontend
    return NextResponse.json({ 
      payment_session_id: cashfreeData.payment_session_id,
      order_id: orderId 
    });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
