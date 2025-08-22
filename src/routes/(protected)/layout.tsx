import { component$, Slot, useStore, useContextProvider, $ } from '@builder.io/qwik';
import { SidebarContext } from '~/utils/context/sidebar-context';
import { SidebarMenu } from '~/components/sidebarMenu/sidebarMenu';
import Navbar from '~/components/navbar/navbar';
import { routeLoader$ } from '@builder.io/qwik-city';

export const useAuthCheck = routeLoader$(async ({ cookie, redirect }) => {
  const authToken = cookie.get('access_token')?.value;
  if (!authToken) {
    throw redirect(302, '/login');
  }
  return {
    isLoggedIn: !!authToken,
    user: authToken ? authToken : null
  };
});


export default component$(() => {
  useAuthCheck();
  const sidebar = useStore({
    isOpen: false,
    isMinified: false,
  });

  useContextProvider(SidebarContext, sidebar);

  return (
    <>
      {/* <Navbar /> */}
      <div class="flex w-full lg:flex-row flex-col mx-auto h-full overflow-hidden">
        <aside class="shrink-0">
          <SidebarMenu/>
        </aside>
          <main
            class={`flex-1 py-2 px-6 overflow-hidden ${
              sidebar.isMinified ? 'md:ml-16' : 'lg:ml-64'
            } transition-all ease-in-out duration-600`}
          >
              <Slot />
          </main>
      </div>
    </>
  );
});
