# BACKLOG.md

Post-migration cleanup items. None of these are in scope for the v2 surgical-wrap migration — they ship as-is in the Astro port so cutover preserves production parity, then get addressed deliberately.

## Legacy template residue on `/company`, `/insights`, `/404`

These pages use the older Webflow template's nav + footer that Sandra never fully rebranded. The wedoflow / Azwedo content was scrubbed during migration (explicit exception). Everything below stays as-is:

- **LegacyNavbar brand logo** is `Sweden_1Sweden.webp` (a Webflow template stock photo named "Sweden Logo - Webflow Template"). Should be `netpaylogo.svg`.
- **LegacyNavbar uses `brand-logo` class with srcset** for that Sweden image. Marketing nav uses inline-styled `<img>` with no class. Decide whether legacy nav inherits the marketing brand markup.
- **LegacyNavbar link labels** ("Product", "Pricing", "Features", "Company", "Insights", "Talk to sales") are template defaults — not aligned with NetPay's marketing voice ("Shift Workers", "Freelancers", "Sales", "Download App").
- **LegacyNavbar "Pricing" link** points to `/sales`. Misleading — sales isn't pricing.
- **FooterLegacy brand logo** is `Sweden_1Sweden.webp` with `footer-image` class. Same fix as nav.
- **FooterLegacy description** copy is generic template fluff: *"Where imagination meets innovation - unleash your creativity with us!"*.
- **FooterLegacy "iOS App" link** points to `/sales` (broken — should be the App Store URL).
- **FooterLegacy "Pricing" link** has a stale `<div class="new-badge">new</div>` ribbon.
- **FooterLegacy "The-Platform" link label** is template jargon — should likely just say "Home" or "App".
- **FooterLegacy "Careers" link** points to `/company#careers` — no such anchor exists.
- **FooterLegacy "Template" column** (Style Guide / Licencing / Change Log / Instructions) is 100% template-vendor documentation, pointing to `/template/style-guide`, `/template/licensing`, `/template/change-log`, `/template/instructions` — none of which exist in NetPay's site. Probably delete the whole column.
- **FooterLegacy subscribe form** placeholder is plain `"Email"` (input type=text). Marketing uses `"Get notified of new apps"` (type=email). Decide if the legacy form should be unified to marketing's UX.
- **FooterLegacy success message** says *"Thank you! We got you!"* — marketing uses *"Thank you! We'll be in touch."*. Pick one voice.

## Marketing footer minor

- **Marketing brand-content `<img>` alt** is `alt="Email"` on the instagram-icon image and `alt="Bluka Labs"` on the linkedin-icon image. Alt text doesn't match the icons it labels (the icon files are still named `instagram.svg` / `linkedin.svg`). Pick: rename the SVGs to match the actual link purposes (email + Bluka) or update alt text.

## Social presence

- **LinkedIn** not yet set — Sandra is between jobs (per CLAUDE.md). Add when ready.
- **No og:image** anywhere in the site. Social link previews currently render with no preview card. Worth adding a unified `og:image` to BaseLayout.

## Possible technical follow-ups

- **/features and /freelancers serve identical content** (both wrap `FreelancersPage.astro`). Their `og:url` and `<link rel="canonical">` are auto-generated from the path, so each currently self-canonicals — duplicate-content risk in Google. Decide one of: (a) set `canonical="/freelancers/"` on features.astro so /features defers SEO weight to /freelancers; (b) Netlify `301 /features → /freelancers`; (c) write separately-positioned content for /features (real "features" page distinct from freelancers).
- Astro CSS scoping (`data-astro-cid-*`) doesn't appear on `<html>` / `<body>` thanks to `is:global`, but page-specific inline styles via `head-extras` slot will still be scoped unless each page also uses `is:global`. Decide the per-page convention before Phase 3 ports.
