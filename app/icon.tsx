import { iconImage } from "@/lib/og";

const sizes = [32, 192, 512];

/** Browser tab (32) and the web app manifest (192, 512). */
export function generateImageMetadata() {
  return sizes.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  return iconImage(Number(await id));
}
