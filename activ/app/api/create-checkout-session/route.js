import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const dynamic = 'force-dynamic';
export async function POST(req) {
  const { amount } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Academy Booking" },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.headers.origin}/payment-success`,
    cancel_url: `${req.headers.origin}/payment-cancel`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
