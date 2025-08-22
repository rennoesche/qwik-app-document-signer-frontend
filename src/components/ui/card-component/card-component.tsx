import { Component, component$, Slot, type QwikIntrinsicElements } from '@builder.io/qwik';
import { cn } from '~/lib/utils'; // Pastikan Anda memiliki utility cn untuk menggabungkan class

export type CardProps = QwikIntrinsicElements['div'] & {
  variant?: 'default' | 'outline' | 'filled';
};

const CardRoot = component$<CardProps>(({ variant = 'default', class: className, ...props }) => {
  return (
    <div
      data-slot="card"
      class={cn(
        'from-primary/5 to-card bg-card  bg-gradient-to-t text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm @container/card',
        {
          'border': variant === 'default' || variant === 'outline',
          'border-0': variant === 'filled',
          'bg-muted/50': variant === 'filled',
        },
        className
      )}
      {...props}
    >
      <Slot />
    </div>
  );
});

const CardContent = component$<QwikIntrinsicElements['div']>(({ class: className, ...props }) => (
  <div data-slot="card-content" class={cn('px-6', className)} {...props}>
    <Slot />
  </div>
));

export type CardHeaderProps = QwikIntrinsicElements['div'] & {
  withSeparator?: boolean;
}

const CardHeader = component$<CardHeaderProps>(({ withSeparator = false, class: className, ...props }) => {
  return (
    <div
      data-slot="card-header"
      class={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        {
          'border-b pb-6': withSeparator,
        },
        className
      )}
      {...props}
    >
      <Slot />
    </div>
  );
});

export type CardTitleProps = QwikIntrinsicElements['div'] & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

const CardTitle = component$<CardTitleProps>(({ as: Tag = 'div', class: className, ...props }) => {
  return (
    <Tag
      data-slot="card-title"
      class={cn(
        'text-2xl font-semibold tabular-nums @[250px]/card:text-3xl',
        className
      )}
      {...props}
    >
      <Slot />
    </Tag>
  );
});

export type CardDescriptionProps = QwikIntrinsicElements['div'] & {}

const CardDescription = component$<CardDescriptionProps>(({ class: className, ...props }) => {
  return (
    <div
      data-slot="card-description"
      class={cn(
        'text-muted-foreground text-sm',
        className
      )}
      {...props}
    >
      <Slot />
    </div>
  );
});

export type CardActionProps = QwikIntrinsicElements['div'] & {}

const CardAction = component$<CardActionProps>(({ class: className, ...props }) => {
  return (
    <div
      data-slot="card-action"
      class={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    >
      <Slot />
    </div>
  );
});

export type CardFooterProps = QwikIntrinsicElements['div'] & {
  withSeparator?: boolean;
}

const CardFooter = component$<CardFooterProps>(({ withSeparator = false, class: className, ...props }) => {
  return (
    <div
      data-slot="card-footer"
      class={cn(
        'flex px-6 flex-col items-start gap-1.5 text-sm',
        {
          'border-t pt-6': withSeparator,
        },
        className
      )}
      {...props}
    >
      <Slot />
    </div>
  );
});

export type BadgeProps = QwikIntrinsicElements['span'] & {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline';
}

const Badge = component$<BadgeProps>(({ variant = 'default', class: className, ...props }) => {
  return (
    <span
      data-slot="badge"
      class={cn(
        'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
        {
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground': variant === 'default',
          'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400': variant === 'success',
          'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400': variant === 'warning',
          'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400': variant === 'destructive',
          'border-transparent bg-transparent': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      <Slot />
    </span>
  );
});

export const Card: Component<QwikIntrinsicElements['div']> & {
  Root: typeof CardRoot;
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Action: typeof CardAction;
  Footer: typeof CardFooter;
  Badge: typeof Badge;
} = Object.assign(CardRoot, {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Action: CardAction,
  Footer: CardFooter,
  Badge: Badge,
});