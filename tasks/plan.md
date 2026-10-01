# Implementation Plan: Portfolio UI Redesign

## Overview

Full visual redesign of the Astro portfolio (`lefos13.github.io/portfolio-template`). All copy stays exactly as it is today: `src/content.json` and every hard-coded label in the `.astro` pages (section headings, link text, stack-group labels). What changes is the presentation layer: design tokens, the layout shell, navigation, and every page template. The goal is one consistent portfolio identity for a full-stack engineer who is also a published fantasy author, replacing the current mix of per-page styles (Bear Blog base CSS, three ad-hoc project themes, emoji icons, ~3,500 lines of duplicated scoped CSS).

No SPEC.md exists. This plan treats the user request ("keep the content, major UI enhancement, proper portfolio page") as the spec. The current source tree is the content baseline.

## Current State (evidence)

| Area | Today | Problem |
|------|-------|---------|
| Content source | `src/content.json` (697 lines): `pages.home/about/timeline/projects/blog` | Fine. Do not change it. |
| Global CSS | `src/styles/global.css`, Bear Blog defaults, `--accent #2337ff`, hard-coded `/portfolio-template/fonts/...` | No design system; base path hard-coded |
| Page shells | `index.astro`, `timeline.astro`, `blog/index.astro`, `BlogPost.astro`, `ProjectLayout.astro` each repeat `<html><BaseHead/><Header/>…<Footer/>` | 5 copies of the shell |
| Header | `Header.astro` (533 lines), project list hard-coded twice (desktop dropdown and mobile accordion), uses `accessible-astro-components` (its only consumer) | Drift risk: adding a project means editing 3 places |
| Home | hero / expertise / featured projects / CTA; card link uses `slug ?? title→kebab` | 7 of 10 featured entries have `slug: null` and depend on that fallback |
| Project pages | 10 near-identical files under `src/pages/projects/*/index.astro`; headings and stack labels differ per page; `theme` prop is `blue`, `purple`, or `teal` | Content lives in page markup, so these files must stay |
| About | Rendered through `layouts/BlogPost.astro` with a fake `pubDate`; ~170 lines of inline `<style>` | Wrong layout for the page |
| Timeline | 7 milestones; category→emoji chain inline; ~430 lines of CSS in `<head>` | Hard to maintain |
| Blog | Astro starter lorem posts, not linked from the nav | Restyle only; no content changes |
| Known UI bug | `about.astro:253` renders `⭐ {book.rating}`, but `rating` already starts with `⭐` | Double star |
| Uncommitted WIP | `AGENTS.md`, `Header.astro`, `content.json`, `index.astro` modified; `projects/omnissh`, `token-optimizer`, `paseo-plugin-antigravity-cli` untracked | Must be committed before redesign starts (Task 0) |
| Build | `npm run build` passes: 19 pages in about 0.8s | No test suite and no `astro check` |

## Architecture Decisions

1. **Content is frozen; a text-parity guard enforces it.** Task 0 extracts the visible text of every built page into a baseline. Each later task diffs against it. Allowed diffs: nav and footer chrome, and the fix for the duplicate star. Everything else must match.
2. **One layout shell.** New `src/layouts/BaseLayout.astro` (head, skip link, header, `<main>`, footer, slot). All pages and the `ProjectLayout`/`BlogPost` layouts wrap it.
3. **Project registry derived from content.** New `src/data/projects.ts` builds `{slug, title, description, tags, href}` from `content.pages.home.featuredProjects.projects`, with the existing slug fallback moved in from `index.astro`. The header nav, mobile nav, and home grid all read from it, so the 3 hand-maintained copies go away. No JSON edits.
4. **Keep the 10 project page files.** Their headings and stack labels are content and differ per page (for example "Architecture Glimpse" vs "Technical Architecture"). Converting them to a dynamic `[slug].astro` would move content into a label map, which this redesign does not need. Only the shared components get rebuilt (`ProjectLayout`, `BubbleGrid`/`Bubble`, `MetricGrid`/`Metric`, `StackGrid`). The page files change only where the component API changes (the `theme` prop).
5. **Design tokens in plain CSS custom properties.** No new CSS framework. `global.css` is rewritten: color, type scale, spacing, radius, shadow, and motion tokens, a light/dark palette via `prefers-color-scheme`, and base-path-safe `@font-face`.
6. **Remove `accessible-astro-components`.** The header becomes a native `<nav>` with a `<details>`/disclosure dropdown and a small inline script for the mobile drawer. That means one fewer dependency, and keyboard/ARIA behavior is owned in-repo.
7. **Visual direction (default unless overridden):** "Engineer x Author". Dark-first editorial look, one accent hue, a serif display face for headings (literary side) with Atkinson for body text (already self-hosted, accessible). Project themes collapse to a single accent so there is one identity, not three. The literary sections get a distinct but compatible treatment.
8. **Images through `astro:assets`** where sources exist in `src/assets/` (`avatar.jpg`), for responsive `srcset` and lazy loading. Public-path images stay as they are otherwise.

## Dependency Graph

```
Task 0  Baseline (commit WIP + text-parity snapshot)
   │
Task 1  Design tokens + global.css
   │
Task 2  BaseLayout + Header + Footer + projects registry
   │
   ├── Task 3  Home: hero + expertise
   │      └── Task 4  Home: featured projects + contact CTA   (uses registry)
   ├── Task 5  Project detail template (ProjectLayout + Bubble/Metric/Stack) → 10 pages
   ├── Task 6  Timeline
   ├── Task 7  About (own layout)
   └── Task 8  Blog index + BlogPost
           │
Task 9  Motion, accessibility, responsive and performance pass (all pages)
   │
Task 10 Cleanup: dead components/deps, README
```

Tasks 3–8 depend only on Tasks 1 and 2 and touch disjoint files, so they can run in parallel after Checkpoint 1. Task 4 also needs Task 3 because both edit `index.astro`.

## Task List

### Phase 0: Baseline
- [x] Task 0: Commit WIP and capture content-parity baseline

### Phase 1: Foundation
- [x] Task 1: Design system tokens and global styles
- [x] Task 2: Unified layout shell, navigation, and project registry

### Checkpoint 1: Foundation
- [x] `npm run build` clean; all 19 pages render with the new header and footer
- [x] Parity diff shows only nav/footer chrome changes
- [ ] Human review of visual direction on Home and one project page before the remaining pages proceed

### Phase 2: Page Slices
- [x] Task 3: Home hero and expertise
- [x] Task 4: Home featured projects and contact CTA
- [x] Task 5: Project detail template (all 10 project pages)
- [x] Task 6: Timeline page
- [x] Task 7: About page
- [x] Task 8: Blog index and post layout

### Checkpoint 2: Pages
- [x] Build clean; parity diff empty apart from allowed exceptions
- [x] Every page checked at 375 / 768 / 1280 px, light and dark
- [ ] Human review

### Phase 3: Polish and Cleanup
- [x] Task 9: Motion, accessibility, and performance pass
- [x] Task 10: Remove dead code and dependencies, update README

### Checkpoint 3: Complete
- [x] All acceptance criteria in `tasks/todo.md` met
- [ ] Lighthouse (mobile) on Home, one project page, and About: Accessibility ≥ 95, Performance ≥ 90, no CLS regressions
- [ ] Ready for merge and deploy (GitHub Pages workflow unchanged)

Detailed tasks, acceptance criteria, and verification steps: `tasks/todo.md`.

## Verification Toolkit (no test suite exists)

- **Build:** `npm run build`
- **Content parity:** `node tasks/tools/text-snapshot.mjs dist > /tmp/after.txt && diff tasks/tools/baseline.txt /tmp/after.txt`. The script strips `<header>`, `<footer>`, `<script>`, and `<style>`, then normalizes whitespace per page. It is created in Task 0 and deleted in Task 10.
- **Visual:** `npm run dev`, then browser at `http://localhost:4321/portfolio-template/` at 375, 768, and 1280 widths with screenshots, with both `prefers-color-scheme` values emulated.
- **Links:** every href produced by the registry and the CTAs resolves to a built page in `dist/` (checked by the snapshot script).

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Copy silently altered or dropped during markup rewrites | High | Text-parity diff required in every task's verification |
| Uncommitted WIP (3 new project pages, content edits) lost or mixed into redesign commits | High | Task 0 commits it first as its own commit |
| `base: '/portfolio-template'` breaks asset/font/link paths | Med | All URLs via `import.meta.env.BASE_URL` / `BASE_URI`; build plus preview check under the base path |
| Removing `accessible-astro-components` regresses keyboard/mobile nav | Med | Native disclosure pattern; keyboard walk-through in Task 2 and Task 9 |
| Serif display font adds weight and CLS | Low | Self-host one woff2 subset, `font-display: swap`, size-adjust fallback |
| Per-page `theme` prop removal touches 10 files | Low | Mechanical change, done inside Task 5 with parity diff |

## Open Questions (defaults applied if unanswered)

1. **Visual direction:** dark-first editorial with serif headings (default), or a light minimal look, or a bold/colorful one?
2. **Theme toggle:** follow the system color scheme only (default), or add a manual light/dark toggle?
3. **Project themes:** collapse blue/purple/teal into a single accent (default), or keep a per-project accent color?
4. **Blog:** restyle it but keep it out of the nav (default, matches today), or add it to the nav, or remove it? The posts are Astro starter lorem.
5. **Projects index page (`/projects`):** add a grid page built from existing content (no new copy), or keep projects reachable only through the home grid and nav dropdown (default)?
6. **SITE_TITLE "Portfolio" / SITE_DESCRIPTION "Welcome to my website!"** are in `consts.ts`, not `content.json`. They count as content, so they stay unchanged unless you say otherwise.
