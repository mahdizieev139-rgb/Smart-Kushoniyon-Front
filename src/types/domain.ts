/**
 * Domain types mirroring the backend API shapes.
 *
 * These are hand-written (not generated) so the frontend has clear, documented
 * types. Keep them in sync with the backend's responses. Prices come back as
 * strings because the backend uses Decimal.
 */

export type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';
export type Locale = 'tj' | 'ru' | 'en';

export type ShopStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
export type ProductAvailability = 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER';

export interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: Role;
  status: string;
  createdAt: string;
}

export interface Translation {
  locale: Locale;
  name: string;
  description?: string | null;
}

/**
 * The backend resolves translations into BOTH a flat `name`/`description` (for
 * the requested locale) AND a map keyed by locale, e.g.
 *   { tj: { name, description }, ru: {...}, en: {...} }
 * We use the map to prefill edit forms with every language.
 */
export type TranslationMap = Partial<Record<Locale, { name: string; description?: string | null }>>;

/** A shop as returned to the public (with resolved translations). */
export interface Shop {
  id: string;
  slug: string;
  phone: string | null;
  status: ShopStatus;
  // The backend may send either the raw translations array or a resolved
  // name/description for the requested locale. We support both.
  name?: string;
  description?: string | null;
  translations?: TranslationMap;
  sectionId?: string | null;
  gateCode?: string | null;
  sectionCode?: string | null;
  sectionName?: string | null;
  images?: { id: string; imageUrl: string }[];
  productCount?: number;
  latitude?: string | null;
  longitude?: string | null;
}

export interface Product {
  id: string;
  shopId: string;
  categoryId: string | null;
  price: string;
  currency: string;
  status: ProductStatus;
  availability: ProductAvailability;
  name?: string;
  description?: string | null;
  translations?: TranslationMap;
  images?: { id: string; imageUrl: string }[];
  shop?: Pick<Shop, 'id' | 'slug' | 'name' | 'phone'>;
  createdAt?: string;
}

export interface Category {
  id: string;
  slug: string;
  parentId: string | null;
  name?: string;
  translations?: TranslationMap;
  productCount?: number;
}

export interface Gate {
  id: string;
  code: string;
  name?: string;
  latitude?: string | null;
  longitude?: string | null;
}

export interface Section {
  id: string;
  code: string;
  gateId: string;
  name?: string;
  latitude?: string | null;
  longitude?: string | null;
}
