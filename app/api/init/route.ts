import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET() {
  const result = await initDatabase();

  if (result.success) {
    return NextResponse.json({ message: 'Database initialized successfully' });
  } else {
    return NextResponse.json(
      { error: 'Failed to initialize database', details: result.error },
      { status: 500 }
    );
  }
}
