---
name: Dependency Hygiene
about: Streamline, secure, and optimize project dependencies
title: 'chore: [deps] improve dependency hygiene'
labels: ['dependencies', 'chore', 'security']
assignees: ''
---

## Goal
Only depend on well-maintained, mainstream packages pinned to known versions, with a minimal and correct dependency graph.

## How-to

### Inventory & Assess
- **Inventory deps:**
  ```bash
  npx depcheck
  npm ls --all > deps-tree.txt
  npm audit
  ```
- **Assess health:** remove packages with few downloads, no recent commits, or <100 GitHub stars unless justified.
- **License check:** ensure all dependencies are permissive (MIT/Apache/BSD). Drop anything ambiguous.

### Pinning & Replacement
- **Pin versions:** switch all `^`/`~` ranges to exact versions in `package.json`. Prefer `resolutions`/`overrides` for transitive pins.
- **Replace heavy/legacy:**
  - `moment` → `date-fns` or `luxon`
  - `lodash` → per-method imports (`lodash-es` or `lodash/<method>`)
  - Abandon untyped libs if good TS options exist.

### Cleanup & Sanity
- **Promote/demote deps:** anything used only in build/test → `devDependencies`; runtime imports → `dependencies`.
- **Remove duplicates/overlaps:** e.g., both `node-sass` and `sass`, both `emotion` and `styled-components` if not needed.
- **Scripts sanity:** ensure `package.json` scripts are clean and functional.
  ```json
  {
    "scripts": {
      "dev": "vite",                // or next dev / react-scripts start
      "build": "vite build",
      "preview": "vite preview",
      "lint": "eslint . --ext .ts,.tsx",
      "typecheck": "tsc --noEmit",
      "depcheck": "depcheck",
      "analyze": "ANALYZE=true vite build"
    }
  }
  ```
- **Lockfile hygiene:** delete `package-lock.json`/`pnpm-lock.yaml` inconsistencies; reinstall once with your chosen manager.
- **Prune:**
  ```bash
  npm prune
  npm dedupe
  ```

## Done when

- [ ] `depcheck` shows no unused dependencies.
- [ ] All top-level dependencies are mainstream, current, and pinned.
- [ ] `npm audit` only has low/no issues (or documented ignores).
- [ ] No obscure/obscurely hosted libraries remain.
- [ ] All licenses are permissive (MIT/Apache/BSD).
- [ ] `package.json` scripts are clear, correct, and functional.
- [ ] Lockfile is consistent and fresh.
- [ ] CI/CD includes `lint`, `typecheck`, `depcheck`, and a production `build` step.
