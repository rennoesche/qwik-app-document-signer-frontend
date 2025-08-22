import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Form, routeLoader$, routeAction$, useNavigate } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import { LuEye, LuEyeOff } from "@qwikest/icons/lucide";

async function verifyToken(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:8000/api/auth/verify-token', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      }
    });

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export const onGet: RequestHandler = async ({ redirect }) => {
  if (await verifyToken()) {
    throw useNavigate()('/dashboard');
  }
};

export const useRedirectIfLoggedIn = routeLoader$(async ({ cookie, redirect }) => {
  const accessToken = cookie.get('access_token')?.value;
  
  if (accessToken && await verifyToken()) {
    throw useNavigate()('/dashboard');
  }
  
  return { isAuthenticated: false };
});

export const useLoginAction = routeAction$(async (data, { cookie, fail, redirect }) => {
  const formData = new URLSearchParams();
  formData.append('username', String(data.username));
  formData.append('password', String(data.password));
  formData.append('grant_type', 'password');
  formData.append('scope', '');

  try {
    const response = await fetch('http://127.0.0.1:8000/api/auth/get-token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include' // Penting!
    });

    if (!response.ok) {
      const errorData = await response.json();
      return fail(response.status, {
        message: errorData.detail || 'Login failed'
      });
    }

    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const cookieValue = setCookieHeader.split(';')[0].split('=')[1];
      cookie.set('access_token', cookieValue, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false 
      });
    }

    return { success: true };
    
  } catch (error) {
    return fail(500, {
      message: 'Network error. Please try again.',
    });
  }
});

export default component$(() => {
  const isChecked = useSignal(false);
  const loginAction = useLoginAction();
  const passwordVisible = useSignal(false);
  const nav = useNavigate();

  useTask$(({ track }) => {
    track(() => loginAction.value?.success);
    if (loginAction.value?.success) {
      nav('/dashboard'); 
    }
  });

  return (
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-center">Masuk ke Akun Anda</h2>
        <p class="mt-2 text-sm text-center">
          Atau{" "}
          <a href="/request-access" class="font-medium hover:underline">
            minta akses akun
          </a>
        </p>
      </div>

      {/* {state?.error && (
        <div class="p-3 rounded-md text-sm bg-secondary text-secondary-foreground">
          {state.error}
        </div>
      )} */}

      <Form action={loginAction} class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium">
            Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            class="mt-1 px-3 py-2 block w-full rounded-md border border-input outline-none bg-transparent shadow-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            placeholder="user@example.com"
          />
        </div>

        <div class="relative">
          <label for="password" class="block text-sm font-medium text-foreground mb-1">
            Password
          </label>
          <div class="relative">
            <input
              type={passwordVisible.value ? "text" : "password"}
              id="password"
              name="password"
              required
              class="mt-1 px-3 py-2 block w-full rounded-md border border-input outline-none bg-transparent shadow-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick$={() => (passwordVisible.value = !passwordVisible.value)}
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm cursor-pointer"
              aria-label={passwordVisible.value ? "Hide password" : "Show password"}
            >
              {passwordVisible.value ? (
                <LuEye class="size-5" />
              ) : (
                <LuEyeOff class="size-5" />
              )}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button
              id="remember-me"
              name="remember-me"
              type="button"
              role="switch"
              aria-checked={isChecked.value}
              onClick$={() => (isChecked.value = !isChecked.value)}
              class={`ms-1 relative inline-flex h-4 w-8 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-primary ${
                isChecked.value ? "bg-primary" : "bg-input"
              }`}
            >
              <span
                class={`block size-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  isChecked.value ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <label for="remember-me" class="block text-sm">
              Ingat saya
            </label>
          </div>

          <div class="text-sm">
            <a
              href="/auth/forgot-password"
              class="font-medium text-primary hover:text-primary/80 hover:underline"
            >
              Lupa password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="w-full bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring"
          >
            Masuk
          </button>
        </div>
      </Form>
    </div>
  );
});
