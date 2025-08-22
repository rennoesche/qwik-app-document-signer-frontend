import { component$ } from '@builder.io/qwik';
import { LuUpload } from '@qwikest/icons/lucide';

export interface ButtonProps {

}

export const Button = component$<ButtonProps>((props) => {
  return (
    <button class="flex inline-flex bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-2.5 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium text-secondary-foreground shadow-xs cursor-pointer">
      <LuUpload class="size-4"/>
    </button>
  );
});
