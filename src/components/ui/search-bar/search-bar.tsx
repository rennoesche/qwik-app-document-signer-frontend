import { component$ } from '@builder.io/qwik';
import { LuSearch } from '@qwikest/icons/lucide';

export interface SearchBarProps {

}

export const SearchBar = component$<SearchBarProps>((props) => {
  return (
    <div class="relative">
      <input class="outline-none rounded-md px-3 py-2 bg-transparent border border-input text-sm outline-none bg-transparent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pr-10" placeholder='Cari di sini...'/>
      <LuSearch class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
    </div>
  );
});
