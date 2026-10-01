// Single source for project listings (header nav, mobile nav, home grid).
// Order and copy come from content.json; only routing and short nav labels live here.
import content from "../content.json";
import { BASE_URI } from "../consts";

export interface ProjectSummary {
  slug: string;
  title: string;
  navLabel: string;
  description: string;
  tags: string[];
  href: string;
}

// Short labels used in the navigation menus (kept from the previous header).
const NAV_LABELS: Record<string, string> = {
  "paseo-plugin-antigravity-cli": "Paseo Antigravity CLI",
  "nestjs-backend-template": "NestJS Template",
  "ert-game-web": "Web Game",
  "python-random-scripts": "Python Scripts",
};

export const projects: ProjectSummary[] = content.pages.home.featuredProjects.projects.map(
  (project) => {
    const slug = project.slug ?? project.title.toLowerCase().replace(/\s+/g, "-");
    return {
      slug,
      title: project.title,
      navLabel: NAV_LABELS[slug] ?? project.title,
      description: project.description,
      tags: project.tags,
      href: `${BASE_URI}/projects/${slug}`,
    };
  },
);
