import { createContextId, useContextProvider, useStore } from '@builder.io/qwik';

export const SidebarContext = createContextId<{ 
  isOpen: boolean; 
  isMinified: boolean; 
  toggleOpen: () => void;
  toggleMinified: () => void;
}>('sidebar.context');

export const SidebarProvider = (props: { children: any }) => {
  const state = useStore({
    isOpen: true,
    isMinified: false,
    toggleOpen: () => (state.isOpen = !state.isOpen),
    toggleMinified: () => (state.isMinified = !state.isMinified),
  });

  useContextProvider(SidebarContext, state);
  return <>{props.children}</>;
};
