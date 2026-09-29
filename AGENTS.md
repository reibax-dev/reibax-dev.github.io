# AGENTS.md

## What this directory is

Not a git repo. It is a folder holding **5 independent git clones**. Never run `git` commands from this root — always `cd` into the target clone (or use `workdir`).

| Directory | Remote | Role |
| --- | --- | --- |
| `03-legion-del-mal/` | `reibax-dev/reibax-git-github` | **The active Legion del Mal repo.** Content + GitHub Actions exercises. |
| `01-reibax-git-github/` | `reibax-dev/reibax-git-github` | **Stale clone of the same remote.** See trap below. |
| `01-evil-plan-01/` | none | Standalone canvas "Proyecto Omega" trajectory demo, no remote. |
| `05-claude-asteroids/` | `reibax-dev/claude-asteroids` (both `origin` and `upstream`) | Vanilla canvas Asteroids clone. |
| `reibax-dev.github.io/` | `reibax-dev/reibax-dev.github.io` | GitHub Pages static site. |

### Trap: two clones, one remote

`01-reibax-git-github` and `03-legion-del-mal` point at the **same** GitHub repo. `03-legion-del-mal` is the current one (has `.github/`, `scripts/`, `docs/`, extra intel files); `01-reibax-git-github` is an older snapshot missing all of those. Commits made in `01-reibax-git-github` will be rejected by GitHub as non-fast-forward. **Work only in `03-legion-del-mal`.**

## No build, no tests, no package manager

There is **no `package.json`, no bundler, no test runner, no linter anywhere.** `03-legion-del-mal/node_modules/` and `dist/` are decoys: `node_modules/` holds four 0-byte files (`app.module.ts`, `react.tsx`, `svelte.svelte`, `vue.vue`), `dist/` is empty, and both are gitignored. Do not run `npm install` and do not add dependencies.

Every project is plain HTML + CSS + a single vanilla JS file (`docs/script.js`, `game.js`, `script.js`). Preview by opening `index.html` directly or `npx serve .`. `03-legion-del-mal/.vscode/settings.json` pins Live Server to port **5501**.

**Only sanctioned verification:**
- `03-legion-del-mal`: `bash scripts/validar-planes.sh` — run it from the repo root, it uses relative paths (`planes/*.md`, `miembros/*.yml`, `inteligencia/perdedores/*.md`) and breaks from anywhere else. This is also what CI runs.
- `01-evil-plan-01`: `node --check script.js` (the only permission in its `.claude/settings.local.json`).

## The validator is the contract

`03-legion-del-mal/scripts/validar-planes.sh` exits **1** on errors and 0 on warnings, so CI (`05-control-calidad.yml`, on push/PR to `main`) only blocks on errors. Its checks:

1. Every `planes/*.md` must contain the exact heading `## Plan de escape`.
2. No tracked `.env` (`git ls-files "*.env"`). Note `.gitignore` has `*.env`, so a tracked one is a deliberate mistake.
3. `miembros/*.yml` should contain `estado: activo` (warning only).
4. `inteligencia/perdedores/*.md` should contain `## Estrategia recomendada` (warning only).

Baseline on `main` is **0 errors, 3 warnings**: `miembros/magneto.yml` has `estado: inactivo`, and `inteligencia/perdedores/lobezno.md` + `spiderman.md` lack the strategy heading. Don't "fix" these unless asked; just don't add new ones.

## GitHub Actions workflows are course exercises

`.github/workflows/` in `03-legion-del-mal` is teaching material, not production CI:

- `6a-espia-error.yml` is **intentionally broken** (`on:` is followed by a trailing space + comment, so the trigger key is malformed). Its header comment says so. Leave it broken unless the user is running the debugging exercise.
- `6b-espia-error.yml` is the "workflow runs but a step fails" exercise. It was already repaired in recent commits (`miembros/*.yml`, `inteligencia/perdedores/*.md`).
- `03-comunicador.yml` needs `sudo apt-get install -y cowsay` and uses `cowsay -f` with a `workflow_dispatch` choice input.
- `04-informe-diario.yml` **writes to the repo**: it appends a "📊 Informe diario de Brainiac" block to `README.md`, then commits and pushes as `Reibax <reibax-dev@proton.me>`. Trigger is `workflow_dispatch` only (the cron is commented out). If asked to enable the schedule, note the push requires `contents: write`.
- `01-reclutamiento.yml` and `6b-espia-error.yml` fire on every `push`, so both show up in the Actions tab constantly.
- `mi-primer-workflow.yml` is named `CI` but is the untouched GitHub template. The README badge points at `ci.yml`, which does not exist — the badge is broken by design/neglect.

## Conventions

- **All prose, filenames, YAML keys, and commit messages are Spanish.** Match that. Commits follow Conventional Commits in Spanish: `fix: corregir la ruta de los expedientes...`, `feat: agregar workflows...`.
- Branches are `rama-<kebab-case>` in Spanish: `rama-peli-spiderman`, `rama-actualizar`. `main` is the integration branch; the repo's own rules say nothing lands without Council review.
- `misiones.yaml` is the registry of missions and references plans by `archivo_plan`. Adding a plan usually means adding a mission entry too.
- `docs/` in `03-legion-del-mal` is a **near-copy** of `reibax-dev.github.io/` but the files have diverged (276 vs 312 lines of HTML). Don't sync them automatically.
- `.DS_Store` is tracked in `03-legion-del-mal` and shows up in `git status`. Leave it; don't stage it in unrelated commits.

## Secrets

`03-legion-del-mal/.env` exists locally and is untracked. `codigos-lanzamiento.env` is also gitignored, and in-fiction launch codes must never be committed (the validator enforces the `.env` half of this).
