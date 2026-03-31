// Step 3: Get a payment key from Paymob
export async function POST(req) {
  try {
    const {
      authToken,
      amountCents,
      orderId,
      billingData,
      currency = 'EGP',
      integrationId,
    } = await req.json();

    const response = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: billingData,
        currency,
        integration_id: integrationId,
        lock_order_when_paid: false,
      }),
    });

    const data = await response.json();

    if (!data.token) {
      return Response.json({ error: 'Payment key failed', detail: data }, { status: 500 });
    }

    return Response.json({ paymentKey: data.token });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
