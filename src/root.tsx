import { component$, isDev, useContextProvider, useStore } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import "./global.css";
import { NavContext, NavContextState } from "./utils/context/nav-items-context";
import { navItems, signatureNavItems, verifyNavItems, adminNavItems } from "./utils/navigation";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  const navStore = useStore<NavContextState>({
    navItems,
    signatureNavItems,
    verifyNavItems,
    adminNavItems
  });

  useContextProvider(NavContext, navStore);

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        <script dangerouslySetInnerHTML={`
          try {
            const storedTheme = localStorage.theme;
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute(
              'data-theme',
              storedTheme === 'dark' || (!storedTheme && systemDark) ? 'dark' : 'light'
            );
          } catch (e) {}
        `} />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang="en" class="bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10 h-screen overflow-hidden">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
