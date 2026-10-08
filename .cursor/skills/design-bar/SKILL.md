---
name: design-bar
description: >-
  Raise the visual and copy quality of a surface in this site (postgres-prisma /
  Астрология_Инь) against the anti-template design bar and the brand voice - hierarchy,
  spacing rhythm, depth, typography pairing (Onest / Geologica / Kingthings Petrock),
  semantic use of the purple/pink/yellow palette, designed hover/focus/active states,
  motion that clarifies, and warm, precise Russian copy. Use when building or reviewing
  the home page, consultation cards, bonus program, modals or any visual surface, when
  asked to make UI "less generic / less template-like", polish a design, improve the look
  and feel, or write/check user-facing copy.
metadata:
  author: vadim
  version: "1.0"
  adapted-from: "doctronic-monotronic skills/web-design v1.0"
---

# Design quality (anti-template + brand voice)

Two bars beyond "it renders and uses the Tailwind tokens": the **anti-template design
bar** (does it look intentional and specific to this astrologer's brand?) and the
**copy voice** (does every string sound like a warm, precise person, in Russian?).
Tokens and components are table stakes (`styling-tailwind.mdc`); this is about
_composition_ and _voice_ on top of them.

## When to apply

- Building or reviewing the home page, consultation list/detail, bonus program, article
  pages, modals, account screens.
- "Make this less generic", "polish the design", "improve the look and feel".
- Writing or editing user-facing text - buttons, errors, empty/success states, modal copy,
  emails.

## Design pass (`references/design-bar.md`)

Do not ship template-looking UI. Before writing a visual surface, pick a specific style
direction, a deliberate use of the palette (`primary` dark background with white
surfaces, `purple` for brand/actions, `pink` for emphasis and amounts, `yellow` for
warnings/bonuses, `red` for primary CTAs), and a typography pairing (`font-logo` for the
brand mark only, `font-head` for headings, `font-sans` body). Every meaningful surface
should show **at least four** required qualities and none of the banned patterns. Full
lists and the component checklist: `references/design-bar.md`.

The brand is personal and calm: intentional does not mean flashy. Restraint is fine,
_genericness_ is not. Do not default to dark mode for new sections - the site's
established pattern is a dark page frame with light content surfaces.

## Copy pass (`references/ux-copy.md`)

Write Russian copy that is **precise, warm, humble and clear**: buttons name the action,
errors say what to do next, no promised outcomes, no pressure around money or bonuses,
«вы» register, amounts from data. **Write it, then cut it in half.** Words to favor and
avoid, before/after examples: `references/ux-copy.md`. The always-on rule for copy is
`.cursor/rules/ux-copy-ru.mdc`; this reference goes deeper.

## How to run a quality pass

1. **Render it** - view the surface via the Chrome DevTools MCP (`browser-qa`) at 375, 768
   and 1024.
2. **Score the design** against `references/design-bar.md` - name which required qualities
   it hits and which banned patterns it slips into; propose specific fixes (not "make it
   pop").
3. **Audit the copy** against `references/ux-copy.md` - flag every string that is cold,
   pushy, English, mixed-register or flabby; rewrite it.
4. **Report** concrete, prioritized changes. This is a _quality_ lens, complementary to
   `review-changes` (correctness and conventions). Never relax a convention to chase a
   visual; raise both.

## Guardrails

- Tailwind tokens, `cn()`, mobile-first, focus and reduced-motion rules are assumed
  (`styling-tailwind.mdc`) - do not trade them for a look.
- Performance is part of quality: at-fold content visible at first paint, hero image
  with `priority` + `fetchPriority="high"`, compositor-friendly motion. Retrieve the
  `css` and `performance` guides from `modern-web-guidance` instead of recalling them.
- Copy must never promise outcomes of a consultation or shame the user about money.

## References

- `references/design-bar.md` - banned patterns, required qualities, style directions,
  the component checklist.
- `references/ux-copy.md` - the brand voice for this site, words to favor/avoid, UX-copy
  principles, before/after examples, the amounts-from-data rule.
