import { createContextId } from '@builder.io/qwik';
import type { NavItem } from '~/utils/navigation';

export interface NavContextState {
  navItems: NavItem[];
  signatureNavItems: NavItem[];
  verifyNavItems: NavItem[];
  adminNavItems: NavItem[];
}

export const NavContext = createContextId<NavContextState>('nav-context');