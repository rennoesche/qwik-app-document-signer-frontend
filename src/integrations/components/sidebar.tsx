/** @jsxImportSource react */
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { iconMap, homeMenu, certMenu, verifyMenu } from '../data/menu-items'
import { ScrollArea } from '~/components/ui/scroll-area'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  home: typeof homeMenu
  cert: typeof certMenu
  verify: typeof verifyMenu
  currentPath: string
}

export function Sidebar({ className, home, cert, verify, currentPath }: SidebarProps) {
  return (
    <div className={cn('pb-12', className)}>
      <div className='py-4 space-y-4'>
        <ScrollArea>
        <div className='py-2'>
          <h2 className='px-6 text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2'>
            Home
          </h2>
            <div className='space-y-1 px-4'>
              {home?.map((m) => {
                const IconComponent = iconMap[m.icon as keyof typeof iconMap]
                const isActive = currentPath === m.href
                return(
                  <a href={m.href} key={m.label}>
                    <Button
                      key={m.label}
                      variant={isActive ? 'default': 'ghost'}
                      size='sm'
                      className='w-full justify-start'
                    >
                      {IconComponent && <IconComponent className='mr-2 size-4' />}
                      {m.label}
                    </Button>  
                  </a>
                )
              })}
            </div>
        </div>
        <div className='py-2'>
          <h2 className='px-6 text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2'>
            Sertifikat
          </h2>
            <div className='space-y-1 px-4'>
              {cert?.map((m) => {
                const IconComponent = iconMap[m.icon as keyof typeof iconMap]
                const isActive = currentPath === m.href
                return(
                  <a href={m.href} key={m.label}>
                    <Button
                      key={m.label}
                      variant={isActive ? 'default': 'ghost'}
                      size='sm'
                      className='w-full justify-start'
                    >
                      {IconComponent && <IconComponent className='mr-2 size-4' />}
                      {m.label}
                    </Button>
                  </a>
                )
              })}
            </div>
        </div>
        <div className='py-2'>
          <h2 className='px-6 text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2'>
            Verifikasi
          </h2>
            <div className='space-y-1 px-4'>
              {verify?.map((m) => {
                const IconComponent = iconMap[m.icon as keyof typeof iconMap]
                const isActive = currentPath === m.href
                return(
                  <a href={m.href} key={m.label}>
                    <Button
                  key={m.label}
                  variant={isActive ? 'default': 'ghost'}
                  size='sm'
                  className='w-full justify-start'
                >
                  {IconComponent && <IconComponent className='mr-2 size-4' />}
                  {m.label}
                </Button>
                  </a>
                )
              })}
            </div>
        </div>
        </ScrollArea>
      </div>
    </div>
  )
}