import { component$, Slot } from '@builder.io/qwik'
import { Sidebar } from '~/integrations/islands'
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
        <div class="grid lg:grid-cols-6 h-screen">
            <Sidebar client:visible home={homeMenu} cert={certMenu} verify={verifyMenu} currentPath={loc.url.pathname} className='hidden lg:block' />
            <div class="col-span-3 lg:col-span-4 lg:border-l">
                <div class="h-full">
                    <Slot/>
                </div>
            </div>
        </div>
    )
})
