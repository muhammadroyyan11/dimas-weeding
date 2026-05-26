import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateWAMessage, getWAUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { phone, name, weddingData } = await request.json();

    if (!phone || !name) {
      return NextResponse.json({ error: 'Nomor telepon dan nama tamu harus diisi' }, { status: 400 });
    }

    const message = generateWAMessage(name, weddingData);
    const waUrl = getWAUrl(phone, message);

    return NextResponse.json({ 
      success: true, 
      message: 'Link WhatsApp berhasil dibuat',
      waUrl,
    });
  } catch {
    return NextResponse.json({ error: 'Gagal memproses undangan' }, { status: 500 });
  }
}
