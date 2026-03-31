import { getAllBookings, createBooking } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/bookings  — returns all bookings (admin use)
// GET /api/bookings?userId=xxx — returns bookings for a user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const all = getAllBookings();
    const result = userId ? all.filter((b) => b.userId === userId) : all;
    // Sort newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/bookings — create a new booking (pending payment proof)
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      activityId,
      activityName,
      coach,
      date,
      time,
      location,
      category,
      // user info
      userFullName,
      userAge,
      userId,       // national ID or user ID
      userPhone,
      userEmail,
      // payment
      paymentMethod, // receipt | instapay | wallet
      walletType,    // vodafone | orange | etisalat | we (if wallet)
    } = body;

    // Basic validation
    if (!activityId || !userFullName || !userId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: activityId, userFullName, userId, paymentMethod' },
        { status: 400 }
      );
    }

    const booking = createBooking({
      activityId,
      activityName,
      coach,
      date,
      time,
      location,
      category,
      userFullName,
      userAge,
      userId,
      userPhone,
      userEmail,
      paymentMethod,
      walletType: walletType || null,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
