/** @jsxImportSource react */

import { qwikify$ } from '@builder.io/qwik-react'

import { Sidebar as SidebarReact } from './components/sidebar'

export const Sidebar = qwikify$(SidebarReact, {eagerness: 'visible'})