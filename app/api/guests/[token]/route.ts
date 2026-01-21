import { NextRequest, NextResponse } from 'next/server';
import { getGuestByToken, updateGuestRSVP } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const guest = await getGuestByToken(token);

  if (!guest) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
  }

  return NextResponse.json({ guest });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      rsvp_status,
      plus_one_name,
      plus_one_attending,
      meal_preference,
      plus_one_meal_preference,
      message,
    } = body;

    if (!rsvp_status || !['attending', 'declined'].includes(rsvp_status)) {
      return NextResponse.json(
        { error: 'Valid RSVP status is required (attending or declined)' },
        { status: 400 }
      );
    }

    const guest = await updateGuestRSVP(token, {
      rsvp_status,
      plus_one_name,
      plus_one_attending,
      meal_preference,
      plus_one_meal_preference,
      message,
    });

    if (!guest) {
      return NextResponse.json(
        { error: 'Failed to update RSVP' },
        { status: 500 }
      );
    }

    return NextResponse.json({ guest });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
