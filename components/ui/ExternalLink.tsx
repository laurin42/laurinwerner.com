import type { ComponentProps } from "react";

/** Link to another site; never leaks the opener or the referrer. */
export function ExternalLink(props: Omit<ComponentProps<"a">, "rel">) {
  return <a {...props} rel="noopener noreferrer" />;
}
