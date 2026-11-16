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
- Workflow: `.github/workflows/pages.yml` builds and deploys via Actions
- Custom domain `anandhere.xyz` stays on the user site repo `AnandMoorthy/anandmoorthy.github.io` (`CNAME`). This project does **not** set its own CNAME, so apex content is untouched. GitHub serves project sites at `https://anandhere.xyz/<repo>/`.

DNS (already in place — no change needed if still true):

- `anandhere.xyz` → GitHub Pages A records / CNAME to `anandmoorthy.github.io`

Optional: in `AnandMoorthy/silo` → Settings → Pages → Source → **GitHub Actions** (API cannot flip this for the Cursor app).

## Notes

- Save key: `localStorage["silo.save.v2"]`
- No backend; content is validated with Zod at load
- Mobile-first at 390px, works on desktop
