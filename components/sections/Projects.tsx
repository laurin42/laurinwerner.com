import { getTranslations } from "next-intl/server";
import { ProjectEntry } from "@/components/project/ProjectEntry";
import { getFeaturedProjects } from "@/content";
import type { Locale } from "@/i18n/routing";
import { sectionId } from "@/lib/sections";
import { Section } from "./Section";

export async function Projects({ locale }: { locale: Locale }) {
  const t = await getTranslations();
  const projects = getFeaturedProjects(locale);

  return (
    <Section
      id={sectionId("projects", locale)}
      title={t("nav.projects")}
      centered
    >
      <ul className="flex flex-col gap-24 sm:gap-36">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <ProjectEntry
              project={project}
              stackLabel={t("home.techStack")}
              eager={index === 0}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
