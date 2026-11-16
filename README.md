# Silo

Five sealed lives in five sealed worlds. A browser-only Reigns-style prototype: enter any world, play its next chapter, leave, and see what your choices caused when you return.

## Run

```bash
npm i
npm run dev
```

## Test

```bash
npm test
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

Live: **https://anandhere.xyz/silo/**

Setup chosen:

- Source repo: `AnandMoorthy/silo` (project Pages)
- Vite `base`: `/silo/` when `GITHUB_PAGES=true` (see `vite.config.ts`)
- Dev HTML entry: `index.dev.html` (Vite). Root `index.html` + `assets/` are the **production** build for branch Pages.
- Workflow: `.github/workflows/pages.yml` builds `dist/`, uploads the Actions artifact, and syncs `dist/` → repo root so legacy branch Pages stays correct
- Custom domain `anandhere.xyz` stays on the user site repo `AnandMoorthy/anandmoorthy.github.io` (`CNAME`). This project does **not** set its own CNAME, so apex content is untouched. GitHub serves project sites at `https://anandhere.xyz/<repo>/`.

DNS (already in place — no change needed if still true):

- `anandhere.xyz` → GitHub Pages A records / CNAME to `anandmoorthy.github.io`

### Required once (API cannot flip this for the Cursor app)

In GitHub, while signed in as **Anandha**:

1. Open https://github.com/AnandMoorthy/silo/settings/pages
2. Under **Build and deployment** → **Source**, choose **GitHub Actions** (not “Deploy from a branch”)
3. Save if prompted, then re-run **Deploy GitHub Pages** (Actions → workflow → Run workflow) or push to `main`

Until that switch, the workflow still publishes by syncing production `dist/` to the repo root (`index.html` + `assets/`) so `https://anandhere.xyz/silo/` does not serve `/src/main.tsx`.

## Notes

- Save key: `localStorage["silo.save.v2"]`
- No backend; content is validated with Zod at load
- Mobile-first at 390px, works on desktop
