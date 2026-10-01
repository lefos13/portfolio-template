# Lefteris Evangelinos - Portfolio

Personal portfolio built with [Astro](https://astro.build). It covers software projects, a career timeline, and literary work. The site deploys to GitHub Pages at `https://lefos13.github.io/portfolio-template` (the `base` path is set in `astro.config.mjs`).

## Commands

| Command           | Action                                             |
| :---------------- | :------------------------------------------------- |
| `npm install`     | Install dependencies                               |
| `npm run dev`     | Dev server at `localhost:4321/portfolio-template`  |
| `npm run build`   | Production build to `./dist/`                      |
| `npm run preview` | Preview the production build                       |

## Project Structure

```text
src/
  content.json            All page copy (home, about, timeline, projects)
  data/projects.ts        Project registry: order, slugs, nav labels, hrefs
  data/social.ts          LinkedIn / GitHub / Instagram links and icons
  styles/global.css       Design tokens and shared primitives
  layouts/BaseLayout.astro  Page shell: head, header, main, footer, scroll reveal
  layouts/BlogPost.astro  Blog article layout
  components/             Header, Footer, ProjectLayout, highlight/metric/stack grids
  pages/                  Routes (home, about, timeline, blog, projects/*)
```

## Design System

`src/styles/global.css` defines every color, type size, spacing step, radius, shadow, and motion value as CSS custom properties. The default palette is dark, and a light palette applies under `prefers-color-scheme: light`. Components use the tokens only, never raw colors.

Shared classes: `.container`, `.section`, `.section-header`, `.eyebrow`, `.lead`, `.btn--primary`, `.btn--ghost`, `.card`, `.card--interactive`, `.callout`, `.tag`, `.tag-list`, `.prose`.

Fonts are Inter (body) and Literata (headings). Both are self-hosted through `@fontsource-variable` and include the Greek subsets.

## Adding a Project

1. Add the project copy under `pages.projects.<slug>` in `src/content.json`, and add a card entry (title, slug, description, tags) to `pages.home.featuredProjects.projects`.
2. Create `src/pages/projects/<slug>/index.astro` using `ProjectLayout` (copy an existing project page).
3. Optionally add a short menu label in `NAV_LABELS` in `src/data/projects.ts`.

The header menu, the mobile menu, and the home grid all read from `src/data/projects.ts`, so there is no other list to update.
