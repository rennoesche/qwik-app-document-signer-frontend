import { component$, Slot } from '@builder.io/qwik';


export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col bg-card">

      <main class="flex-grow flex items-center justify-center p-4 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]">
        <div class="w-full max-w-md rounded-lg shadow-md p-8 bg-background text-card-foreground">
          <Slot /> 
        </div>
      </main>

      <footer class="py-4 text-center text-sm">
        © 2025 MyApp. All rights reserved.
      </footer>
    </div>
  );
});