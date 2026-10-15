import { notFound } from "next/navigation";

// Unknown paths inside a locale render the localized not-found page with header
// and footer, instead of Next's unstyled default 404.
export default function CatchAllPage() {
  notFound();
}
