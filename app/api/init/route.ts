import { NextRequest, NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
