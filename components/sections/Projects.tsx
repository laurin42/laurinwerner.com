import { getTranslations } from "next-intl/server";
import { ProjectCard } from "@/components/project/ProjectCard";
import { getFeaturedProjects } from "@/content";
import type { Locale } from "@/i18n/routing";
import { sectionId } from "@/lib/sections";
import { Section } from "./Section";

export async function Projects({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const projects = getFeaturedProjects(locale);

  return (
    <Section id={sectionId("projects", locale)} title={t("nav.projects")}>
      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.slug} className="flex">
            {/* The first row of cards is usually in view on load. */}
            <ProjectCard
              project={project}
              stackLabel={t("home.techStack")}
              eager={index < 2}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
