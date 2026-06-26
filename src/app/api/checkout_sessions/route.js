import { NextResponse } from 'next/server';
import { stripe } from '../../../lib/stripe';

export async function POST(req) {
  try {
    const body = await req.json();
    const { classId, className, price, email, userId, quantity } = body;

    const origin = req.headers.get('origin');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: className,
            },
            unit_amount: Math.round(Number(price) * 100),
          },
          quantity: quantity || 1,
        },
      ],
      metadata: {
        classId,
        className,
        email,
        userId: userId || email,
        quantity: quantity || 1,
        amount: price,
      },
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/classes/${classId}`,
      customer_email: email,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}