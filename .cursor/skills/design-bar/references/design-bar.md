# The anti-template design bar

Frontend output should look intentional, opinionated, and specific to the product —
not a generic template. This is the bar for visual/marketing surfaces.

## Banned patterns

- Default card grids with uniform spacing and no hierarchy.
- Stock hero: centered headline + gradient blob + generic CTA.
- Unmodified library defaults passed off as finished design.
- Flat layouts with no layering, depth, or motion.
- Uniform radius, spacing, and shadow across every component.
- Safe gray-on-white with one decorative accent color.
- Dashboard-by-numbers: sidebar + cards + charts with no point of view.
- Default font stacks used without a deliberate reason.

## Required qualities (hit at least four per meaningful surface)

1. Clear hierarchy through scale contrast.
2. Intentional rhythm in spacing — not uniform padding everywhere.
3. Depth/layering via overlap, shadows, surfaces, or motion.
4. Typography with character and a real pairing strategy.
5. Color used semantically, not just decoratively.
6. Hover, focus, and active states that feel designed.
7. Grid-breaking editorial or bento composition where appropriate.
8. Texture, grain, or atmosphere when it fits the direction.
9. Motion that clarifies flow instead of distracting.
10. Data visualization treated as part of the design system, not an afterthought.

## Before writing a visual surface

1. Pick a specific style direction (avoid vague "clean minimal").
2. Define a palette intentionally (within the `tailwind.config.js` tokens: `primary`,
   `purple*`, `pink`, `yellow*`, `red*`, `gray*`).
3. Choose typography deliberately (`font-logo` for the brand mark, `font-head` for
   headings, `font-sans` for body - a real pairing strategy, not one size everywhere).
4. Gather a few real references.

Worthwhile directions: editorial/magazine · neo-brutalism · glassmorphism with real
depth · dark/light luxury with disciplined contrast · bento · scrollytelling · 3D
integration · Swiss/International · retro-futurism. **Don't default to dark mode** —
choose what the surface wants.

## Component checklist

- [ ] Avoids looking like a default Tailwind/shadcn/library template.
- [ ] Intentional hover/focus/active states.
- [ ] Hierarchy rather than uniform emphasis.
- [ ] Would look believable in a real product screenshot.
- [ ] If it supports both themes, both feel intentional.

## Performance is part of quality

Motion mechanics (compositor-friendly properties, `prefers-reduced-motion`), image
priority and the CWV targets are `modern-web-guidance`'s — retrieve the `css` and
`performance` guides, don't recall them. Repo-specific: the at-fold hero gets
`priority` + `fetchPriority="high"`, and nothing at the fold is hidden behind a reveal
animation (`styling-tailwind.mdc`).

## Gotchas

- "Make it pop" is not a fix — name the specific quality missing (hierarchy? depth?
  state design?) and the concrete change.
- Token/component compliance is assumed; this bar is about composition on top of it.
- A personal astrologer's brand: intentional ≠ flashy. Calm, trust and clarity lead;
  restraint is fine, _genericness_ is not.
