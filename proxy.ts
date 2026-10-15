import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except Next.js internals, the monitoring tunnel and files with an
  // extension (favicon.ico, images, robots.txt, …).
  matcher: ["/((?!_next|monitoring|.*\\..*).*)"],
};
