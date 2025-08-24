import { routeLoader$ } from "@builder.io/qwik-city";

export const useAuthCheck = routeLoader$(async ({ cookie, redirect }) => {
  const authToken = cookie.get('access_token')?.value
  if (!authToken) {
    throw redirect(302, '/login')
  }
  if (authToken) {
    throw redirect(302, '/dashboard')
  }
  return {
    isLoggedIn: !!authToken,
    user: authToken ? authToken : null
  }
})

export default () => null