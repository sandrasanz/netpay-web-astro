# CLAUDE.md — NetPayWebAstro

> **Purpose:** Working memory for Claude Code sessions on the NetPay UK Astro migration project.
> **Place this file** at the root of the new repo (`~/Documents/NetPayWebAstro/CLAUDE.md`).

---

## Who you're working with

You're working with **Sandra Sanz** — founder & CEO of NetPay UK, product designer with 8+ years of fintech experience. She's a designer who builds, not a full-time engineer. Be patient with infra/devops, opinionated on design/UX.

## What this project is

This is the **Astro migration** of `netpayuk.com`, the public marketing site for NetPay UK (a take-home pay tracker for UK shift workers, freelancers, and salespeople). The current production site is hand-edited static HTML lifted from a Webflow template, hosted on Netlify. We're rebuilding it on Astro to enable:

1. A single source of truth for `<head>` (currently every page hand-copies Plausible, schema, meta tags — drift bugs already happened)
2. Component-based nav and footer (currently duplicated across 17 HTML files)
3. Foundation for the programmatic SEO content engine (CEO Plan §3, follow-up project)

## The plan you're executing

**The full migration plan lives at:**
`/Users/sandrasanzgonzalez/Documents/Claude/Projects/NetPay UK/Astro_Migration_Plan.md`

Read it first. It contains:
- 7 phases with time estimates
- Decisions already locked (pacing, visual fidelity, CSS approach, programmatic SEO timing)
- Exact code snippets for `BaseLayout.astro`, `astro.config.mjs`, `netlify.toml`
- Acceptance criteria
- Parallel-build + Netlify-preview strategy (we do NOT touch live netpayuk.com during build)

**Other useful context files in `/Users/sandrasanzgonzalez/Documents/Claude/Projects/NetPay UK/`:**
- `CONTEXT.md` — full business context (NetPay UK, Bluka Labs, target market, etc.)
- `SEO_Foundations.md` — what we shipped today (Steps 1–8 of SEO setup, all complete)
- `NetPay_UK_CEO_Plan.md` — the longer-term strategy doc
- `NOTES.md` — running log of decisions

## Current production site (DO NOT TOUCH during migration)

- Location: `/Users/sandrasanzgonzalez/Documents/NetPayWeb2026/`
- Live at: `https://netpayuk.com`
- Hosting: Netlify
- Has: 17 HTML files, Webflow-template CSS, jQuery + webflow.js, fully working
- **Status:** keeps serving traffic exactly as today until we cut over

## Decisions already locked (don't relitigate)

| Decision | Choice |
|---|---|
| Pacing | Build in 2 sessions, ~6 hrs each |
| Visual fidelity | **Pixel-perfect match** to current production. No redesign. |
| CSS approach | **Port existing Webflow CSS as-is** into `/public/css/`. No Tailwind. |
| Programmatic SEO | **After** clean migration — this project is structural only |
| Repo | New repo `netpayuk-web-astro` (separate from NetPayWeb2026) |
| Cutover | Netlify preview URL → validate → repoint custom domain |

## What's in scope for this project

- ✅ Astro project scaffold
- ✅ BaseLayout.astro with shared head (Plausible, schema, preconnect, etc.)
- ✅ Navbar + Footer components (replace `wedoflow` social URLs with real ones — see Task #14)
- ✅ Port 12 pages (index, sales, features, freelancers, company, contact, privacy, terms, delete-account, android-beta, insights, 404)
- ✅ Reusable schema components (Organization, WebSite, Person, AboutPage, SoftwareApplication)
- ✅ Sitemap auto-generated via `@astrojs/sitemap`
- ✅ Deploy to Netlify preview
- ✅ QA + production cutover

## What's NOT in scope (deferred)

- ❌ Programmatic SEO content engine (writer/critic pipeline, 200+ pages from keywords.csv) — separate project
- ❌ Visual redesign of any kind
- ❌ Tax/NI calculator React island — separate project
- ❌ Blog content writing — separate project
- ❌ New marketing pages

If something tempts scope creep, add it to a `BACKLOG.md` and keep migrating.

## Key URLs and tokens

- Production: `https://netpayuk.com`
- Plausible script src: `https://plausible.io/js/pa-lj7t53i7rXwdgq514BG0g.js`
- App Store: `https://apps.apple.com/gb/app/netpay-uk-salary-tracker/id6757113332`
- Play Store: `https://play.google.com/store/apps/details?id=io.bluka.uknetpay`
- Instagram (real): `https://www.instagram.com/netpayuk/`
- LinkedIn: not yet — Sandra is between jobs, will add later (see Task #17 in foundations)
- Companies House: trades under Bluka Labs (`https://bluka.io`)
- Google Search Console: verified at `sc-domain:netpayuk.com` (Sandra's `sandrasanzgonzalez@gmail.com`)
- Bing Webmaster Tools: imported from GSC
- Netlify project (production): the one currently serving netpayuk.com

## Tone for working with Sandra

- Be concrete, not abstract. Show what you'll do before you do it.
- Run small verifications between phases (don't do 4 hours of work then ask "does it work?")
- Use `git commit` regularly with descriptive messages — easier rollback story
- When uncertain, ask. Sandra would rather answer one question than untangle a wrong-direction decision later.
- **Critical:** the live production site must keep working throughout. If you're ever about to touch `/Users/sandrasanzgonzalez/Documents/NetPayWeb2026/`, stop and ask.

## How to start work

1. Read `Astro_Migration_Plan.md` end to end
2. Confirm Phase 0 prerequisites with Sandra (Node.js installed, repo decision)
3. Start Phase 1 (scaffold)
4. Commit after each phase
5. Verify locally with `npm run dev` between phases

Good luck. The plan is solid. Just execute it.
