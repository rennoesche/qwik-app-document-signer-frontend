import { component$, type QRL } from '@builder.io/qwik';
import { LuCheck } from '@qwikest/icons/lucide';

interface CustomCheckboxProps {
  checked: boolean;
  onChange$?: QRL<(checked: boolean) => void>;
  class?: string;
}

export const CustomCheckbox = component$<CustomCheckboxProps>((props) => {
  const isChecked = props.checked;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      data-state={isChecked ? 'checked' : 'unchecked'}
      onClick$={() => props.onChange$ && props.onChange$(!isChecked)}
      class={[
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      ]}
    >
      {isChecked && (
        <span
          data-state="checked"
          data-slot="checkbox-indicator"
          class="flex items-center justify-center text-current transition-none"
          style="pointer-events: none;"
        >
          <LuCheck class="size-3.5" />
        </span>
      )}
    </button>
  );
});