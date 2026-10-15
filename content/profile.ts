import type { Profile } from "./schema";

export const profile: Profile = {
  name: "Laurin Werner",
  role: { de: "Frontend-Entwickler", en: "Frontend Developer" },
  location: "Düsseldorf",
  portrait: {
    src: "/images/profile/portrait.webp",
    alt: { de: "Porträt von Laurin Werner", en: "Portrait of Laurin Werner" },
    width: 852,
    height: 1136,
  },
  tagline: {
    de: "TODO(laurin): Ein Satz Positionierung für den Hero",
    en: "TODO(laurin): one-sentence positioning for the hero",
  },
  availability: {
    de: "Offen für eine Festanstellung in NRW oder remote",
    en: "Open to a full-time position in NRW or remote",
  },
  about: {
    de: "TODO(laurin): Kurzer Text über dich",
    en: "TODO(laurin): short text about yourself",
  },
  email: "laurin.werner@protonmail.com",
  links: {
    github: "https://github.com/laurin42",
    // TODO(laurin): Update once the LinkedIn profile URL carries the new name.
    linkedin: "https://www.linkedin.com/in/laurin-schmidt-650008330/",
  },
  // TODO(laurin): CV as PDF (D6), then set `cv: "/cv/<file>.pdf"`.
  stack: [
    {
      group: { de: "Frontend", en: "Frontend" },
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "HTML",
        "CSS",
        "Tailwind CSS",
      ],
    },
    {
      group: { de: "Backend", en: "Backend" },
      items: [
        "Node.js",
        "Express",
        "PostgreSQL",
        "Drizzle ORM",
        "Payload CMS",
        "Python",
        "Django",
      ],
    },
    {
      group: { de: "Werkzeuge und Betrieb", en: "Tooling and operations" },
      items: [
        "Git",
        "GitHub Actions",
        "Docker",
        "Coolify",
        "Netdata",
        "GlitchTip",
      ],
    },
  ],
};
