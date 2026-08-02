<p align="right">
  <strong>English</strong> · <a href="./CONSUMER_GUIDE.ru.md">Русский</a>
</p>

# Orcestr UI consumer guide

This guide describes how any React application can integrate `@orcestr/ui`.
The package does not know about consumer routes, domains, product modules or
branding. Applications provide their own theme values and business behaviour.

## Installation

```bash
npm install @orcestr/ui react react-dom react-icons
```

TanStack Query is optional and is required only for the separate query adapter:

```bash
npm install @tanstack/react-query
```

Import the runtime stylesheet exactly once near the application root:

```tsx
import '@orcestr/ui/styles.css';
```

## Provider setup

`OrcestrUiProvider` configures locale, colour mode, theme tokens, overlays and
toasts. Place it above every component that can open a modal, drawer, popover or
toast.

```tsx
import type { ReactNode } from 'react';
import { OrcestrUiProvider } from '@orcestr/ui';
import '@orcestr/ui/styles.css';

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <OrcestrUiProvider locale="en" defaultMode="dark" toastPosition="top-right">
            {children}
        </OrcestrUiProvider>
    );
}
```

Use the controlled `mode` / `onModeChange` pair when application state owns the
colour mode. Use `defaultMode` for an uncontrolled provider.

## Application themes

The library ships one neutral dark theme and one neutral light theme. Consumer
applications own named presets, branding and module-specific tokens. Pass those
values through `themeOverrides`:

```tsx
import type { OrcestrThemeOverrides } from '@orcestr/ui';

const workspaceTheme: OrcestrThemeOverrides = {
    colors: {
        primary: {
            base: '#7c3aed',
            text: '#d8ccff',
            surface: 'rgb(124 58 237 / 16%)',
            border: 'rgb(124 58 237 / 24%)',
            contrast: '#ffffff',
        },
    },
};

<OrcestrUiProvider mode="dark" themeOverrides={workspaceTheme}>
    {children}
</OrcestrUiProvider>;
```

Keep presets in the consuming application and select them using that
application's own route, tenant or product state. Prefer semantic CSS variables
such as `--oui-pad-bg`, `--oui-text` and `--oui-primary-base` in application CSS.
Internal component class names are not a public customisation API.

## Client and server entrypoints

The main `@orcestr/ui` entrypoint contains interactive client components and
providers. In Next.js Server Components, import render-only primitives from
`@orcestr/ui/server`:

```tsx
import { Box, Flex, Table, Text } from '@orcestr/ui/server';
```

Use the main entrypoint when a component needs state, effects, browser APIs,
event handlers or overlays.

## Overlays

Render modal and drawer triggers below `OrcestrUiProvider`. The shared overlay
manager coordinates stacking, Escape handling, focus and scroll locking.

- Use controlled `open` and `onOpenChange` when routing or business state owns visibility.
- Use component default state only for isolated UI interactions.
- Treat backdrop clicks and Escape as close requests through `onOpenChange`.
- Set `portalContainer` only when overlays must render inside a specific DOM root.

## Choosing components

| Need                                  | Use                                                 |
| ------------------------------------- | --------------------------------------------------- |
| Navigation to another location        | `Link`                                              |
| Action on the current screen          | `Button` or `IconButton`                            |
| Blocking decision or form             | `Modal` / `Dialog`                                  |
| Narrow-screen supplemental navigation | `Drawer`                                            |
| Short status message                  | `Alert`                                             |
| Transient global feedback             | `useToast()`                                        |
| Remote paginated choice               | `PaginatedCombobox` plus the optional query adapter |

Do not replace links with buttons or clickable containers. Native semantics are
part of the accessibility contract.

## React Query adapter

`@orcestr/ui/react-query` keeps data-fetching dependencies out of the base UI
bundle:

```ts
import { usePaginatedComboboxQueryLoader } from '@orcestr/ui/react-query';
```

The application owns query keys, API calls, cache invalidation and error policy.
The adapter only maps query state to UI component state.

## Testing a local package build

Build and pack the library, then install the generated tarball in any consumer:

```bash
npm run build
npm pack
npm install /path/to/orcestr-ui/orcestr-ui-<version>.tgz
```

Published manifests must always reference a registry version, never a local
`file:` or `link:` path.
