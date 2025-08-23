import { component$, Slot } from '@builder.io/qwik';
import type { QRL } from '@builder.io/qwik';

export interface ButtonProps {
  onClick$?: QRL<(event: MouseEvent, element: HTMLButtonElement) => void>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  class?: string;
}

export const Button = component$<ButtonProps>(({ 
  onClick$, 
  type = 'button', 
  disabled = false, 
  variant = 'default',
  size = 'default',
  class: className = ''
}) => {

  const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
    outline: 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90'
  };

  const sizeClasses = {
    default: 'h-10 px-4 py-2.5',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button 
      type={type}
      disabled={disabled}
      class={classes}
      onClick$={onClick$}
    >
      <Slot/>
    </button>
  );
});