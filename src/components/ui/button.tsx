/**
 * Button — the single button component used across the app.
 *
 * Variants (via class-variance-authority) keep styling consistent:
 *   primary  — main call to action (brand blue)
 *   navy     — strong dark action
 *   outline  — secondary action
 *   ghost    — low-emphasis action
 *   amber    — "featured"/highlight action (use sparingly)
 * Sizes: sm | md | lg | icon.
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-white hover:bg-brand-600',
        navy: 'bg-navy text-white hover:bg-navy-ink',
        outline: 'border border-line bg-white text-ink hover:bg-canvas',
        ghost: 'text-ink hover:bg-canvas',
        amber: 'bg-amber text-navy-ink hover:brightness-95',
        link: 'text-brand underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
