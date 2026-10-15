import type { Project } from "../schema";

export const praxisWerner: Project = {
  slug: "praxis-werner",
  title: "Praxis Janis Werner",
  client: "Zahnarztpraxis Janis Werner, Goch",
  year: "TODO(laurin): Jahr",
  role: {
    de: "TODO(laurin): Rolle (z. B. Konzept, Design & Entwicklung)",
    en: "TODO(laurin): role (e.g. concept, design & development)",
  },
  summary: {
    de: "Website für die Zahnarztpraxis Janis Werner in Goch – mit klarem, vertrauenswürdigem Design und integrierter Online-Terminbuchung.",
    en: "Website for the dental practice Janis Werner in Goch – with a clean, trustworthy design and integrated online appointment booking.",
  },
  tagline: {
    de: "Zahnmedizin für die ganze Familie.",
    en: "Dental care for the whole family.",
  },
  stack: ["TODO(laurin): Stack"],
  problem: {
    de: "TODO(laurin): Ausgangslage – was war das Problem oder der Wunsch der Praxis?",
    en: "TODO(laurin): starting point – what was the practice's problem or goal?",
  },
  solution: {
    de: "TODO(laurin): Was wurde gebaut, und warum mit diesem Stack?",
    en: "TODO(laurin): what was built, and why with this stack?",
  },
  highlights: {
    de: [
      "Integrierte Online-Terminbuchung",
      "TODO(laurin): weitere Highlights",
    ],
    en: [
      "Integrated online appointment booking",
      "TODO(laurin): more highlights",
    ],
  },
  results: {
    de: [
      "TODO(laurin): Ergebnisse (Lighthouse, Ladezeit, Feedback der Praxis)",
    ],
    en: ["TODO(laurin): results (Lighthouse, load time, client feedback)"],
  },
  // TODO(laurin): Kundenzitat (mit Erlaubnis)? Öffentlicher Code?
  links: { live: "https://zahnarzt-jw.de" },
  images: {
    cover: {
      src: "/images/projects/praxis-werner/laptop-mockup.webp",
      alt: {
        de: "Startseite der Praxis-Website auf einem Laptop: Praxisname Janis Werner neben einem Foto des Empfangsbereichs mit Logo-Wand",
        en: "Homepage of the practice website on a laptop: the name Janis Werner next to a photo of the reception area with the logo wall",
      },
      width: 2000,
      height: 1300,
    },
    gallery: [
      {
        src: "/images/projects/praxis-werner/mobile-mockup.webp",
        alt: {
          de: "Mobile Ansicht der Praxis-Website mit den Leistungen Prophylaxe und Ästhetische Zahnmedizin",
          en: "Mobile view of the practice website listing the services prophylaxis and aesthetic dentistry",
        },
        width: 955,
        height: 2000,
      },
    ],
  },
  featured: true,
  order: 1,
};
