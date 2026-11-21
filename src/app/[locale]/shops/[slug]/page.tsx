/**
 * Shop detail page (/[locale]/shops/[slug]).
 *
 * The server component reads the slug param and hands it to the client
 * ShopDetail component, which fetches the shop and its products.
 */
import { ShopDetail } from '@/components/shops/shop-detail';

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ShopDetail slug={slug} />;
}
