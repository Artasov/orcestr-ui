<p align="right">
  <strong>English</strong> · <a href="./README.ru.md">Русский</a>
</p>

<p align="center">
  <a href="https://orcestr.com">
    <img src="./assets/orcestr-banner.webp" alt="Orcestr banner" width="100%" />
  </a>
</p>

# Orcestr UI

## [Demo](https://orcestr.com/ui)

Open the live example page to inspect Orcestr UI components and patterns in context.

Shared React UI foundation for Orcestr products.

Orcestr UI is a public component library extracted from real Orcestr product work. It collects the interface primitives we reuse across product surfaces: app shell patterns, dense operational controls, workflow states, overlays, form fields, data views, design tokens and theme infrastructure.

The goal is practical reuse, not a showcase-only design system. Components are built for product screens where people scan data, make decisions, confirm actions, navigate workflows and return to the same tools every day.

Part of the [Orcestr](https://orcestr.com) ecosystem.

## Status

Status: early public UI layer.

The package is already used as the shared UI base for Orcestr development. The public API is intentionally small enough to stay understandable, but broad enough to cover real application screens: buttons, fields, pickers, overlays, tables, command surfaces, app shell, workflow components, theme and locale providers.

## Install

```bash
npm install @orcestr/ui
```

For local development from an Orcestr product repository:

```bash
npm install ../../orcestr-ui
```

## Usage

Import the runtime styles once near the application root and wrap the app with `OrcestrUiProvider`.

```tsx
import {Button, OrcestrUiProvider} from '@orcestr/ui';
import '@orcestr/ui/styles.css';

export function App() {
    return (
        <OrcestrUiProvider locale='en' defaultMode='dark'>
            <Button>Save</Button>
        </OrcestrUiProvider>
    );
}
```

The React Query adapter is optional and kept outside the main entrypoint:

```ts
import {usePaginatedComboboxQueryLoader} from '@orcestr/ui/react-query';
```

The example page is published through a separate entrypoint, with separate demo styles:

```tsx
import {UiExamplePage} from '@orcestr/ui/example/UiExamplePage';
import '@orcestr/ui/example/styles.css';
```

## What Is Included

- Application shell primitives for product layouts.
- Theme, tokens, system props and locale provider.
- Actions, buttons, icon buttons, menus and command surfaces.
- Fields, selects, comboboxes, pickers, switches, checkboxes and segmented controls.
- Dialogs, drawers, modals, popovers, tooltips, context menus and confirm flows.
- Tables, pagination, state views, badges, alerts, skeletons and spinners.
- Workflow components for lifecycle, status and operational process screens.
- Utility hooks for disclosure, floating layers, focus, keyboard navigation and controlled state.

## Design Direction

Orcestr UI is tuned for operational software: dashboards, catalogs, workflows, review screens, finance tools, procurement flows and internal product surfaces.

The design direction is quiet and functional:

- dense but readable information;
- predictable controls;
- clear states and confirmations;
- reusable theme tokens;
- components that survive real product usage before becoming public API.

## Package Entrypoints

| Entrypoint | Purpose |
| --- | --- |
| `@orcestr/ui` | Main React components, providers, hooks and theme API. |
| `@orcestr/ui/styles.css` | Runtime styles for the component library. |
| `@orcestr/ui/react-query` | Optional React Query adapter for paginated combobox loaders. |
| `@orcestr/ui/example/UiExamplePage` | Demo page for visual inspection and internal documentation. |
| `@orcestr/ui/example/styles.css` | Styles used only by the example page. |

## Scripts

```bash
npm run build
npm run typecheck
npm test
npm run pack:dry-run
```

- `npm run build` emits `dist` JavaScript, declarations and CSS.
- `npm run typecheck` checks TypeScript without emitting files.
- `npm test` runs contract and state tests.
- `npm run pack:dry-run` checks the published package contents.

## Release

NPM publishing is handled by GitHub Actions on tags matching `ui-v*`.

Full release guide: [docs/RELEASE.md](./docs/RELEASE.md).

Local release helpers:

```bash
npm run release:patch
npm run release:minor
npm run release:major
```

Each helper bumps `package.json` and `package-lock.json`, creates a release commit and creates a tag such as `ui-v0.0.2`. Push the commit and tag to start the release workflow:

```bash
git push
git push origin ui-v0.0.2
```

For the first `0.0.1` release, commit the prepared package and push tag `ui-v0.0.1`.

The workflow runs typecheck, tests, build and `npm pack --dry-run` before publishing `@orcestr/ui` to NPM.

## Ecosystem

Orcestr UI is one of the first public pieces of the Orcestr ecosystem.

- [Orcestr](https://orcestr.com) - main website and product entry point.
- [Orcestr Overview](https://github.com/Artasov/orcestr-overview) - public product and ecosystem description.
- [Orcestr Repo Notifier](https://github.com/Artasov/orcestr-repo-notifier) - GitHub Action for Codex-generated Telegram development updates.

## Maintainer

Public updates are currently maintained by [@Artasov](https://github.com/Artasov).
