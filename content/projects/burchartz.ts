import type { Project } from "../schema";

export const burchartz: Project = {
  slug: "burchartz",
  title: "BurchARTz",
  client: "Lennart Burchartz, Toningenieur",
  year: "TODO(laurin): Jahr",
  role: {
    de: "TODO(laurin): Rolle (z. B. Konzept, Design & Entwicklung)",
    en: "TODO(laurin): role (e.g. concept, design & development)",
  },
  summary: {
    de: "Portfolio- und Buchungsplattform für Toningenieur Lennart Burchartz: Künstler und Produzenten entdecken seine Leistungen und Referenzen und buchen direkt.",
    en: "Portfolio and booking platform for audio engineer Lennart Burchartz: artists and producers discover his services and references and book directly.",
  },
  tagline: {
    de: "Vom Rohschnitt bis zum Release.",
    en: "From rough mix to release.",
  },
  stack: ["Payload CMS", "TODO(laurin): weiterer Stack"],
  problem: {
    de: "TODO(laurin): Ausgangslage – was war das Problem oder der Wunsch des Kunden?",
    en: "TODO(laurin): starting point – what was the client's problem or goal?",
  },
  solution: {
    de: "TODO(laurin): Was wurde gebaut, und warum mit diesem Stack?",
    en: "TODO(laurin): what was built, and why with this stack?",
  },
  highlights: {
    de: [
      "Zweisprachig (Deutsch und Englisch)",
      "Payload CMS, damit der Kunde Inhalte selbst pflegt",
      "Direkte Buchung über die Website",
    ],
    en: [
      "Bilingual (German and English)",
      "Payload CMS so the client manages content himself",
      "Direct booking through the website",
    ],
  },
  results: {
    de: [
      "TODO(laurin): Ergebnisse (Lighthouse, Ladezeit, Feedback des Kunden)",
    ],
    en: ["TODO(laurin): results (Lighthouse, load time, client feedback)"],
  },
  // TODO(laurin): Kundenzitat (mit Erlaubnis)? Öffentlicher Code?
  links: { live: "https://lennartburchartz.de" },
  images: {
    cover: {
      src: "/images/projects/burchartz/laptop-mockup.webp",
      alt: {
        de: "Startseite von BurchARTz auf einem Laptop: Lennart Burchartz am Mischpult, daneben der Schriftzug „Mixing & Mastering“",
        en: "BurchARTz homepage on a laptop: Lennart Burchartz at the mixing desk next to the words “Mixing & Mastering”",
      },
      width: 1280,
      height: 843,
    },
    gallery: [
      {
        src: "/images/projects/burchartz/mobile-mockup.webp",
        alt: {
          de: "Mobile Ansicht der Referenzen mit Audio-Player und Kundenstimme",
          en: "Mobile view of the references with an audio player and a client quote",
        },
        width: 955,
        height: 2000,
      },
    ],
  },
  featured: true,
  order: 2,
};
