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

## Notes

- Save key: `localStorage["silo.save.v2"]`
- No backend; content is validated with Zod at load
- Mobile-first at 390px, works on desktop
