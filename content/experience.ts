import type { Experience } from "./schema";

/** Newest first. */
export const experience: Experience[] = [
  {
    title: { de: "Eigene Projekte", en: "Independent projects" },
    organization: { de: "Selbstständig", en: "Self-employed" },
    start: "2025-03",
    end: null,
    description: {
      de: "Spezialisierung auf Frontend-Entwicklung mit React, Next.js und TypeScript; Umsetzung von Kundenprojekten, die live im Einsatz sind.",
      en: "Specialising in frontend development with React, Next.js and TypeScript; building client projects that are live in production.",
    },
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Docker",
      "PostgreSQL",
      "Node.js",
    ],
  },
  {
    title: {
      de: "Weiterbildung Full-Stack-Webentwicklung",
      en: "Full-stack web development course",
    },
    organization: {
      de: "TODO(laurin): Name des Bildungsanbieters",
      en: "TODO(laurin): name of the course provider",
    },
    start: "2024-07",
    end: "2025-03",
    description: {
      de: "Achtmonatige Weiterbildung mit Schwerpunkt auf Backend-Entwicklung mit Python und Django sowie Datenbankmodellierung.",
      en: "Eight-month course focused on backend development with Python and Django and on database modelling.",
    },
    tags: [
      "Python",
      "Django",
      "SQL",
      "REST APIs",
      "JavaScript",
      "HTML",
      "Tailwind CSS",
      "Sass",
    ],
  },
  {
    title: {
      de: "Praktikum Softwareentwicklung",
      en: "Software development internship",
    },
    organization: { de: "StartUp Werk", en: "StartUp Werk" },
    location: { de: "Oberhausen", en: "Oberhausen" },
    start: "2024-05",
    end: "2024-05",
    description: {
      de: "Mitarbeit an kleineren internen Projekten mit Fokus auf Codestruktur, Programmiergrundlagen und Versionskontrolle mit Git.",
      en: "Contributed to smaller internal projects, focusing on code structure, programming fundamentals and version control with Git.",
    },
    tags: ["HTML", "CSS", "JavaScript", "Git"],
  },
];
