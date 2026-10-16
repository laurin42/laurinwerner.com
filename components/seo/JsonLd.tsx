import { serializeJsonLd } from "@/lib/metadata";

/** Structured data for search engines, rendered into the page (not executed). */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
