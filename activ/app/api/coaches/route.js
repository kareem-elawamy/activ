// app/api/coaches/route.js
import { NextResponse } from 'next/server';
import { coachesData } from '@/app/lib/coachesStore';

export async function GET() {
  try {
    return NextResponse.json(coachesData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch coaches' }, { status: 500 });
  }
}