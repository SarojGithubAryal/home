# Frontend Design System — Philosophy

Status: Active
Scope: `frontend/src/styles/`

This document explains the *reasoning* behind the styling foundation
(`tokens.css`, `global.css`, `layout.css`, `animations.css`,
`utilities.css`). It complements — and does not replace —
`12_FRONTEND_UI_GUIDELINES.md` and `13_DESIGN_SYSTEM.md`, which remain
the binding architectural source of truth. This file exists so future
contributors (human or AI) understand *why* the token layer is
structured the way it is, not just *what* values exist.

---

## 1. Core Principle

No component ever invents its own visual value. Every color, spacing,
radius, shadow, opacity, typography, or motion value a component uses
must come from a shared token. If a value isn't in the token layer, the
right fix is to add a token — not to hardcode a one-off value locally.

## 2. Two-Layer Token Architecture (Color)

Color tokens are deliberately split into two layers:

Layer A — Primitives   (--palette-)     raw values, no meaning
↓
Layer B — Semantic      (--color-)      role-based, meaning-bearing
↓
Components       consume Layer B only

**Primitives** (`--palette-neutral-900`, `--palette-brand-500`, etc.)
are raw values with no inherent meaning — they say nothing about *where*
or *why* they're used.

**Semantic tokens** (`--color-text-primary`, `--color-surface`,
`--color-error`, etc.) are role-based names that describe *purpose*.
Every semantic token is defined as a reference to a primitive
(`--color-text-primary: var(--palette-neutral-900);`), never as a raw
value directly.

**Components consume only semantic tokens — never primitives.** This is
the rule that makes theming possible: a future backend-driven Theme
System (per `08_ASSET_ARCHITECTURE.md` / `13_DESIGN_SYSTEM.md` Section
19) can re-point which primitive a semantic role resolves to — e.g.
making `--color-primary` reference a different palette swatch for a
"warm" theme vs. a "night" theme — without editing a single component
file. The component only ever asked for "the primary color"; it never
knew or cared which raw value that meant.

### Why only color gets this split

Spacing, typography sizing, radius, shadow elevation, opacity, and
z-index are exposed as a single-layer **scale** (`--space-md`,
`--radius-lg`, `--shadow-medium`, etc.) rather than a primitive/semantic
pair. This is intentional, not an oversight: these scales are already
role-agnostic by construction (a t-shirt-sized spacing scale, for
example, doesn't need a "semantic spacing role" layered on top — `md`
spacing *is* the semantic unit components reason about). Color is
different because color is the dimension most likely to be swapped
wholesale under a future theme, while the spacing/type/radius/shadow
*scale itself* is expected to remain stable across themes. If a future
phase introduces theme-dependent spacing or typography, the same
primitive/semantic pattern established here for color should be applied
there too, rather than inventing a different pattern.

## 3. Where Each File Fits

| File | Responsibility |
|---|---|
| `tokens.css` | Every design value in the application. Primitives + semantic tokens for color; single-layer scales for spacing/type/radius/shadow/opacity/z-index/container widths. Nothing else. |
| `global.css` | Applies tokens to raw HTML elements (resets, base typography, links, forms, media, selection, scrollbars, focus). |
| `layout.css` | Composable structural classes (containers, flex/grid helpers, stack/cluster) built from tokens. |
| `animations.css` | Keyframes and animation-trigger classes built from the motion tokens in `tokens.css`. |
| `utilities.css` | Small, single-purpose content-level helpers (truncation, aspect-ratio boxes, opacity states) built from tokens. |
| Component `*.css` files | Component-specific appearance, consuming tokens exclusively — never redefining a value locally. |

## 4. Rules for Contributors

1. **Never hardcode a color, spacing, radius, shadow, opacity, or
   typography value in a component CSS file.** If the token you need
   doesn't exist, add it to `tokens.css` first.
2. **Never reference a `--palette-*` primitive from a component.**
   Components consume `--color-*` semantic tokens only. If a component
   seems to need a color that has no semantic token yet, that's a signal
   a new semantic role is missing — add the semantic token (pointing to
   an existing or new primitive), not a direct primitive reference.
3. **Don't invent a new naming convention.** Follow the existing
   pattern (`--space-*`, `--radius-*`, `--shadow-*`, `--color-*`,
   `--font-*`, `--opacity-*`, `--z-index-*`, `--container-width-*`).
4. **Utility classes (`layout.css`, `animations.css`, `utilities.css`)
   are for genuinely reusable, page-agnostic patterns only.** Anything
   specific to one component's appearance belongs in that component's
   own CSS file, per `12_FRONTEND_UI_GUIDELINES.md` Section 5.

## 5. Relationship to Reference Images

Per `12_FRONTEND_UI_GUIDELINES.md` Section 2, reference images remain
the visual source of truth for actual page implementation. This token
layer intentionally does **not** attempt to match any reference image's
specific atmosphere yet — it defines the *scales and roles* that later
page-implementation phases will assign real, image-matched values to
(primarily by adjusting primitive palette values and possibly
introducing additional semantic tokens as real pages surface real
needs), without restructuring the token architecture itself.