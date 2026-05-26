import { readWedding, readComments, readGallery } from '@/lib/data';
import WeddingTheme from '@/components/themes/WeddingTheme';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const wedding = await readWedding();
  const [comments, gallery] = await Promise.all([
    readComments(),
    readGallery(),
  ]);

  // Parse guest name from ?to= query param
  const params = await searchParams;
  const guestName = typeof params.to === 'string' ? params.to.trim() : undefined;

  return (
    <WeddingTheme
      data={wedding}
      comments={comments}
      gallery={gallery}
      guestName={guestName}
    />
  );
}
