import { NextRequest, NextResponse } from 'next/server';
import { readGallery, addGalleryItem, deleteGalleryItem } from '@/lib/data';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const data = await readGallery();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url, caption } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL gambar harus diisi' }, { status: 400 });
    }

    const newItem = await addGalleryItem(url, caption || '');
    return NextResponse.json(newItem);
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

    await deleteGalleryItem(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
