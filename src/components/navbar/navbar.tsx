import { component$ } from '@builder.io/qwik';
import { LuBell } from '@qwikest/icons/lucide';
import ThemeSwitcher from '../theme-switcher/theme-switcher';

export default component$(() => {
  return (
    <header class="sticky top-0 z-50 w-full backdrop-blur-xl border-b bg-background/1 h-16 items-center">
    <nav class="max-w-[1400px] ml-auto mr-auto items-center flex relative h-full">
          {/* Logo/Brand */}
          <div class="p-4 flex items-center">
            <a href="/" class="text-xl font-bold">
              {import.meta.env.VITE_APP_NAME}
            </a>
          </div>


          {/* Right Side (Auth/Buttons) */}
          <div class="grow flex justify-end h-full p-4 items-center">
            <div class="ml-4 flex items-center md:ml-6 space-x-2">
              <button class="p-2 rounded-full focus:outline-none hover:bg-accent cursor-pointer">
                <span class="sr-only">Notifikasi</span>
                <LuBell class="size-6"/>
              </button>
              <ThemeSwitcher/>
            </div>
          </div>
    </nav>
    </header>
  );
});