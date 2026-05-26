import { NextRequest, NextResponse } from 'next/server';
import { readComments, addComment, updateCommentApproval, deleteComment } from '@/lib/data';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const data = await readComments();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const { name, message, attendance } = await request.json();
    
    if (!name || !message) {
      return NextResponse.json({ error: 'Nama dan ucapan harus diisi' }, { status: 400 });
    }

    const newComment = await addComment({
      name,
      message,
      attendance: attendance || 'Hadir',
      createdAt: new Date().toISOString(),
      approved: false,
    });
    return NextResponse.json(newComment);
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, approved } = await request.json();
    await updateCommentApproval(id, approved);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(request.nextUrl.searchParams.get('id') || '');
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }

    await deleteComment(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
