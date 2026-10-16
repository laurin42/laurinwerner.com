import { iconImage } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon on iOS. */
export default async function AppleIcon() {
  return iconImage(size.width);
}
