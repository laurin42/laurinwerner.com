import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/** Open Graph image size recommended by LinkedIn, Facebook and X. */
export const ogSize = { width: 1200, height: 630 };

// The dark theme's tokens (app/globals.css) as hex: the renderer has no oklch.
// Dark, so the preview stands out in light social feeds.
const colors = {
  background: "#0a0a0a",
  foreground: "#f5f5f5",
  muted: "#a1a1a1",
  accent: "#f45246",
};

/**
 * Static Archivo instances (OFL, assets/fonts/): the renderer cannot read the
 * variable font the site uses. Display = 62.5 % width, 800; label = 600.
 */
async function fonts() {
  const dir = path.join(process.cwd(), "assets/fonts");
  const [display, label] = await Promise.all([
    readFile(path.join(dir, "Archivo-ExtraCondensedExtraBold.ttf")),
    readFile(path.join(dir, "Archivo-SemiBold.ttf")),
  ]);
  return [
    { name: "Display", data: display, weight: 800 as const },
    { name: "Label", data: label, weight: 600 as const },
  ];
}

/**
 * Splits a title into at most two lines of similar length at a word boundary,
 * so it can be set larger: "Praxis Janis Werner" → ["Praxis Janis", "Werner"].
 */
export function balanceLines(title: string): string[] {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length < 2) return [title];
  let best: string[] = [title];
  let bestLongest = Infinity;
  for (let split = 1; split < words.length; split++) {
    const lines = [
      words.slice(0, split).join(" "),
      words.slice(split).join(" "),
    ];
    const longest = Math.max(...lines.map((line) => line.length));
    if (longest < bestLongest) {
      best = lines;
      bestLongest = longest;
    }
  }
  return best;
}

type OgImageProps = {
  /** Small spaced line at the top, e.g. role and location. */
  label: string;
  /** Lines of the large display heading; the last one in red when `accentLast`. */
  lines: string[];
  accentLast?: boolean;
};

/** A share image in the site's typography: label on top, display heading below. */
export async function ogImage({
  label,
  lines,
  accentLast = false,
}: OgImageProps) {
  // Long titles get smaller, so every line fits the width.
  const longest = Math.max(...lines.map((line) => line.length));
  const fontSize = Math.min(250, Math.floor(2300 / Math.max(longest, 1)));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: colors.background,
        color: colors.foreground,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Label",
          fontSize: 28,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: colors.muted,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "Display",
          fontSize,
          lineHeight: 0.84,
          textTransform: "uppercase",
        }}
      >
        {lines.map((line, index) => (
          <div
            key={line}
            style={{
              display: "flex",
              color:
                accentLast && index === lines.length - 1
                  ? colors.accent
                  : colors.foreground,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>,
    { ...ogSize, fonts: await fonts() },
  );
}

/**
 * The site icon: the initials in the display face, "W" in red like the last
 * name, on black. `size` is the square's edge in pixels.
 */
export async function iconImage(size: number) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.background,
        fontFamily: "Display",
        fontSize: size * 0.78,
        lineHeight: 1,
        // The display face sits high in its line box; this centers the caps.
        paddingTop: size * 0.06,
      }}
    >
      <span style={{ color: colors.foreground }}>L</span>
      <span style={{ color: colors.accent }}>W</span>
    </div>,
    { width: size, height: size, fonts: await fonts() },
  );
}
