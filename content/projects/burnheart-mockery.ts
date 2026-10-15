import type { Project } from "../schema";

export const burnheartMockery: Project = {
  slug: "burnheart-mockery",
  title: "Burnheart Mockery",
  client: "Burnheart Mockery, Band",
  year: "TODO(laurin): Jahr",
  role: {
    de: "TODO(laurin): Rolle (z. B. Konzept, Design & Entwicklung)",
    en: "TODO(laurin): role (e.g. concept, design & development)",
  },
  summary: {
    de: "Individuelle, responsive Band-Website mit Kontaktformular, Newsletter-System und integriertem Audio-Player für aktuelle Releases.",
    en: "A custom, responsive band website with a contact form, newsletter system and an integrated audio player for the latest releases.",
  },
  tagline: {
    de: "Custom-Riffs online.",
    en: "Custom riffs online.",
  },
  stack: ["TODO(laurin): Stack"],
  problem: {
    de: "TODO(laurin): Ausgangslage – was war das Problem oder der Wunsch der Band?",
    en: "TODO(laurin): starting point – what was the band's problem or goal?",
  },
  solution: {
    de: "TODO(laurin): Was wurde gebaut, und warum mit diesem Stack?",
    en: "TODO(laurin): what was built, and why with this stack?",
  },
  highlights: {
    de: [
      "Integrierter Audio-Player für aktuelle Releases",
      "Newsletter-System",
      "Kontaktformular",
    ],
    en: [
      "Integrated audio player for the latest releases",
      "Newsletter system",
      "Contact form",
    ],
  },
  results: {
    de: ["TODO(laurin): Ergebnisse (Lighthouse, Ladezeit, Feedback der Band)"],
    en: [
      "TODO(laurin): results (Lighthouse, load time, feedback from the band)",
    ],
  },
  // TODO(laurin): Kundenzitat (mit Erlaubnis)? Öffentlicher Code?
  links: { live: "https://burnheart-mockery.de" },
  images: {
    cover: {
      src: "/images/projects/burnheart-mockery/laptop-mockup.webp",
      alt: {
        de: "Startseite von Burnheart Mockery auf einem Laptop: Bandfoto der vier Musiker zwischen Ästen, darunter der Button „Jetzt reinhören“",
        en: "Burnheart Mockery homepage on a laptop: photo of the four band members among branches, with a “Listen now” button",
      },
      width: 2000,
      height: 1318,
    },
    gallery: [
      {
        src: "/images/projects/burnheart-mockery/mobile-mockup.webp",
        alt: {
          de: "Mobile Ansicht der Band-Website mit Bandfoto und Button „Jetzt reinhören“",
          en: "Mobile view of the band website with a band photo and a “Listen now” button",
        },
        width: 927,
        height: 2000,
      },
    ],
  },
  featured: true,
  order: 4,
};
