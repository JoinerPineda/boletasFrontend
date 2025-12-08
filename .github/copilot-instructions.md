## Repo summary

- This is a small client-only React + Vite app (TypeScript + .tsx) for a ticketing admin UI: core entry is `src/main.tsx` which mounts `App` (`src/App.tsx`). Navigation is controlled by `App`'s local state and `onNavigate` callbacks passed into page components.
- Major UI pages/components: `src/components/Home.tsx`, `src/components/Auth.tsx`, `src/components/UserPanel.tsx`, `src/components/AdminPanel.tsx`, `src/components/Confirmation.tsx`.
- UI primitives and styling live under `src/components/ui/*` (Card, Button, Tabs, Dialog, Table, etc.). Prefer using these primitives for consistent look-and-feel.
- The app uses Tailwind-like utility classes in JSX and relies on many Radix UI packages and small UI libs (see `package.json`).

## What an AI coding agent should know (quick)

- Build / dev commands (local):

```powershell
npm i
npm run dev    # starts vite dev server (port 3000, opens browser)
npm run build  # production build -> `build/`
```

- Vite config notes: `vite.config.ts` defines an alias `@` -> `./src` and several package-name aliases. Use `@/` imports when adding code (e.g. `import X from '@/components/...';`).
- No backend or API present: most data (matches, stadium sections, simulation) is hard-coded in component state. When adding persistence, look for where state is created (for example `matches` in `AdminPanel.tsx`) and factor out services.

## Patterns & conventions specific to this repo

- Navigation: single-page manual routing — `App.tsx` keeps `currentPage` and renders the matching component. New pages should be added by updating `App.tsx` and wiring `onNavigate` calls.
- Data flow: mostly local component state (useState). Components pass lightweight objects via `onNavigate(page, data)` — e.g., `UserPanel` calls `onNavigate('confirmation', { match, section })` and `App` stores that object in `purchaseData`.
- UI primitives: use components from `src/components/ui/*` for controls (e.g., `Button`, `Card`, `Dialog`, `Tabs`, `Table`). Look at existing components for prop patterns (many accept `className`, `variant`, `size`).
- Language/content: UI strings and labels are in Spanish — follow Spanish copy style when adding UI text.
- Styling: uses utility classes (Tailwind-like). Keep layout responsive (grid, max-w-7xl) consistent with existing components.

## Files to inspect when changing behavior

- `src/App.tsx` — central navigation and shared state (`purchaseData`, `userType`).
- `src/components/*` — page implementations and local data examples.
- `src/components/ui/*` — shared UI primitives; extend here for design-consistent widgets.
- `vite.config.ts` — aliases and build options (outDir `build`, server.port = 3000).
- `package.json` — dependency list and scripts.

## Helpful examples (copyable patterns)

- Navigate from a component to the confirmation page, passing data:

```tsx
// inside a component
onNavigate('confirmation', { match, section });
```

- Mounting the app entry (do not change): `src/main.tsx` imports `App` and `index.css` and calls `createRoot(...).render(<App />)`.

## When to create/change services instead of editing components

- If you need persistence, add a new `src/services/` module and replace hard-coded arrays in `AdminPanel.tsx` / `UserPanel.tsx` with calls to that service. Keep components focused on presentation and local UI state.

## External integrations & third-party notes

- The project depends on many small UI libraries (Radix UI, lucide-react, sonner, recharts, etc.). Adding a new dependency should be reflected in `package.json` and installed with `npm i`.
- Images are external (unsplash + figma exports). When testing offline, stub or replace these URLs with local fixtures.

## Tests & CI

- There are no tests or CI config in the repository. If adding tests, follow the code style of existing TypeScript + React files and put tests under `__tests__` or `src/__tests__`.

## Small checklist for PRs an AI agent may create

- Update `vite.config.ts` only if you know you need a new alias or build tweak.
- Use `@/` imports for files under `src/`.
- Keep Spanish UI copy consistent and prefer existing UI primitives.
- Run `npm run dev` locally to verify UI rendering; confirm there are no missing imports or broken JSX.

---
If anything is unclear or you want me to expand sections (e.g., add examples for creating a new `ui/` component or extracting a `services/` module), tell me what to include and I will iterate.
