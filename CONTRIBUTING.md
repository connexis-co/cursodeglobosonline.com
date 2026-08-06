# Guía de contribución

## Flujo de trabajo

1. Crea tu rama desde `develop`: `git checkout develop && git pull && git checkout -b feature/descripcion`
2. Commits con [Conventional Commits](https://www.conventionalcommits.org) (validados por commitlint):
   `feat(home): agregar animaciones de globos flotantes`
3. Verifica local: `npm run lint && npm run build`
4. Push y PR hacia `develop` (referencia el issue: `Closes #XX`)
5. Squash merge preferido. `develop` → staging automático; `main` → producción.

## Tipos de commit

`feat` (MINOR) · `fix` (PATCH) · `docs` · `style` · `refactor` · `perf` · `test` · `chore` · `ci` · `build` · `revert`

## Ramas

- `main` — producción · `develop` — integración
- `feature/*`, `bugfix/*` desde develop · `release/v*`, `hotfix/v*` según Git Flow

## Reglas del proyecto

- TypeScript estricto; `astro check` en verde antes de cada PR.
- Los enlaces Hotmart y los datos de cursos (precios, ratings) solo cambian con dato real verificado.
- No tocar `.agents/`, `.gemini/` ni configuración de Antigravity.
- Textos en español, tono cercano y específico (nada de frases genéricas de IA).
