# Design System — hello-word-7

> Source of truth: the approved `index.html` (preview: http://localhost:8080/design/6f5969f4-dcb7-4037-b58b-f1d717880172).
> Every value below is extracted from it. Changing a value here without changing the approved design is a defect.

Last updated: 2025-02-14

## 1. Foundations

### 1.1 Color

Semantic tokens. Name by job, never by hue.

| Token | Value | Used for |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-text` | `#000000` | Body text |

#### Contrast audit

Every text-on-background pair actually used. Body text ≥ 4.5:1, large text (≥ 18.66px bold or ≥ 24px) ≥ 3:1, UI borders ≥ 3:1.

| Foreground | Background | Ratio | Passes |
|---|---|---|---|
| `--color-text` | `--color-bg` | `21:1` | AA / AA Large |

### 1.2 Spacing

Base unit: `24px`. Product uses one value only: page padding.

| Token | Value |
|---|---|
| `--space-6` | `24px` |

### 1.3 Typography

Font families (include the fallback stack and how the font is loaded):

- Body: `Arial, Helvetica, sans-serif` from system fonts
- Headings: `Arial, Helvetica, sans-serif` from system fonts
- Mono: not used

| Token | Size | Line height | Weight | Used for |
|---|---|---|---|---|
| `--text-base` | `16px` | normal | `400` | Single page text |

Heading levels are not used.

### 1.4 Radius, border, shadow, motion

| Token | Value | Used for |
|---|---|---|
| `--radius-sm` | `0` | Not used |
| `--radius-md` | `0` | Not used |
| `--radius-lg` | `0` | Not used |
| `--radius-full` | `0` | Not used |
| `--border-width` | `0` | No borders |
| `--shadow-sm` | `none` | No elevation |
| `--shadow-md` | `none` | No elevation |
| `--shadow-lg` | `none` | No elevation |
| `--duration-fast` | `0ms` | No motion |
| `--duration-base` | `0ms` | No motion |
| `--easing` | `linear` | No motion |

Motion respects `prefers-reduced-motion: reduce`: no animated behavior exists to change.

### 1.5 Layout and breakpoints

| Name | Min width | Container | Columns | Gutter |
|---|---|---|---|---|
| `sm` | not used | fluid | 1 | 24px |
| `md` | not used | fluid | 1 | 24px |
| `lg` | not used | fluid | 1 | 24px |
| `xl` | not used | fluid | 1 | 24px |

Z-index scale (only these values are allowed):

| Layer | Value |
|---|---|
| Base | `0` |

## 2. Components

One subsection per reusable component. Every component lists **all** states.

### 2.1 Static message

**Purpose** — Show one centered line of page text; use only for this proof-of-pipeline screen. Not for interactive content.

**Anatomy** — `[text]`

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Default | `--color-text`, `--color-bg`, `--text-base` | Single content line |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Default | auto | none | `--text-base` |

**States** — every row must be filled in.

| State | Visual change | Tokens |
|---|---|---|
| Default | Black text on white background, centered in viewport | `--color-text`, `--color-bg`, `--space-6` |
| Hover | No change | none |
| Focus (keyboard) | No change; component is not focusable | none |
| Active / pressed | No change | none |
| Disabled | No change; component is not interactive | none |
| Loading | No loading state exists | none |
| Error | No error state exists | none |
| Empty | No alternate empty state exists | none |

**Accessibility** — No role or ARIA needed; plain text. Minimum hit target not applicable.

## 3. Content and formatting

- Voice and tone: plain, literal, no decoration.
- Date, time, number, and currency formats: not used.
- Capitalization rule for buttons, headings, and labels: not used.
- Empty-state and error-message wording pattern: not used.

## 4. Known deviations

Places where the approved design does not follow its own rules or the
anti-patterns in `references/ai-defaults.md`. Record, do not silently fix.

| Where | Deviation | Why it stands | Follow-up |
|---|---|---|---|
| Foundations / Typography | Only one text size appears; heading ramp unused | One-screen proof app needs one line only | Add typographic scale only if more screens arrive |
| Foundations / Radius, border, shadow, motion | No radii, borders, shadows, or motion tokens appear | Plain text screen needs none | Add tokens only when interactive or card UI appears |
| Foundations / Layout and breakpoints | Breakpoints are not defined in approved HTML | Screen is one centered line, so no responsive layout rules were needed | Define breakpoints if content grows |
| Components | Only static text component exists; no interactive states in design | No controls in product | Add component states only when controls exist |

## 5. Change log

| Date | Change | Design PR |
|---|---|---|
| 2025-02-14 | Initial design system extracted from approved one-screen mockup | pending |
