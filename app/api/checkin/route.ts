import { NextRequest, NextResponse } from 'next/server';
import { getGuestByAccessCode, checkInGuest } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Access code is required' }, { status: 400 });
  }

  const guest = await getGuestByAccessCode(code);

  if (!guest) {
    return NextResponse.json({ error: 'Invalid access code' }, { status: 404 });
  }

  if (guest.rsvp_status !== 'attending') {
    return NextResponse.json({ error: 'Guest has not confirmed attendance' }, { status: 400 });
  }

  return NextResponse.json({ guest });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { access_code } = body;

    if (!access_code) {
      return NextResponse.json({ error: 'Access code is required' }, { status: 400 });
    }

    const guest = await checkInGuest(access_code);

    if (!guest) {
      return NextResponse.json(
        { error: 'Invalid access code or guest not attending' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      guest,
      message: `${guest.name} has been checked in!`
    });
  } catch (error) {
    console.error('Error checking in guest:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
