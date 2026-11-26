import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-ocean text-white hover:bg-[#1d4ed8]',
        outline: 'border border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-muted',
        ghost: 'text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground',
        white: 'bg-white text-deep hover:bg-blue-50',
        glass: 'border border-white/25 text-white hover:bg-white/10',
      },
      size: {
        default: 'h-11 px-5 text-[15px]',
        lg: 'h-12 px-6 text-base',
        sm: 'h-9 px-3 text-sm',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

/// A button, or any element passed as its child when [asChild] is set.
export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
