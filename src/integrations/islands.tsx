/** @jsxImportSource react */

import { qwikify$ } from '@builder.io/qwik-react'

import { Sidebar as SidebarReact } from './components/sidebar'
import { Menu as MenuReact } from './components/menu'
import { MobileMenu as MobileMenuReact } from './components/mobile-menu'

export const Sidebar = qwikify$(SidebarReact, {eagerness: 'visible'})
export const Menu = qwikify$(MenuReact, {eagerness: 'visible'})
export const MobileMenu = qwikify$(MobileMenuReact, {eagerness: 'visible'})