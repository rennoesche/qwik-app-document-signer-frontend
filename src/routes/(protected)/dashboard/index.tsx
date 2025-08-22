import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { NavContext } from '~/utils/context/nav-items-context';

export default component$(() => {
  const loc = useLocation();
  const navStore = useContext(NavContext);

  const label = useComputed$(()=>{
    const activeSidebar = navStore.navItems.find(
      i => i.href +"/" === loc.url.pathname || (loc.url.pathname.startsWith(i.href + "/") && loc.url.pathname !== i.href + "/")
    );
    return activeSidebar ? activeSidebar.label : 'Home';
  })
  
  return (
    <div class="bg-background border rounded-xl -mx-4">
      <header class="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
        <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <h1 class="text-base font-bold">{label.value}</h1>
        </div> 
      </header>
      <div class="relative flex h-full flex-col overflow-hidden" style={'position: relative; --radix-scroll-area-corner-width: 0px; --radix-scroll-area-corner-height: 0px;'}>
        tesaksjakjssakjshasshakjshk
      </div>
    </div>
  );
});
