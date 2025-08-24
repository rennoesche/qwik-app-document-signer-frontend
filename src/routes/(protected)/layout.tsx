import { component$, Slot } from '@builder.io/qwik'
import { Menu, MobileMenu, Sidebar } from '~/integrations/islands'
import { routeLoader$, useLocation } from '@builder.io/qwik-city'
import { certMenu, homeMenu, verifyMenu } from '~/integrations/data/menu-items'

export const useAuthCheck = routeLoader$(async ({cookie, redirect}) => {
    const authToken = cookie.get('access_token')?.value
    if (!authToken) {
        throw redirect(302, '/login')
    }
    return {
        isLoggedIn: !!authToken,
        user: authToken ? authToken : null
    }
})

export default component$(() => {
    useAuthCheck()
    const loc = useLocation()

    return (
        <div class="grid grid-rows-[auto_1fr] h-screen">
            <div class="bg-sidebar h-10 px-4 flex items-center justify-between lg:grid lg:grid-cols-6 lg:px-0">
                <div class="lg:col-span-1 lg:mx-auto">
                    <h1 class="font-bold">{import.meta.env.VITE_APP_NAME}</h1>
                </div>

                <div class="hidden lg:block lg:col-span-5 border-l bg-background">
                    <Menu/>
                </div>

                <div class="lg:hidden">
                    <MobileMenu/>
                </div>
            </div>

            <div class="border-t overflow-auto">
                <div class="bg-[image:repeating-linear-gradient(225deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10 h-full">
                    <div class="grid grid-cols-1 lg:grid-cols-6 h-full">
                        <div class="hidden lg:block bg-sidebar h-full">
                            <Sidebar client:visible home={homeMenu} cert={certMenu} verify={verifyMenu} currentPath={loc.url.pathname} />
                        </div>
                        <div class="col-span-1 lg:col-span-5 lg:border-l">
                            <div class="h-full px-2 py-6 lg:p-6">
                                <Slot/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
