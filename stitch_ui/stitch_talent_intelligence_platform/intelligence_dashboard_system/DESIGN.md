---
name: Intelligence Dashboard System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-margin: 32px
  gutter: 24px
---

## Brand & Style
The design system is engineered for a high-performance AI recruitment environment, prioritizing clarity, speed, and cognitive ease. The brand personality is **Professional, Transparent, and Authoritative**, aimed at enterprise talent acquisition teams who require precision over flair.

The visual style is a fusion of **Corporate Modern** and **Minimalism**. It leverages high-quality typography and generous whitespace to manage complex data density. Drawing inspiration from industry leaders like Vercel and Stripe, it utilizes a "Subtle Layering" approach where depth is communicated through micro-borders and soft tonal shifts rather than heavy shadows. The AI-centric nature is represented through refined motion and specific semantic gradients that denote intelligence and confidence levels without feeling "gimmicky."

## Colors
This design system utilizes a restrained palette to ensure that data visualizations remain the focal point.
- **Primary:** Corporate Blue (#2563EB) is used for primary actions and key brand touchpoints.
- **Surface Strategy:** The background is pure #FFFFFF to maintain a "paper" feel, while #F8F9FA is used for sidebar regions, input backgrounds, and secondary card layers.
- **AI Semantics:** Match scores and AI insights use a specific Indigo-to-Blue gradient. This distinguishes "machine-generated" intelligence from standard system statuses. Confidence levels are represented by varying the opacity of the primary blue rather than changing hue, maintaining a professional consistency.

## Typography
The typography system relies exclusively on **Inter** to achieve a neutral, systematic feel. 
- **Scale:** A tight scale is used for the dashboard to allow for high information density without sacrificing legibility. 
- **Headlines:** Use tighter letter spacing (-0.01em to -0.02em) for H1-H3 to create a more compact, modern "Stripe-like" aesthetic.
- **Labels:** Small labels use a medium or semi-bold weight with increased letter spacing for maximum readability at 11px and 12px.
- **Body:** Standard body text is set to 14px for enterprise density, while 16px is reserved for prose-heavy candidate descriptions.

## Layout & Spacing
The layout follows a strict **8px grid system** (with 4px increments for micro-adjustments). 
- **Grid:** A 12-column fluid grid is used for the main content area.
- **Sidebar:** Fixed at 260px to maintain consistent navigation regardless of screen width.
- **Margins:** Desktop views should maintain a 32px safe area from the screen edge.
- **Density:** Use "Generous" spacing for landing areas (24px+ gaps) and "Compact" spacing (8px-12px gaps) for data-heavy candidate lists and tables.

## Elevation & Depth
Depth is achieved through a **Low-contrast Outline** approach. 
- **Borders:** All cards and containers use a 1px solid border (#E2E8F0).
- **Shadows:** Only used to indicate interactivity or floating states (menus/modals). The standard shadow is a multi-layered, low-opacity blur: `0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)`.
- **Z-Index Tiers:** 
  - Level 0: Background (#FFFFFF)
  - Level 1: Surface (#F8F9FA) - Sidebar and subtle sections.
  - Level 2: Raised (Cards with 1px border)
  - Level 3: Overlay (Modals and Tooltips with subtle shadow)

## Shapes
The shape language is **Rounded**, reflecting a modern and approachable enterprise feel. 
- **Cards/Containers:** 12px (rounded-lg) creates a soft but professional frame for data.
- **Buttons/Inputs:** 8px (standard) for a balanced appearance.
- **Inner Elements:** Chips and badges use a 6px or full-pill radius to distinguish them from structural containers.

## Components
- **Buttons:**
  - *Primary:* Blue background, white text, subtle top-inner-white border for "Stripe" tactile feel.
  - *Secondary:* White background, #E2E8F0 border, #0F172A text.
  - *Ghost:* No border/background, subtle gray hover state.
- **Input Fields:** 1px border (#E2E8F0), 8px radius. On focus, use a 3px primary-blue outer ring at 10% opacity.
- **Cards:** White background, 1px #E2E8F0 border, 12px radius. Use a light gray header strip (#F8F9FA) for "Evidence Panels."
- **AI Score Visualization:** Circular progress or bar indicators using the Match Score Gradient. Always accompany with an "Info" icon that reveals the logic/evidence on hover.
- **Navigation:**
  - *Sidebar:* Subtle gray background (#F8F9FA), active states indicated by a primary blue vertical bar (2px width) on the left edge.
  - *Top Bar:* Blur effect (Glassmorphism) with 80% opacity background and 20px backdrop-blur.
- **Evidence Panels:** Specialized side-drawers for AI reasoning. Use a monospaced font (e.g., JetBrains Mono) for "Data Evidence" snippets at 12px size.