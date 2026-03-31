import crypto from 'crypto';

// Paymob sends a POST callback after payment
export async function POST(req) {
  try {
    const body = await req.json();

    // Verify HMAC signature (recommended for security)
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    if (hmacSecret) {
      const receivedHmac = req.headers.get('hmac') || body.hmac;
      if (receivedHmac) {
        const transactionData = body.obj;
        // Build concatenated string per Paymob docs
        const concatenated = [
          transactionData.amount_cents,
          transactionData.created_at,
          transactionData.currency,
          transactionData.error_occured,
          transactionData.has_parent_transaction,
          transactionData.id,
          transactionData.integration_id,
          transactionData.is_3d_secure,
          transactionData.is_auth,
          transactionData.is_capture,
          transactionData.is_refunded,
          transactionData.is_standalone_payment,
          transactionData.is_voided,
          transactionData.order?.id,
          transactionData.owner,
          transactionData.pending,
          transactionData.source_data?.pan,
          transactionData.source_data?.sub_type,
          transactionData.source_data?.type,
          transactionData.success,
        ].join('');

        const calculatedHmac = crypto
          .createHmac('sha512', hmacSecret)
          .update(concatenated)
          .digest('hex');

        if (calculatedHmac !== receivedHmac) {
          console.warn('[Paymob] HMAC mismatch — ignoring callback');
          return Response.json({ received: true }); // still 200 so Paymob doesn't retry
        }
      }
    }

    const transaction = body.obj;
    const success = transaction?.success === true || transaction?.success === 'true';
    const orderId = transaction?.order?.id;
    const amountCents = transaction?.amount_cents;

    console.log('[Paymob callback]', { success, orderId, amountCents });

    // TODO: persist to DB here if needed
    // e.g. await db.bookings.updateOne({ paymobOrderId: orderId }, { paid: success })

    return Response.json({ received: true });
  } catch (err) {
    console.error('[Paymob callback error]', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// Paymob also hits the callback URL via GET for the redirect after payment
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const success = searchParams.get('success');
  const locale = searchParams.get('locale') || 'ar';

  // Redirect user to proper success/cancel page
  if (success === 'true') {
    return Response.redirect(new URL(`/${locale}/payment-success`, req.url));
  } else {
    return Response.redirect(new URL(`/${locale}/payment-cancel`, req.url));
  }
}
