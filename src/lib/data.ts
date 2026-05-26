import { query, getRow } from './database';

// ===== Wedding Settings =====

export interface WeddingData {
  groom: { name: string; father: string; mother: string; nickname: string };
  bride: { name: string; father: string; mother: string; nickname: string };
  reception: { date: string; time: string; location: string; address: string; mapUrl: string; googleMapsEmbed: string };
  loveStory: Array<{ date: string; title: string; description: string }>;
  hero: { greeting: string; subtitle: string; date: string; footer: string };
  colors: Record<string, string>;
  music: { url: string; enabled: boolean };
  theme: string;
  coverImage: string;
  groomImage: string;
  brideImage: string;
}

function rowToWeddingData(row: any): WeddingData {
  const loveStory = typeof row.love_story === 'string' ? JSON.parse(row.love_story) : (row.love_story || []);
  const colors = typeof row.colors === 'string' ? JSON.parse(row.colors) : (row.colors || {
    primary: '#8B5E3C', secondary: '#D4A574', accent: '#F5E6D3',
    background: '#FFF8F0', text: '#3D2B1F', gold: '#C9A96E'
  });

  return {
    groom: {
      name: row.groom_name || '',
      father: row.groom_father || '',
      mother: row.groom_mother || '',
      nickname: row.groom_nickname || '',
    },
    bride: {
      name: row.bride_name || '',
      father: row.bride_father || '',
      mother: row.bride_mother || '',
      nickname: row.bride_nickname || '',
    },
    reception: {
      date: row.reception_date || '',
      time: row.reception_time || '',
      location: row.reception_location || '',
      address: row.reception_address || '',
      mapUrl: row.reception_map_url || '',
      googleMapsEmbed: row.reception_gmaps_embed || '',
    },
    hero: {
      greeting: row.hero_greeting || '',
      subtitle: row.hero_subtitle || '',
      date: row.hero_date || '',
      footer: row.hero_footer || '',
    },
    loveStory,
    colors,
    music: {
      url: row.music_url || '',
      enabled: Boolean(row.music_enabled),
    },
    theme: row.theme || 'base',
    coverImage: row.cover_image || '',
    groomImage: row.groom_image || '',
    brideImage: row.bride_image || '',
  };
}

function weddingDataToRow(data: WeddingData) {
  return {
    groom_name: data.groom.name,
    groom_father: data.groom.father,
    groom_mother: data.groom.mother,
    groom_nickname: data.groom.nickname,
    bride_name: data.bride.name,
    bride_father: data.bride.father,
    bride_mother: data.bride.mother,
    bride_nickname: data.bride.nickname,
    reception_date: data.reception.date,
    reception_time: data.reception.time,
    reception_location: data.reception.location,
    reception_address: data.reception.address,
    reception_map_url: data.reception.mapUrl,
    reception_gmaps_embed: data.reception.googleMapsEmbed,
    hero_greeting: data.hero.greeting,
    hero_subtitle: data.hero.subtitle,
    hero_date: data.hero.date,
    hero_footer: data.hero.footer,
    love_story: JSON.stringify(data.loveStory),
    colors: JSON.stringify(data.colors),
    music_url: data.music?.url || '',
    music_enabled: data.music?.enabled ? 1 : 0,
    theme: data.theme || 'base',
    cover_image: data.coverImage || '',
    groom_image: data.groomImage || '',
    bride_image: data.brideImage || '',
  };
}

export async function readWedding(): Promise<WeddingData> {
  const row = await getRow<any>('SELECT * FROM wedding_settings WHERE id = 1');
  if (!row) {
    // Return default data if no row exists
    return {
      groom: { name: 'Dimas Prayuga Abdulrohman Putra', father: 'Zuli Abdulrohman', mother: 'Sri Rahayu', nickname: 'Dimas' },
      bride: { name: 'Laely Nur Faizah', father: 'Subiyadi', mother: 'Marfuah', nickname: 'Laely' },
      reception: { date: '2026-06-08', time: '10:00 - 16:00 WIB', location: 'Perum Sidorahayu Blok A No 1', address: 'Dusun Niwen, Kelurahan Sidorahayu, Kecamatan Wagir, Kabupaten Malang', mapUrl: 'https://maps.google.com/?q=Perum+Sidorahayu+Blok+A+No+1+Dusun+Niwen+Sidorahayu+Wagir+Malang', googleMapsEmbed: '' },
      loveStory: [
        { date: '2019', title: 'Pertemuan Pertama', description: 'Berawal dari sebuah acara pengajian di daerah Wagir, kami pertama kali bertemu.' },
        { date: '2020', title: 'Mulai Dekat', description: 'Pandemi membuat kami semakin sering berkomunikasi melalui telepon dan video call.' },
        { date: '2022', title: 'Lamaran', description: 'Dengan restu kedua orang tua, kami resmi bertunangan.' },
        { date: '8 Juni 2026', title: 'Pernikahan', description: 'Hari yang paling dinantikan. Dengan mengucap bismillah, kami akan melangkah ke jenjang pernikahan.' },
      ],
      hero: { greeting: "Assalamu'alaikum Warahmatullahi Wabarakatuh", subtitle: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan resepsi pernikahan putra-putri kami:', date: '8 Juni 2026', footer: 'Merupakan suatu kehormatan dan kebahagiaan apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.' },
      colors: { primary: '#8B5E3C', secondary: '#D4A574', accent: '#F5E6D3', background: '#FFF8F0', text: '#3D2B1F', gold: '#C9A96E' },
      music: { url: '', enabled: false },
      theme: 'base',
      coverImage: '',
      groomImage: '',
      brideImage: '',
    };
  }
  return rowToWeddingData(row);
}

export async function writeWedding(data: WeddingData): Promise<void> {
  const row = weddingDataToRow(data);
  const existing = await getRow<any>('SELECT id FROM wedding_settings WHERE id = 1');
  if (existing) {
    const setClauses = Object.entries(row).map(([key]) => `${key} = ?`).join(', ');
    const values = Object.values(row);
    await query(`UPDATE wedding_settings SET ${setClauses} WHERE id = 1`, values);
  } else {
    const keys = Object.keys(row).join(', ');
    const placeholders = Object.keys(row).map(() => '?').join(', ');
    const values = Object.values(row);
    await query(`INSERT INTO wedding_settings (id, ${keys}) VALUES (1, ${placeholders})`, values);
  }
}

export async function updateMusic(musicUrl: string, musicEnabled: boolean): Promise<void> {
  const existing = await getRow<any>('SELECT id FROM wedding_settings WHERE id = 1');
  if (existing) {
    await query('UPDATE wedding_settings SET music_url = ?, music_enabled = ? WHERE id = 1', [musicUrl, musicEnabled ? 1 : 0]);
  } else {
    await query('INSERT INTO wedding_settings (id, music_url, music_enabled) VALUES (1, ?, ?)', [musicUrl, musicEnabled ? 1 : 0]);
  }
}

// ===== Comments =====

export interface Comment {
  id: number;
  name: string;
  message: string;
  attendance: string;
  createdAt: string;
  approved: boolean;
}

export async function readComments(): Promise<Comment[]> {
  const rows = await query<any[]>('SELECT * FROM comments ORDER BY created_at DESC');
  return rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    message: row.message,
    attendance: row.attendance,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    approved: Boolean(row.approved),
  }));
}

export async function writeComments(comments: Comment[]): Promise<void> {
  // Re-sync: delete all and re-insert
  await query('DELETE FROM comments');
  for (const c of comments) {
    await query(
      'INSERT INTO comments (id, name, message, attendance, approved, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [c.id, c.name, c.message, c.attendance, c.approved ? 1 : 0, c.createdAt]
    );
  }
}

export async function addComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
  const result = await query<any>('INSERT INTO comments (name, message, attendance, approved) VALUES (?, ?, ?, ?)',
    [comment.name, comment.message, comment.attendance, comment.approved ? 1 : 0]);
  const insertId = (result as any).insertId;
  return { ...comment, id: insertId };
}

export async function updateCommentApproval(id: number, approved: boolean): Promise<void> {
  await query('UPDATE comments SET approved = ? WHERE id = ?', [approved ? 1 : 0, id]);
}

export async function deleteComment(id: number): Promise<void> {
  await query('DELETE FROM comments WHERE id = ?', [id]);
}

// ===== Gallery =====

export interface GalleryItem {
  id: number;
  url: string;
  caption: string;
}

export async function readGallery(): Promise<GalleryItem[]> {
  const rows = await query<any[]>('SELECT * FROM gallery ORDER BY created_at DESC');
  return rows.map((row: any) => ({
    id: row.id,
    url: row.url,
    caption: row.caption || '',
  }));
}

export async function writeGallery(items: GalleryItem[]): Promise<void> {
  await query('DELETE FROM gallery');
  for (const item of items) {
    await query('INSERT INTO gallery (id, url, caption) VALUES (?, ?, ?)',
      [item.id, item.url, item.caption]);
  }
}

export async function addGalleryItem(url: string, caption: string): Promise<GalleryItem> {
  const result = await query<any>('INSERT INTO gallery (url, caption) VALUES (?, ?)', [url, caption]);
  const insertId = (result as any).insertId;
  return { id: insertId, url, caption };
}

export async function deleteGalleryItem(id: number): Promise<void> {
  await query('DELETE FROM gallery WHERE id = ?', [id]);
}
