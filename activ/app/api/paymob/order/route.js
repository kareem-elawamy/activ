// Step 2: Register an order with Paymob
export async function POST(req) {
  try {
    const { authToken, amountCents, currency = 'EGP', items = [] } = await req.json();

    const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amountCents,
        currency,
        items,
      }),
    });

    const data = await response.json();

    if (!data.id) {
      return Response.json({ error: 'Order registration failed', detail: data }, { status: 500 });
    }

    return Response.json({ orderId: data.id });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
