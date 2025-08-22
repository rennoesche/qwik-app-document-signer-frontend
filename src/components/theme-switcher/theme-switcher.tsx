import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { LuMoon, LuSun } from '@qwikest/icons/lucide';

export default component$(() => {
  const theme = useSignal<'light'|'dark'>('light');

  const applyTheme = $(() => {
    const html = document.documentElement;
    
    localStorage.setItem('theme', theme.value);
    html.setAttribute('data-theme', theme.value);
    html.classList.remove('light', 'dark');
    html.classList.add(theme.value);
  });


  useVisibleTask$(() => {
    const savedTheme = localStorage.getItem('theme');
    theme.value = savedTheme === 'dark' ? 'dark' : 'light';
    applyTheme();
  });

  useVisibleTask$(({ track }) => {
    track(() => theme.value);
    applyTheme();
  });

  return (
    <div class="hidden md:flex items-center p-1 rounded-full">
      <button
        onClick$={() => theme.value = theme.value === 'light' ? 'dark' : 'light'}
        class="p-2 rounded-full transition-all duration-300 hover:bg-accent cursor-pointer"
        aria-label={theme.value === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme.value === 'light' ? (
          <LuMoon class="size-6" />
        ) : (
          <LuSun class="size-6" />
        )}
      </button>
    </div>
  );
});