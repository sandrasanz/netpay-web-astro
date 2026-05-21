# NetPay UK — Operations Runbook

> **Purpose:** how to deploy, debug, and operate netpayuk.com day-to-day.
> **Last updated:** 21 May 2026 (Astro cutover day)
> **Audience:** Sandra (you), or any future contributor.

---

## How the site is wired up

```
┌──────────────────────────────┐         ┌──────────────────────────────┐
│  Local project               │         │  GitHub                       │
│  ~/Documents/NetPayWebAstro/ │ ──push─►│  sandrasanz/netpay-web-astro  │
│  (Astro 4, Node 20)          │         │  branch: main                 │
└──────────────────────────────┘         └────────────┬─────────────────┘
                                                      │ webhook
                                                      ▼
                                         ┌──────────────────────────────┐
                                         │  Netlify                      │
                                         │  Site: chic-eclair-8400c7     │
                                         │  Site ID:                     │
                                         │  a5998e53-a1d8-494c-ab7a-     │
                                         │  2838d7f5b95a                 │
                                         │  Build: npm run build → dist/ │
                                         └────────────┬─────────────────┘
                                                      │ serves
                                                      ▼
                                         ┌──────────────────────────────┐
                                         │  netpayuk.com (live)          │
                                         │  DNS: Hover                   │
                                         │  SSL: Let's Encrypt           │
                                         │  (auto-renews every 90 days)  │
                                         └──────────────────────────────┘
```

---

## Key URLs and IDs

| Thing | Value |
|---|---|
| Live site | https://netpayuk.com |
| Netlify dashboard | https://app.netlify.com/projects/chic-eclair-8400c7 |
| Netlify subdomain | https://chic-eclair-8400c7.netlify.app |
| GitHub repo | https://github.com/sandrasanz/netpay-web-astro |
| Netlify Site ID | `a5998e53-a1d8-494c-ab7a-2838d7f5b95a` |
| Domain registrar | Hover (https://hover.com) |
| Production branch | `main` |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | 20 |

---

## Day-to-day: Deploy a change

### Default workflow (recommended)

1. Open Terminal
2. `cd ~/Documents/NetPayWebAstro`
3. Edit the file(s) you want to change in your editor
4. (Optional but smart) Run a local preview: `npm run dev` → http://localhost:4321
5. When happy:
   ```bash
   git add -A
   git commit -m "describe your change"
   git push origin main
   ```
6. Netlify auto-builds and deploys within ~30-60 seconds. Watch progress at:
   https://app.netlify.com/projects/chic-eclair-8400c7/deploys

That's it. No CLI commands needed.

### CLI workflow (for hotfixes, or testing without committing)

Useful when you want to deploy without committing to git (e.g., quick test, or you can't push for some reason).

```bash
cd ~/Documents/NetPayWebAstro

# Test deploy to a temporary URL (doesn't touch netpayuk.com)
netlify deploy

# Promote your local files directly to production
netlify deploy --prod
```

The site is already linked, so these "just work."

---

## Rollback (if something breaks)

### Option A — Roll back via Netlify dashboard (fastest)

1. Go to https://app.netlify.com/projects/chic-eclair-8400c7/deploys
2. Find a known-good previous deploy (any with "Production Completed" status)
3. Click the "..." menu next to it → "Publish deploy"
4. Live in ~30 seconds.

The May 18 Webflow deploys at the bottom of the list are still there as your "nuclear option" rollback — they predate the Astro migration entirely.

### Option B — Roll back via git

```bash
cd ~/Documents/NetPayWebAstro
git log --oneline -10              # find the good commit
git revert <bad-commit-hash>       # creates a revert commit
git push origin main               # auto-deploys the revert
```

---

## DNS configuration (Hover)

**Do NOT change these unless you know what you're doing.** The current correct config:

| Type | Host | Value | Purpose |
|---|---|---|---|
| A | `@` | `75.2.60.5` | Points root domain to Netlify |
| CNAME | `www` | `chic-eclair-8400c7.netlify.app` | Points www to Netlify |
| MX | `@` | `10 mx.hover.com.cust.hostedemail.com` | Email routing (if you ever set up Hover email) |
| TXT | `@` | `google-site-verification=...` | Required for Google Search Console |

**The bug we fixed on 21 May:** There used to be extra A records pointing to `216.40.34.41` (Hover's parking page IP). They caused ~50% of Let's Encrypt SSL renewal attempts to fail. They're now deleted. **If SSL ever fails to renew again, first check that these records haven't come back.**

Quick check from terminal:
```bash
dig +short netpayuk.com A
# Should return ONLY: 75.2.60.5
# If it returns multiple IPs, that's the bug again.
```

---

## SSL certificate

- **Issuer:** Let's Encrypt
- **Auto-renews:** Yes, every ~60-90 days, automatically by Netlify
- **Manual renewal page:** https://app.netlify.com/projects/chic-eclair-8400c7/domain-management
- **What to do if renewal fails:** check DNS first (see above), then click "Renew certificate" in the Netlify dashboard

---

## Common operations

### Add a new page

1. Create `src/pages/<page-name>.astro`
2. Use BaseLayout (see `src/pages/index.astro` for an example)
3. Commit + push → page is live at `https://netpayuk.com/<page-name>`

### Edit head metadata (title, description, etc.)

- **Sitewide stuff** (Plausible, schema, fonts) → edit `src/layouts/BaseLayout.astro`
- **Per-page stuff** → edit the props passed to `<BaseLayout>` in each page

### Add a new image

1. Drop it into `public/images/`
2. Reference it in any page as `/images/your-file.png`
3. Commit + push

### Build the site locally (without deploying)

```bash
cd ~/Documents/NetPayWebAstro
npm run build           # creates dist/ folder
npm run preview         # serves dist/ at http://localhost:4321
```

### Check who's linked to what

```bash
cd ~/Documents/NetPayWebAstro
netlify status          # shows the linked Netlify site
git remote -v           # shows the linked GitHub remote
```

---

## Troubleshooting

### "I pushed to GitHub but the site didn't update"

1. Check the deploys page: https://app.netlify.com/projects/chic-eclair-8400c7/deploys — is there a recent build?
2. If yes and it says "Failed," click into the failed build to read the error log.
3. If no build appeared, the GitHub webhook might be broken. Reconnect: Netlify dashboard → Project configuration → Build & deploy → Repository → "Unlink", then re-link.

### "The build fails with a Node version error"

The project requires Node 20. If Netlify is using a different version:
1. Open `netlify.toml`
2. Make sure it has:
   ```toml
   [build.environment]
     NODE_VERSION = "20"
   ```
3. Commit + push

### "SSL is broken / browser warning on netpayuk.com"

1. Check the cert in browser (click the padlock icon)
2. Check Netlify dashboard SSL panel
3. Run the DNS check above — if you see multiple A records again, that's the bug. Go to Hover and delete the bad ones.
4. Click "Renew certificate" in Netlify

### "I want to undo my last commit before it deploys"

If you haven't pushed yet:
```bash
git reset --soft HEAD~1     # undoes the commit, keeps your file changes
```

If you've already pushed:
```bash
git revert HEAD             # creates a revert commit
git push origin main        # deploys the revert
```

---

## Follow-up tidy tasks (not urgent)

- [ ] Rename `package.json` "name" field from `curved-comet` → `netpay-web-astro`
- [ ] Replace the default Astro `README.md` with project-specific docs
- [ ] Pin `NODE_VERSION = "20"` in `netlify.toml` (currently not set, Netlify defaults to 22)
- [ ] Run `npm audit fix` to clear known vulnerabilities (3 moderate, 1 high)
- [ ] Add an `_redirects` file in `public/` if you ever change URL structures
- [ ] Set up Netlify form notifications (currently form submissions just sit in the dashboard)

---

## What this unlocks (per the original Astro migration plan)

Now that structural migration is done:

1. **Programmatic SEO content engine** — writer/critic pipeline → 200+ pages from `keywords.csv`. See `Astro_Migration_Plan.md` and `NetPay_UK_CEO_Plan.md` §3-4.
2. **Tax/NI calculator React island** — port the React Native engine to a TS package, embed it in `/calculators/[slug].astro`.
3. **Blog content (`/insights/`)** — currently `noindex` placeholder. When ready, switch to indexed content collection.
4. **Performance gains** — Lighthouse should now score 70+ on mobile (was 30-50 on the Webflow drop). Improves SEO rankings.

---

## Reference: today's cutover (21 May 2026)

What happened, in order:
1. Linked local Astro project to existing Netlify site (`chic-eclair-8400c7`) via CLI
2. Tested with `netlify deploy` (draft URL only)
3. QA verified — all 12 pages, schemas, sitemap, no wedoflow refs
4. Promoted to production with `netlify deploy --prod`
5. Diagnosed split-DNS at Hover (2 extra A records pointing to Hover parking)
6. Deleted bad DNS records → cert renewal succeeded → SSL valid through Aug 2026
7. Linked Netlify production site to GitHub repo → continuous deployment from `main`
8. Deleted duplicate Netlify site (`netpay-web-astromigrtation-2026`)

End state: one Netlify site, one GitHub repo, one set of DNS records, auto-deploy on push.
