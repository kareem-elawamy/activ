// Step 1: Authenticate with Paymob and get auth token
export async function POST() {
  try {
    const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.PAYMOB_API_KEY,
      }),
    });

    const data = await response.json();

    if (!data.token) {
      return Response.json({ error: 'Paymob auth failed', detail: data }, { status: 500 });
    }

    return Response.json({ token: data.token });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
