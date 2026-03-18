import tailwindcss from "@tailwindcss/vite";

import { cities } from "./app/data/cities";
import { services } from "./app/data/services";

const nitroPreset = process.env.NITRO_PRESET || (process.env.VERCEL ? "vercel" : undefined);
const shouldPrecompressPublicAssets = nitroPreset !== "vercel";

const staticRoutes = [
  "/",
  "/o-kompanii/",
  "/faq/",
  "/dostavka-po-kazahstanu/",
  "/oplata-i-garantiya/",
  "/politika-konfidentsialnosti/",
  "/cases/",
  "/robots.txt",
  "/sitemap.xml",
  ...services
    .filter((service) => service.status === "published")
    .map((service) => `/uslugi/${service.slug}/`),
  ...cities
    .filter((city) => city.status === "published")
    .map((city) => `/goroda/${city.slug}/`)
];

export default defineNuxtConfig({
  compatibilityDate: "2025-03-01",
  srcDir: "app/",
  modules: [],
  components: [
    {
      path: "~/components",
      pathPrefix: false
    }
  ],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true  },
  typescript: {
    strict: true,
    // `nuxt dev` uses vite-plugin-checker here, which is unstable on pnpm + Windows.
    // Keep runtime clean and run explicit `nuxt typecheck` from package scripts instead.
    typeCheck: false
  },
  vite: {
    plugins: [tailwindcss() as never]
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "ru"
      },
      bodyAttrs: {
        class: "bg-canvas text-ink antialiased"
      },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#111317" },
        { name: "format-detection", content: "telephone=no" }
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/icons/favicon.svg" }]
    }
  },
  runtimeConfig: {
    leadSalt: "replace-this-in-production",
    public: {
      siteUrl: "https://example.com",
      siteName: "Neon Market",
      defaultOgImage: "/og/default-site.svg"
    }
  },
  nitro: {
    preset: nitroPreset,
    // Vercel already negotiates compression at the edge. Shipping precompressed
    // `.html.br` / `.html.gz` sidecars into the static output can be mis-served
    // as downloadable artifacts instead of HTML documents.
    compressPublicAssets: shouldPrecompressPublicAssets,
    prerender: {
      routes: staticRoutes
    }
  },
  routeRules: {
    "/": { prerender: true },
    "/o-kompanii/": { prerender: true },
    "/faq/": { prerender: true },
    "/dostavka-po-kazahstanu/": { prerender: true },
    "/oplata-i-garantiya/": { prerender: true },
    "/politika-konfidentsialnosti/": { prerender: true },
    "/cases/**": { prerender: true },
    "/uslugi/**": { prerender: true },
    "/goroda/**": { prerender: true },
    "/robots.txt": { prerender: true },
    "/sitemap.xml": { prerender: true }
  }
});
