/**
 * POST /api/paymob/checkout
 *
 * Single endpoint the frontend calls.
 * Runs the full Paymob 3-step flow and returns a payment key.
 *
 * Body: {
 *   amountCents: number,       // e.g. 125000  (1250 EGP × 100)
 *   currency?: string,         // default "EGP"
 *   billingData?: object,      // customer info
 *   activityName?: string,     // for order description
 *   locale?: string,           // "ar" | "en" for redirect URLs
 * }
 */
export async function POST(req) {
  try {
    const {
      amountCents,
      currency = 'EGP',
      billingData = {},
      activityName = 'Academy Booking',
      locale = 'ar',
    } = await req.json();

    const base = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get('host')}`;

    // ── Step 1: Authenticate ──────────────────────────────────────────────
    const authRes = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    });
    const authData = await authRes.json();
    if (!authData.token) {
      return Response.json({ error: 'Paymob auth failed', detail: authData }, { status: 500 });
    }
    const authToken = authData.token;

    // ── Step 2: Register order ────────────────────────────────────────────
    const orderRes = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amountCents,
        currency,
        items: [
          {
            name: activityName,
            amount_cents: amountCents,
            description: activityName,
            quantity: 1,
          },
        ],
      }),
    });
    const orderData = await orderRes.json();
    if (!orderData.id) {
      return Response.json({ error: 'Order registration failed', detail: orderData }, { status: 500 });
    }
    const orderId = orderData.id;

    // ── Step 3: Get payment key ───────────────────────────────────────────
    const defaultBilling = {
      apartment: 'NA',
      email: 'customer@example.com',
      floor: 'NA',
      first_name: 'Customer',
      street: 'NA',
      building: 'NA',
      phone_number: '+201000000000',
      shipping_method: 'NA',
      postal_code: 'NA',
      city: 'Cairo',
      country: 'EG',
      last_name: 'Customer',
      state: 'NA',
    };

    const keyRes = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: { ...defaultBilling, ...billingData },
        currency,
        integration_id: parseInt(process.env.PAYMOB_INTEGRATION_ID),
        lock_order_when_paid: false,
      }),
    });
    const keyData = await keyRes.json();
    if (!keyData.token) {
      return Response.json({ error: 'Payment key failed', detail: keyData }, { status: 500 });
    }

    return Response.json({
      paymentKey: keyData.token,
      orderId,
      iframeId: process.env.PAYMOB_IFRAME_ID,
      iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${keyData.token}`,
    });
  } catch (err) {
    console.error('[Paymob checkout error]', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
