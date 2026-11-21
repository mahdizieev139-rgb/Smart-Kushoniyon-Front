/**
 * Seller products page — manage the products in the seller's own shops.
 *
 * Lists products with status, lets the seller add / edit / delete. Deletion is a
 * soft delete on the backend (the row is archived, not erased).
 */
'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useMyProducts } from '@/features/seller/seller-api';
import { useMyShops } from '@/features/seller/seller-api';
import { deleteProduct } from '@/features/products/products-api';
import { Link } from '@/i18n/navigation';
import { ProductForm } from '@/components/seller/product-form';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states';
import { formatPrice } from '@/lib/utils';
import type { Locale, Product } from '@/types/domain';

export default function SellerProductsPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations('dash');
  const ts = useTranslations('states');
  const tc = useTranslations('common');
  const qc = useQueryClient();

  const { data: products, isLoading, isError, refetch } = useMyProducts(locale);
  const { data: shops } = useMyShops(locale);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>(undefined);

  const hasShops = (shops?.length ?? 0) > 0;

  function openCreate() {
    setEditing(undefined);
    setModalOpen(true);
  }
  function openEdit(product: Product) {
    setEditing(product);
    setModalOpen(true);
  }
  async function onDelete(product: Product) {
    if (!window.confirm(t('confirmDelete'))) return;
    await deleteProduct(product.id);
    await qc.invalidateQueries({ queryKey: ['my-products'] });
    await qc.invalidateQueries({ queryKey: ['seller-overview'] });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">{t('myProducts')}</h2>
        <Button onClick={openCreate} disabled={!hasShops}>
          <Plus className="h-4 w-4" />
          {t('newProduct')}
        </Button>
      </div>

      {!hasShops ? (
        <EmptyState title={t('noShops')} text={t('noShopsHint')} />
      ) : isLoading ? (
        <LoadingState label={tc('loading')} />
      ) : isError ? (
        <ErrorState title={ts('errorTitle')} text={ts('errorText')} onRetry={() => refetch()} retryLabel={tc('retry')} />
      ) : !products || products.length === 0 ? (
        <EmptyState title={t('noProducts')} text={t('noProductsHint')} />
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{product.name ?? '—'}</p>
                  <p className="num mt-0.5 text-sm text-muted">{formatPrice(product.price, product.currency)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={product.status} />
                  <button
                    onClick={() => openEdit(product)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-brand"
                    aria-label={t('editProduct')}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                    aria-label={tc('delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {!hasShops ? (
        <p className="text-sm text-muted">
          <Link href="/seller/shops" className="font-medium text-brand hover:underline">
            {t('newShop')}
          </Link>
        </p>
      ) : null}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? t('editProduct') : t('newProduct')}
      >
        {shops ? (
          <ProductForm
            product={editing}
            shops={shops}
            onClose={() => setModalOpen(false)}
            onSaved={() => setModalOpen(false)}
          />
        ) : null}
      </Modal>
    </div>
  );
}
