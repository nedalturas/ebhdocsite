# Codebase Refactoring Summary

This document details the refactoring performed across the codebase to improve maintainability, cross-platform stability, performance, code cleanliness, and adherence to the unified design system.

---

## 1. Dead Code & Redundant File Elimination

- **Removed `src/_includes/home-layout.njk`**:
  - **Reason**: Redundant wrapper that was not referenced anywhere in the repository (`index.njk` directly inherits from `base.njk`).
- **Removed `src/_includes/layout.njk`**:
  - **Reason**: Legacy prototype layout with outdated markup, broken collection loops, and obsolete Pico CSS styles.
- **Removed `src/css/style.css`**:
  - **Reason**: Unused legacy CSS file that was only linked to the obsolete `layout.njk`.
- **Cleaned `src/_includes/base.njk`**:
  - Removed commented-out Pico CSS link tags (`<link rel="stylesheet" href="/css/pico.min.css" />`).
  - Added fallback title logic: `{{ title or site.name or "Documentation" }}`.

---

## 2. Configuration & Build Improvements (`.eleventy.js`)

- **Cross-Platform Path Resolution**:
  - Replaced naive string `.split('/')` with Node's `path.normalize(doc.inputPath).split(path.sep)`.
  - Fixes category detection issues on Windows where paths contain backslashes (`\`).
- **Deterministic Documentation Sorting**:
  - Updated category document sorting to sort alphabetically by document title (or slug) in ascending order (`a.localeCompare(b)`).
- **Default Parameters for Shortcodes**:
  - Added safe default parameters for `{% infoCard %}` (`type = "info"`, `title = "Information"`).
  - Changed `<p class="info-card__content">` to `<div class="info-card__content">` so markdown content blocks containing paragraphs or lists do not generate invalid nested HTML.

---

## 3. Client-Side Script Refactoring

### Theme Switcher (`src/js/themeSwitch.js`)
- **IIFE Scope Protection**:
  - Wrapped theme logic in an Immediately Invoked Function Expression (`(() => { ... })()`) to avoid leaking variables (`toggle`, `html`, `currentTheme`) into the global window scope.
- **Null Safety**:
  - Added guard clauses checking if `#theme-toggle` exists on the current page before attaching listeners.
- **OS Theme Matching**:
  - Added `window.matchMedia('(prefers-color-scheme: dark)')` fallback so first-time visitors automatically match their system's light/dark mode preference when no `localStorage` value is present.

### Documentation Navigation & Search (`src/js/sidebar.js`)
- **Single Source of Truth**:
  - Consolidated documentation search into a single instant-search engine linked with `/docs-search.json`.
  - Added fallback DOM crawling if the JSON index cannot be retrieved.
- **XSS Protection**:
  - Ensured HTML escaping for query matches and categories in autocomplete dropdown results.
- **Keyboard Navigation & Accessibility**:
  - Added `aria-current="page"` to active links and `Escape` key listeners to dismiss dropdowns and drawers.
  - Automatically syncs parent `<details open>` elements for active documents.

---

## 4. Design System & CSS Structure

- **Navbar Sticky Fix**:
  - Reinforced sticky positioning in `globals.css` with `position: sticky; top: 0; z-index: 1020;` to ensure consistent behavior across both home and documentation layouts.
- **Unified Tokens**:
  - Home and Documentation share identical color palette tokens (`--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--blue`, `--accent`, `--focus`) and font families (`Bricolage Grotesque` and `Figtree`).
- **Zero Build Warnings / Errors**:
  - Eleventy build completes in ~0.24s with zero compilation warnings or broken references.

---

*Refactored on 2026-10-26.*
