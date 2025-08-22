import { component$, useSignal, $, useContext, QRL } from '@builder.io/qwik';
import { LuChevronDown, LuChevronLeft, LuMenu } from '@qwikest/icons/lucide';
import { SidebarItems } from '../sidebar-items/sidebar-items';
import { LucideIcon } from '../icon/lucide-icons';
import { SidebarContext } from '../../utils/context/sidebar-context';
import { NavContext } from '../../utils/context/nav-items-context';


export const SidebarMenu = component$(() => {
  const sidebar = useContext(SidebarContext);
  const isSignatureDropdownOpen = useSignal(false);
  const isVerifyDropdownOpen = useSignal(false);

  const navStore = useContext(NavContext);

  return (
    <>
      {/* Navigation Toggle (Mobile) */}
      <div class="md:hidden w-full bg-card/60 shadow-sm">
        <button
          type="button"
          onClick$={() => (sidebar.isOpen = true)&&(sidebar.isMinified = false)}
          class="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start text-sm font-medium rounded-lg align-middle focus:outline-none hover:bg-accent"
          aria-label="Toggle navigation"
        >
          <LuMenu class="size-5"/>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebar.isOpen && (
        <div
          class="lg:hidden fixed inset-0 z-50 left-64"
          onClick$={() => (sidebar.isOpen = false)}
        ></div>
      )}

      <div
        class={[
          'fixed z-30 h-full left-0 sidebar bg-sidebar flex',
          'transition-all duration-600 ease-in-out text-sm',
          'overflow-y-auto',
          sidebar.isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
          sidebar.isMinified ? 'w-16' : 'w-64'
        ]}
        aria-label="Sidebar"
      >
        <div class="h-full px-2 py-4 overflow-y-auto w-full flex flex-col">
          {/* Minify/Expand Toggle (Desktop only) */}
          <div class={`hidden md:flex transition-all w-full duration-600 pb-2 w-fit justify-end pe-1`}>
            <button
              onClick$={() => (sidebar.isMinified = !sidebar.isMinified)}
              class="bg-background rounded-lg p-2 hover:bg-accent cursor-pointer"
              aria-label={sidebar.isMinified ? "Expand sidebar" : "Minify sidebar"}
            >
              <LuChevronLeft class={[
                'size-5',
                'transition-transform duration-300',
                sidebar.isMinified ? 'rotate-180' : ''
              ]} />
            </button>
          </div>

          <ul class="space-y-2 menu">
          {navStore.navItems.map((item) => (
            <li key={item.href}>
            <SidebarItems
              href={item.href}
              icon={item.icon}
              styles={{
                class:`flex-shrink-0 size-5 flex items-center justify-center ${sidebar.isMinified ? 'transition-all duration-600 ease-in-out' : 'transition-all duration-400 ease-in'}`
              }}
              label={item.label}
              style={[
                `ms-3 whitespace-nowrap transition-all transition-discrete duration-300 ${sidebar.isMinified ? 'hidden opacity-0' : 'opacity-100'}`,
              ]}
            />
            </li>
          ))}
          <hr/>
          <li key='signature-dropdown'>
              <button
                onClick$={() => {if (!sidebar.isMinified) {
                  isSignatureDropdownOpen.value = !isSignatureDropdownOpen.value;
                }}}
                class={`flex items-center p-3 rounded-lg group hover:bg-accent font-medium text-sm transition-colors duration-200 ${
                  sidebar.isMinified ? 'w-12 justify-center' : 'w-full'
                } ${
                  isSignatureDropdownOpen.value ? 'bg-primary/50' : ''
                }`}
              >
                <LucideIcon key={'icon-signature-lucide'} name="Signature" className={`
                  flex-shrink-0 size-5
                  ${sidebar.isMinified ? 'transition-all duration-300 ease-in-out' : 'transition-all duration-400 ease-in'}
                `} />
                
                <span class={`ms-3 flex grow justify-between whitespace-nowrap transition-all duration-300 ease-in-out ${sidebar.isMinified ? 'opacity-0 w-0 overflow-hidden hidden' : 'opacity-100'}`}>
                  <span class={`transition-all duration-300 ease-in-out
                  ${sidebar.isMinified ? 'hidden opacity-0' : 'opacity-100 w-auto'}
                `}>
                  Tanda Tangan
                </span>
                  <LuChevronDown class={`
                  size-5 transition-all duration-300 ease-in-out
                  ${isSignatureDropdownOpen.value ? 'rotate-180' : 'rotate-0'}
                `} />
                </span>
              </button>
              <ul class={`mt-0 vertical transition-all ease-in-out duration-300 ${sidebar.isMinified ? 'absolute left-full ml-2 top-0 bg-sidebar shadow-lg rounded-md z-10 min-w-[200px]' : ''} ${
                  isSignatureDropdownOpen.value ? 'block opacity-100' : 'hidden opacity-0'
                }`} role="menu" aria-orientation="vertical" aria-labelledby="dropdown-default">
                {navStore.signatureNavItems.map((item) => (
                  <li key={item.href} class="ms-2 border-l">
                    <SidebarItems
                    href={item.href}
                    icon={item.icon}
                    styles={{
                      class:`flex-shrink-0 size-5 flex items-center justify-center ${sidebar.isMinified ? 'transition-all duration-600 ease-in-out ms-2' : 'transition-all duration-400 ease-in'}`
                    }}
                    label={item.label}
                    style={[
                      `ms-3 whitespace-nowrap transition-all transition-discrete duration-300 ${sidebar.isMinified ? 'hidden opacity-0' : 'opacity-100'}`,
                    ]}
                    />
                  </li>
                ))}
              </ul>
          </li>
          <hr/>
          <li key='verify-dropdown'>
              <button
                onClick$={() => {if (!sidebar.isMinified) {
                  isVerifyDropdownOpen.value = !isVerifyDropdownOpen.value;
                }}}
                class={`flex items-center p-3 rounded-lg group hover:bg-accent font-medium text-sm transition-colors duration-200 ${
                  sidebar.isMinified ? 'w-12 justify-center' : 'w-full'
                } ${
                  isVerifyDropdownOpen.value ? 'bg-primary/50' : ''
                }`}
              >
                <LucideIcon key={'icon-verify-lucide'} name="Check" className={`
                  flex-shrink-0 size-5
                  ${sidebar.isMinified ? 'transition-all duration-300 ease-in-out' : 'transition-all duration-400 ease-in'}
                `} />
                <span class={`flex grow justify-between ms-3 whitespace-nowrap transition-all duration-300 ease-in-out ${sidebar.isMinified ? 'hidden opacity-0' : 'opacity-100 w-auto'}`}>
                  <span class={`transition-all duration-300 ease-in-out
                  ${sidebar.isMinified ? 'hidden opacity-0' : 'opacity-100 w-auto'}
                  `}>
                  Verifikasi
                </span>
                  <LuChevronDown class={`
                  size-5 transition-all duration-300 ease-in-out
                  ${isVerifyDropdownOpen.value ? 'rotate-180' : 'rotate-0'}
                `} />
                </span>
              </button>
              <ul class={`mt-0 vertical transition-all ease-in-out duration-300 ${sidebar.isMinified ? 'absolute left-full ml-2 top-0 bg-sidebar shadow-lg rounded-md z-10 min-w-[200px]' : ''} ${
                  isVerifyDropdownOpen.value ? 'block opacity-100' : 'hidden opacity-0'
                }`} role="menu" aria-orientation="vertical" aria-labelledby="dropdown-default">
                {navStore.verifyNavItems.map((item) => (
                  <li key={item.href} class="ms-2 border-l">
                    <SidebarItems
                    href={item.href}
                    icon={item.icon}
                    styles={{
                      class:`flex-shrink-0 size-5 flex items-center justify-center ${sidebar.isMinified ? 'transition-all duration-600 ease-in-out ms-2' : 'transition-all duration-400 ease-in'}`
                    }}
                    label={item.label}
                    style={[
                      `ms-3 whitespace-nowrap transition-all transition-discrete duration-300 ${sidebar.isMinified ? 'hidden opacity-0' : 'opacity-100'}`,
                    ]}
                    />
                  </li>
                ))}
              </ul>
          </li>

          </ul>

          {/* <ul class="space-y-2">
            <li>
              <a
                href="#"
                class={[
                  'flex items-center p-2 rounded-lg',
                  'group'
                ]}
              >
                <span class={[
                  'flex-shrink-0',
                  'size-5 flex items-center justify-center',
                ]}>
                  <LuHome class="size-5" />
                </span>
                {!sidebar.isMinified && (<span class={[
                  'ms-3 whitespace-nowrap',
                  'font-medium',
                  'transition-opacity duration-200',
                  sidebar.isMinified ? 'opacity-0 absolute' : 'opacity-100'
                ]}>
                  Dashboard
                </span>
                )}
              </a>
            </li>
            <li>
              <a
                href="#"
                class={[
                  'flex items-center p-2 rounded-lg',
                  'group'
                ]}
              >
                <span class={[
                  'flex-shrink-0',
                  'size-5 flex items-center justify-center',
                ]}>
                  <LuCalendar class="size-5" />
                </span>
                
                {!sidebar.isMinified && (
                  <>
                    <span class="ms-3">Calendar</span>
                    <span class="ms-auto inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full">
                      New
                    </span>
                  </>
                )}
              </a>
            </li>
            <li>
              <a
                href="#"
                class={[
                  'flex items-center p-2 rounded-lg',
                  'group'
                ]}
              >
                <span class={[
                  'flex-shrink-0',
                  'size-5 flex items-center justify-center',
                ]}>
                  <LuBookOpen class="size-5" />
                </span>
                {!sidebar.isMinified && <span class="ms-3">Documentation</span>}
              </a>
            </li>
          </ul> */}
        </div>
      </div>
    </>
  );
});
