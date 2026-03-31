import { getBookingById, updateBooking, deleteBooking } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/bookings/[id]
export async function GET(req, context) {
  try {
    const params = await context.params;
    const booking = getBookingById(params.id);
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(booking);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/bookings/[id]
export async function PATCH(req, context) {
  try {
    const params = await context.params;
    const body = await req.json();
    const booking = getBookingById(params.id);
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const updated = updateBooking(params.id, body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/bookings/[id]
export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const booking = getBookingById(params.id);
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    deleteBooking(params.id);
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
