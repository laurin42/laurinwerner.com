import type { MetadataRoute } from "next";
import { getProfile } from "@/content";
import { routing } from "@/i18n/routing";

export default function manifest(): MetadataRoute.Manifest {
  const profile = getProfile(routing.defaultLocale);
  return {
    name: `${profile.name} – ${profile.role}`,
    short_name: profile.name,
    description: profile.description,
    lang: routing.defaultLocale,
    start_url: "/",
    // A website, not an app: opening it from the home screen keeps the browser UI.
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    icons: [192, 512].map((size) => ({
      src: `/icon/${size}`,
      sizes: `${size}x${size}`,
      type: "image/png",
    })),
  };
}
