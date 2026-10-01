# Task List: Portfolio UI Redesign

See `tasks/plan.md` for context, architecture decisions, risks, and open questions.

Common verification commands:
- Build: `npm run build`
- Parity: `node tasks/tools/text-snapshot.mjs dist > /tmp/after.txt && diff tasks/tools/baseline.txt /tmp/after.txt`
- Visual: `npm run dev`, then `http://localhost:4321/portfolio-template/<page>` at 375 / 768 / 1280 px, light and dark

---

## Phase 0: Baseline

## Task 0: Commit WIP and capture content-parity baseline

**Description:** Commit the existing uncommitted work (3 new project pages, edits to content/header/home/AGENTS.md) as its own commit so the redesign starts from a clean tree. Add a throwaway script that extracts the visible text of each built page (excluding header, footer, script, and style), normalized per page and sorted by route. Save its output as the baseline.

**Acceptance criteria:**
- [ ] `git status` is clean before any redesign edit; the WIP commit contains only the pre-existing changes
- [ ] `tasks/tools/text-snapshot.mjs` emits one block per route from `dist/**/index.html`, plus a list of internal hrefs that do not resolve to a built file
- [ ] `tasks/tools/baseline.txt` is committed; it covers all 19 built routes and shows zero unresolved internal links

**Verification:**
- [ ] Build succeeds: `npm run build`
- [ ] Running the script twice gives identical output

**Dependencies:** None
**Files likely touched:** `tasks/tools/text-snapshot.mjs`, `tasks/tools/baseline.txt`
**Estimated scope:** S

---

## Phase 1: Foundation

## Task 1: Design system tokens and global styles

**Description:** Rewrite `src/styles/global.css` as the design system: color tokens (surface, text, muted, border, accent, accent-contrast) for light and dark via `prefers-color-scheme`; a fluid type scale using `clamp()`; spacing, radius, shadow, and motion tokens; base element styles (headings, prose, links, lists, code, focus-visible ring); layout utilities (`.container`, `.section`, `.eyebrow`, `.btn`, `.btn--ghost`, `.tag`, `.card`). Self-host the display serif (woff2 subset) next to Atkinson. Make `@font-face` URLs base-path-safe instead of the hard-coded `/portfolio-template/fonts/...`.

**Acceptance criteria:**
- [ ] No raw hex/rgb values outside the token block in `global.css`
- [ ] Body text contrast ≥ 4.5:1 and large text ≥ 3:1 in both schemes (checked with the DevTools contrast picker)
- [ ] Fonts load under the `/portfolio-template` base in both `dev` and `preview`

**Verification:**
- [ ] Build succeeds
- [ ] Parity diff is empty (CSS-only change)
- [ ] Manual: existing pages still render and are readable (they will look transitional)

**Dependencies:** Task 0
**Files likely touched:** `src/styles/global.css`, `public/fonts/*`, `src/components/BaseHead.astro` (font preload)
**Estimated scope:** S

## Task 2: Unified layout shell, navigation, and project registry

**Description:** Create `src/data/projects.ts`, which derives the project list (slug, title, description, tags, href) from `content.pages.home.featuredProjects.projects`, moving the slug fallback in from `index.astro`. Create `src/layouts/BaseLayout.astro` (BaseHead, skip-to-content link, Header, `<main id="main">`, Footer, slot; props `title`, `description`, optional `image`). Rebuild `Header.astro` without `accessible-astro-components`: sticky translucent bar, site title, Home / Timeline / About links with `aria-current`, a Projects disclosure dropdown fed by the registry, social icons, and a mobile drawer with focus handling and Escape to close. Restyle `Footer.astro` with the same links. Migrate `src/pages/index.astro` to BaseLayout. Its section markup is unchanged in this task.

**Acceptance criteria:**
- [ ] The project list appears in exactly one place (`src/data/projects.ts`); Header desktop and mobile nav both render all 10 projects from it
- [ ] Keyboard only: Tab reaches every nav item; Enter/Space opens the dropdown; Escape closes the dropdown or drawer and returns focus to its trigger
- [ ] Mobile (< 900px): the drawer opens and closes, body scroll locks while open, and no horizontal overflow at 375px

**Verification:**
- [ ] Build succeeds
- [ ] Parity diff: only header/footer chrome differs; no unresolved links
- [ ] Manual: walk through the nav on desktop and mobile widths with screenshots

**Dependencies:** Task 1
**Files likely touched:** `src/data/projects.ts`, `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/pages/index.astro`
**Estimated scope:** M

### Checkpoint 1: Foundation
- [ ] Build clean; all 19 pages render with the new header and footer
- [ ] Parity diff limited to chrome
- [ ] **Human review of visual direction before Phase 2**

---

## Phase 2: Page Slices (Tasks 5–8 parallelizable; Task 4 follows Task 3)

## Task 3: Home hero and expertise

**Description:** Redesign the hero as a two-column layout on desktop and stacked on mobile: optimized avatar via `astro:assets` (`src/assets/avatar.jpg`), name as the display heading, tagline as the eyebrow/lead, bio, and the existing LinkedIn/GitHub CTAs. Restyle expertise as a responsive card grid, one card per category, with skills as chips.

**Acceptance criteria:**
- [ ] Hero fits within the first viewport at 1280x800 and 375x812; the avatar has width/height set (no CLS)
- [ ] Expertise grid is 1 column at 375, 2 at 768, and 3+ at 1280; every category and skill is present
- [ ] The scoped `<style>` in `index.astro` covers only home-specific layout; shared primitives come from `global.css`

**Verification:**
- [ ] Build succeeds; parity diff empty for `/`
- [ ] Manual: screenshots at the 3 widths, both schemes

**Dependencies:** Task 2
**Files likely touched:** `src/pages/index.astro`
**Estimated scope:** S

## Task 4: Home featured projects and contact CTA

**Description:** Render the featured projects from the registry as a project-card grid (title, description, tags, "Learn More →" link). The whole card is clickable through a stretched link, with hover and focus states. The first 3 entries (OmniSSH, Token Optimizer, Paseo Antigravity CLI) get a larger "spotlight" treatment, keeping content order. Restyle the contact CTA band ("Get in Touch" → `/about`).

**Acceptance criteria:**
- [ ] All 10 cards link to existing built routes (zero unresolved links in the snapshot script)
- [ ] Each card has exactly one focusable link; the focus ring is visible on the card
- [ ] Card order and text are identical to the baseline

**Verification:**
- [ ] Build succeeds; parity diff empty
- [ ] Manual: hover, focus, and click through all 10 cards

**Dependencies:** Task 2, Task 3
**Files likely touched:** `src/pages/index.astro`, optionally `src/components/ProjectCard.astro`
**Estimated scope:** S

## Task 5: Project detail template (all 10 project pages)

**Description:** Rebuild `ProjectLayout.astro` on BaseLayout. Hero: "Project Spotlight" eyebrow, title, lead, primary CTA (`ctaLabel`/`repoUrl`), and a sticky in-page section nav on wide screens. Content uses a readable prose column. Restyle `BubbleGrid`/`Bubble` (highlight cards), `MetricGrid`/`Metric` (stat tiles), and `StackGrid` (stack columns) with tokens. Drop the `theme`/`darkMode` props unless open question 3 says to keep per-project accents. Update the 10 page files only to remove those props. Keep the Editopia `.project-links` block styled.

**Acceptance criteria:**
- [ ] All 10 project pages render through the new template; per-page headings and stack labels are unchanged
- [ ] No component accepts props it no longer uses (`theme`/`darkMode` removed everywhere or kept consistently)
- [ ] External CTAs keep `target="_blank" rel="noopener"`

**Verification:**
- [ ] Build succeeds; parity diff empty for all `/projects/*` routes
- [ ] Manual: screenshots of OmniSSH (standard), Python Random Scripts (no stack grid), Editopia (extra links), and Team Management (custom CTA label) at 375 and 1280

**Dependencies:** Task 2
**Files likely touched:** `src/components/ProjectLayout.astro`, `BubbleGrid.astro`, `Bubble.astro`, `MetricGrid.astro`, `Metric.astro`, `StackGrid.astro`, plus a one-line prop removal in each of the 10 `src/pages/projects/*/index.astro`
**Estimated scope:** M (component work); the page-file edits are mechanical

## Task 6: Timeline page

**Description:** Migrate `timeline.astro` to BaseLayout and move its ~430 lines of `<head>` CSS into a scoped, token-based style. Render milestones as a vertical timeline: a single rail on mobile and alternating sides on desktop. Year badge, category chip, title, subtitle, description, and tags. Replace the inline emoji ternary chain with a category→icon map (inline SVG), with an unknown-category fallback.

**Acceptance criteria:**
- [ ] All 7 milestones are present in their original order, with year, category, title, subtitle, description, and tags unchanged
- [ ] The category→icon mapping lives in one object; an unknown category renders the fallback icon
- [ ] Rendered as a semantic list (`<ol>`), readable by a screen reader in order

**Verification:**
- [ ] Build succeeds; parity diff for `/timeline` shows only removed emoji glyphs (icon change), nothing else
- [ ] Manual: screenshots at 375 and 1280

**Dependencies:** Task 2
**Files likely touched:** `src/pages/timeline.astro`, optionally `src/components/TimelineItem.astro`
**Estimated scope:** S

## Task 7: About page

**Description:** Stop rendering About through `BlogPost.astro` (which needs a fake `pubDate`). Use BaseLayout with a dedicated layout: Who I Am (portrait, content, education, philosophy callout); Technical Journey (image, description, interests as a definition list split on `:`, approach); Literary Work (distinct literary styling, description, published-works grid as book cards, other publications, influences/genres/themes callout, Goodreads and blog links); Bringing It Together (text plus LinkedIn/GitHub links). Fix the duplicate star in book ratings by not prefixing `⭐` in markup.

**Acceptance criteria:**
- [ ] Every string from `content.pages.about` renders; the only allowed parity diff is the removed duplicate `⭐`
- [ ] Book cards are a 1/2/3-column grid at 375/768/1280; Greek titles render without clipping
- [ ] No fixed float layouts; images have alt text and explicit dimensions

**Verification:**
- [ ] Build succeeds; parity diff limited to the documented star fix
- [ ] Manual: screenshots at 375 and 1280, both schemes

**Dependencies:** Task 2
**Files likely touched:** `src/pages/about.astro`
**Estimated scope:** S

## Task 8: Blog index and post layout

**Description:** Migrate `blog/index.astro` and `layouts/BlogPost.astro` to BaseLayout with token-based styles: post-card grid (hero image, title, date), and an article layout with a readable measure, styled prose, and code blocks. Keep posts and nav exposure as they are (per open question 4).

**Acceptance criteria:**
- [ ] `/blog` and all 5 post routes render with the new shell; text is unchanged
- [ ] Prose max width about 70ch; code blocks scroll horizontally instead of overflowing at 375px
- [ ] `rss.xml` still builds

**Verification:**
- [ ] Build succeeds; parity diff empty for `/blog/*`
- [ ] Manual: `/blog` and `/blog/markdown-style-guide` at 375 and 1280

**Dependencies:** Task 2
**Files likely touched:** `src/pages/blog/index.astro`, `src/layouts/BlogPost.astro`
**Estimated scope:** S

### Checkpoint 2: Pages
- [ ] Build clean; full parity diff contains only the allowed exceptions (chrome, timeline emoji, about star)
- [ ] Every route checked at 375 / 768 / 1280 in light and dark
- [ ] **Human review**

---

## Phase 3: Polish and Cleanup

## Task 9: Motion, accessibility, and performance pass

**Description:** Add restrained motion: section fade/slide-in on scroll with IntersectionObserver, and card hover lift, all disabled under `prefers-reduced-motion`. Audit landmarks, heading order (one `h1` per page), focus visibility, color contrast, and alt text across all pages. Check image sizing and font preload.

**Acceptance criteria:**
- [ ] With reduced motion on, no animation runs and content stays visible without JS (progressive enhancement)
- [ ] Lighthouse mobile on `/`, `/projects/omnissh`, and `/about`: Accessibility ≥ 95, Performance ≥ 90, CLS < 0.1
- [ ] Exactly one `h1` per route, and no skipped heading levels in new markup

**Verification:**
- [ ] Build succeeds; parity diff unchanged from Checkpoint 2
- [ ] Manual: Lighthouse reports recorded in the PR description; keyboard walk-through of Home and one project page

**Dependencies:** Tasks 3–8
**Files likely touched:** `src/styles/global.css`, `src/layouts/BaseLayout.astro`, minor page tweaks
**Estimated scope:** S–M

## Task 10: Remove dead code and dependencies, update README

**Description:** Remove `accessible-astro-components` from `package.json` and the lockfile. Delete components with no importers (for example `HeaderLink.astro` if still unused, after confirming with LSP references). Delete `tasks/tools/` (throwaway parity tooling) after the final diff. Update `README.md` to describe the design system, BaseLayout, and the project registry.

**Acceptance criteria:**
- [ ] `npm ls accessible-astro-components` reports nothing; the build passes after a clean `npm ci`
- [ ] No unused `.astro` components remain in `src/components`
- [ ] README states where to add a new project (registry plus page file) and where the tokens live

**Verification:**
- [ ] `rm -rf node_modules dist && npm ci && npm run build` succeeds
- [ ] Final parity diff run before deleting the tooling, result noted in the PR

**Dependencies:** Task 9
**Files likely touched:** `package.json`, `package-lock.json`, `src/components/*`, `README.md`, `tasks/tools/*`
**Estimated scope:** S

### Checkpoint 3: Complete
- [ ] All acceptance criteria above met
- [ ] GitHub Pages deploy workflow builds on the branch
- [ ] Ready for merge
