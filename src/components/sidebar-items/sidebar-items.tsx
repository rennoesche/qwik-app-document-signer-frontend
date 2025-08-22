import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

export interface SidebarItemsProps {
  href: string;
  icon: any;
  label: string;
  style?: string[];
  styles?: any;
}

export const SidebarItems = component$<SidebarItemsProps>(({href, icon: IconComponent, label, style, styles}) => {
  const loc = useLocation();
  const isActive = loc.url.pathname === href +"/" || (loc.url.pathname.startsWith(href + "/") && loc.url.pathname !== href + "/");
  
  return (
    <Link
    href={href}
    class={[
      'flex items-center py-3 px-3.5 gap-x-2 font-medium text-sm rounded-lg group sidebar-items',
      isActive ? 'bg-primary text-primary-foreground font-semibold' :'',
    ]}
    >
      <span {...styles}>
        <IconComponent class="size-5" />
      </span>
      <span class={`${style ?? ''}`}>{label}</span>
    </Link>
  );
});
