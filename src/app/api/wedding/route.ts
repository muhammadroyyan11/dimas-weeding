import { NextRequest, NextResponse } from 'next/server';
import { readWedding, writeWedding } from '@/lib/data';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const data = await readWedding();
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await writeWedding(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
