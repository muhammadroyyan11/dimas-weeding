import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://projectskuy.site'),
  title: 'Wedding - Dimas & Laely | 8 Juni 2026',
  description: 'Undangan pernikahan Dimas Prayuga Abdulrohman Putra & Laely Nur Faizah. Resepsi: 8 Juni 2026 di Perum Sidorahayu, Malang.',
  openGraph: {
    title: 'Wedding - Dimas & Laely',
    description: 'Undangan pernikahan Dimas Prayuga Abdulrohman Putra & Laely Nur Faizah. Resepsi: 8 Juni 2026 di Perum Sidorahayu, Malang.',
    type: 'website',
    images: [
      {
        url: '/dummy/kita.png',
        width: 1200,
        height: 630,
        alt: 'Wedding Dimas & Laely',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedding - Dimas & Laely',
    description: 'Undangan pernikahan Dimas Prayuga Abdulrohman Putra & Laely Nur Faizah',
    images: ['/dummy/kita.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
