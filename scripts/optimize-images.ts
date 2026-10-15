/**
 * Converts project screenshots to WebP for `public/images/projects/`.
 *
 * Usage: pnpm images <source-dir> [output-dir]
 *
 * The source directory contains one folder per project slug:
 *   <source-dir>/<slug>/<name>.(png|jpg|jpeg|webp|avif)
 * Each image is scaled to fit inside MAX_SIZE × MAX_SIZE (never enlarged) and
 * written to <output-dir>/<slug>/<kebab-name>.webp. The output directory defaults
 * to public/images/projects; use public/images for non-project images (e.g. a
 * `profile/` folder with the portrait).
 * Originals stay outside the repo.
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const MAX_SIZE = 2000;
export const QUALITY = 80;
export const TARGET_BYTES = 300 * 1024;
export const OUTPUT_DIR = path.join("public", "images", "projects");

const SOURCE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

/** `laptopMockup` → `laptop-mockup`, `Mobile Shot_2` → `mobile-shot-2`. */
export function kebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

/** Output path for a source file, or `null` if the file is not an image. */
export function outputPath(
  slug: string,
  fileName: string,
  outputDir: string = OUTPUT_DIR,
): string | null {
  const { name, ext } = path.parse(fileName);
  if (!SOURCE_EXTENSIONS.has(ext.toLowerCase())) return null;
  return path.join(outputDir, kebabCase(slug), `${kebabCase(name)}.webp`);
}

async function convert(source: string, target: string) {
  await mkdir(path.dirname(target), { recursive: true });
  const info = await sharp(source)
    .resize({
      width: MAX_SIZE,
      height: MAX_SIZE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(target);
  return { width: info.width, height: info.height, bytes: info.size };
}

async function main(sourceDir: string | undefined, outputDir = OUTPUT_DIR) {
  if (!sourceDir) {
    console.error("Usage: pnpm images <source-dir> [output-dir]");
    process.exit(1);
  }

  let oversized = 0;

  for (const slug of await readdir(sourceDir)) {
    const dir = path.join(sourceDir, slug);
    // stat() follows symlinks, so linked source folders work too.
    if (!(await stat(dir)).isDirectory()) continue;

    for (const file of await readdir(dir)) {
      const target = outputPath(slug, file, outputDir);
      if (!target) continue;

      const source = path.join(dir, file);
      const before = (await stat(source)).size;
      const { width, height, bytes } = await convert(source, target);
      const flag = bytes > TARGET_BYTES ? "  ⚠ over target" : "";
      if (flag) oversized++;
      console.log(
        `${target}  ${width}×${height}  ${(before / 1024).toFixed(0)} KB → ${(bytes / 1024).toFixed(0)} KB${flag}`,
      );
    }
  }

  if (oversized > 0) {
    console.warn(`${oversized} image(s) exceed ${TARGET_BYTES / 1024} KB.`);
  }
}

if (import.meta.main) {
  await main(process.argv[2], process.argv[3]);
}
