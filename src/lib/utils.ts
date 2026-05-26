export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDaysUntil(targetDate: string): number {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function generateWAMessage(name: string, weddingData: any): string {
  const { groom, bride, reception } = weddingData;
  const date = formatDate(reception.date);
  
  return encodeURIComponent(
    `Assalamu'alaikum Warahmatullahi Wabarakatuh\n\n` +
    `Dengan hormat,\n\n` +
    `Kami mengundang Bapak/Ibu/Saudara/i ${name} untuk menghadiri resepsi pernikahan putra-putri kami:\n\n` +
    `${groom.name} (Putra Bapak ${groom.father} & Ibu ${groom.mother})\n` +
    `& \n` +
    `${bride.name} (Putri Bapak ${bride.father} & Ibu ${bride.mother})\n\n` +
    `📅 Hari, Tanggal: ${date}\n` +
    `🕐 Waktu: ${reception.time}\n` +
    `📍 Lokasi: ${reception.location}\n` +
    `${reception.address}\n\n` +
    `Merupakan suatu kehormatan dan kebahagiaan apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.\n\n` +
    `Wassalamu'alaikum Warahmatullahi Wabarakatuh`
  );
}

export function getWAUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${message}`;
}
