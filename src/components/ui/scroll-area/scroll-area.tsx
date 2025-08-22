import { component$, useSignal, useVisibleTask$, Slot } from '@builder.io/qwik';
import { cn } from '~/lib/utils';

export interface ScrollAreaProps {
  className?: string;
  orientation?: 'vertical' | 'horizontal' | 'both';
  scrollBarClassName?: string;
  thumbClassName?: string;
}

export const ScrollArea = component$<ScrollAreaProps>(({
  className = '',
  orientation = 'vertical',
  scrollBarClassName = '',
  thumbClassName = '',
  ...props
}) => {
  const viewportRef = useSignal<HTMLDivElement>();
  const scrollPosition = useSignal({ x: 0, y: 0 });
  const isScrolling = useSignal(false);

  useVisibleTask$(({ track }) => {
    track(() => viewportRef.value);

    const element = viewportRef.value;
    if (!element) return;

    const handleScroll = () => {
      scrollPosition.value = {
        x: element.scrollLeft,
        y: element.scrollTop
      };
      isScrolling.value = true;
    };

    element.addEventListener('scroll', handleScroll);
    
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <div 
      class={cn(
        'relative overflow-hidden h-full',
        className
      )}
      {...props}
    >
      <div
        ref={viewportRef}
        class={cn(
          'h-full w-full rounded-[inherit]',
          orientation === 'vertical' ? 'overflow-y-auto' : '',
          orientation === 'horizontal' ? 'overflow-x-auto' : '',
          orientation === 'both' ? 'overflow-auto' : ''
        )}
      >
        <Slot />
      </div>
    </div>
  );
});