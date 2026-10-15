import type { Project } from "../schema";

export const wetterstrucksi: Project = {
  slug: "wetterstrucksi",
  title: "Wetterstrucksi.de",
  client: "Jens Strucks, Hobby-Meteorologe",
  year: "TODO(laurin): Jahr",
  role: {
    de: "TODO(laurin): Rolle (z. B. Konzept, Design & Entwicklung)",
    en: "TODO(laurin): role (e.g. concept, design & development)",
  },
  summary: {
    de: "Responsives Redesign und Migration von WordPress zu Ghost (headless) für Hobby-Meteorologen Jens Strucks und sein Publikum von über 10.000 Followern.",
    en: "Responsive redesign and migration from WordPress to headless Ghost for hobby meteorologist Jens Strucks and his audience of more than 10,000 followers.",
  },
  tagline: {
    de: "Kein Schnickschnack. Nur Wetter.",
    en: "No fluff. Just weather.",
  },
  stack: ["Ghost (headless)", "TODO(laurin): weiterer Stack"],
  problem: {
    de: "TODO(laurin): Ausgangslage – was war das Problem mit der alten WordPress-Seite?",
    en: "TODO(laurin): starting point – what was the problem with the old WordPress site?",
  },
  solution: {
    de: "TODO(laurin): Was wurde gebaut, und warum mit diesem Stack?",
    en: "TODO(laurin): what was built, and why with this stack?",
  },
  highlights: {
    de: [
      "Migration von WordPress zu Ghost (headless)",
      "Responsives Redesign",
      "TODO(laurin): weitere Highlights",
    ],
    en: [
      "Migration from WordPress to headless Ghost",
      "Responsive redesign",
      "TODO(laurin): more highlights",
    ],
  },
  results: {
    de: [
      "TODO(laurin): Ergebnisse (Ladezeit vorher/nachher, Reichweite, Feedback)",
    ],
    en: ["TODO(laurin): results (load time before/after, reach, feedback)"],
  },
  // TODO(laurin): Kundenzitat (mit Erlaubnis)? Öffentlicher Code?
  links: { live: "https://wetterstrucksi.de" },
  images: {
    cover: {
      src: "/images/projects/wetterstrucksi/laptop-mockup.webp",
      alt: {
        de: "Startseite von Wetterstrucksi.de auf einem Laptop: „Dein Ort für Wetter in Düsseldorf“ mit einem aktuellen Wetter-Update",
        en: "Wetterstrucksi.de homepage on a laptop: “Your place for weather in Düsseldorf” with a current weather update",
      },
      width: 2000,
      height: 1318,
    },
    gallery: [
      {
        src: "/images/projects/wetterstrucksi/mobile-mockup.webp",
        alt: {
          de: "Mobile Ansicht von Wetterstrucksi.de mit einem Wetter-Update",
          en: "Mobile view of Wetterstrucksi.de with a weather update",
        },
        width: 927,
        height: 2000,
      },
    ],
  },
  featured: true,
  order: 3,
};
