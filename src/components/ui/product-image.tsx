/**
 * ProductImage — shows a product/shop photo, or a clean placeholder when there
 * is no image (common for DEMO data). We use a plain <img> with lazy loading
 * for simplicity; the backend serves images from its storage service.
 */
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  label?: string; // shown under the placeholder icon
}

export function ProductImage({ src, alt, className, label }: ProductImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-1 bg-canvas text-muted',
          className,
        )}
      >
        <ImageOff className="h-7 w-7" aria-hidden />
        {label ? <span className="text-xs">{label}</span> : null}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={cn('object-cover', className)} />;
}
