import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Auto-detect site URL from the request origin
    const origin = request.headers.get('origin') || request.headers.get('referer')?.replace(/\/[^/]*$/, '') || process.env.NEXT_PUBLIC_SITE_URL || 'https://bgmi-seven-sandy.vercel.app';
    
    // Generate a unique order ID
    const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    
    // Fetch dynamic registration fee from settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('registration_fee')
      .eq('id', 1)
      .single();

    let orderAmount = 99; // Default fallback
    if (!settingsError && settingsData) {
      orderAmount = settingsData.registration_fee;
    }

    // Check time slot capacity (max 6 per slot)
    const MAX_SLOT_CAPACITY = 6;
    if (data.timeSlot) {
      const { count, error: countError } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('time_slot', data.timeSlot);

      if (!countError && count !== null && count >= MAX_SLOT_CAPACITY) {
        return NextResponse.json({ 
          error: 'This time slot is full. Please select a different time slot.' 
        }, { status: 400 });
      }
    }

    const envStr = (process.env.CASHFREE_ENVIRONMENT || process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || '').toUpperCase();
    const isProduction = envStr === 'PRODUCTION';
    const cashfreeApiUrl = isProduction 
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';

    const appId = process.env.CASHFREE_APP_ID || '';
    const secretKey = process.env.CASHFREE_SECRET_KEY || '';

    // Debug logging — visible in Vercel Function Logs
    console.log('[create-order] Environment:', envStr || '(NOT SET)');
    console.log('[create-order] Using API URL:', cashfreeApiUrl);
    console.log('[create-order] CASHFREE_APP_ID present:', !!appId && appId.length > 0);
    console.log('[create-order] CASHFREE_SECRET_KEY present:', !!secretKey && secretKey.length > 0);
    console.log('[create-order] Order amount:', orderAmount);

    if (!appId || !secretKey) {
      console.error('[create-order] FATAL: Cashfree keys are missing! Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in your Vercel environment variables.');
      return NextResponse.json({ 
        error: 'Payment gateway is not configured. Cashfree API keys are missing on the server.' 
      }, { status: 500 });
    }

    // 1. Create order on Cashfree
    const cashfreeResponse = await fetch(cashfreeApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: 'INR',
        customer_details: {
          customer_id: `cust_${crypto.randomBytes(4).toString('hex')}`,
          customer_name: data.fullName,
          customer_email: data.email || 'support@xyloesports.in',
          customer_phone: data.mobileNumber,
        },
        order_meta: {
          return_url: `${origin}/contact?order_id={order_id}`
        }
      })
    });

    const cashfreeData = await cashfreeResponse.json();

    console.log('[create-order] Cashfree response status:', cashfreeResponse.status);
    console.log('[create-order] Cashfree response data:', JSON.stringify(cashfreeData));

    if (!cashfreeResponse.ok) {
      console.error('[create-order] Cashfree API error:', JSON.stringify(cashfreeData));
      return NextResponse.json({ 
        error: `Cashfree error: ${cashfreeData?.message || cashfreeData?.error?.message || JSON.stringify(cashfreeData)}` 
      }, { status: 500 });
    }

    // Validate that we actually got a payment_session_id
    if (!cashfreeData.payment_session_id) {
      console.error('[create-order] No payment_session_id in Cashfree response:', JSON.stringify(cashfreeData));
      return NextResponse.json({ 
        error: `Cashfree returned success but no payment_session_id. Response: ${JSON.stringify(cashfreeData)}` 
      }, { status: 500 });
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
          upi_id: data.upiId,
          message: data.message,
          cashfree_order_id: orderId,
          payment_status: 'pending',
          payment_amount: orderAmount
        }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to save registration' }, { status: 500 });
    }

    // 3. Return payment session id to frontend
    return NextResponse.json({ 
      payment_session_id: cashfreeData.payment_session_id,
      order_id: orderId,
      cf_environment: isProduction ? 'production' : 'sandbox'
    });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
