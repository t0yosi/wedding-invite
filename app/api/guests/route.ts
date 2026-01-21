import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createGuest, getAllGuests, initDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const guests = await getAllGuests();
  return NextResponse.json({ guests });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, plus_one_allowed } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const token = nanoid(16);
    const guest = await createGuest({
      name,
      email,
      phone,
      token,
      plus_one_allowed: plus_one_allowed || false,
    });

    if (!guest) {
      return NextResponse.json(
        { error: 'Failed to create guest. Email may already exist.' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/invite/${token}`;

    return NextResponse.json({
      guest,
      inviteUrl,
    });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
