/**
 * Product detail page (/[locale]/products/[id]).
 */
import { ProductDetail } from '@/components/products/product-detail';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetail id={id} />;
}
