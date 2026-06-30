# @orcestr/ui

Orcestr UI is the shared React UI package for Orcestr products.

## Install

```bash
npm install @orcestr/ui
```

For local development from `F:/dev/MarketStock/frontend`:

```bash
npm install ../../orcestr-ui
```

## Usage

```tsx
import {Button, OrcestrUiProvider} from '@orcestr/ui';
import '@orcestr/ui/styles.css';

export function App() {
    return (
        <OrcestrUiProvider locale='ru' defaultMode='dark'>
            <Button>Save</Button>
        </OrcestrUiProvider>
    );
}
```

The React Query adapter is optional and is intentionally kept outside the main entrypoint:

```ts
import {usePaginatedComboboxQueryLoader} from '@orcestr/ui/react-query';
```

The demo entrypoint is separate from the runtime styles:

```tsx
import {UiExamplePage} from '@orcestr/ui/example/UiExamplePage';
import '@orcestr/ui/example/styles.css';
```

## Scripts

- `npm run build` - emits `dist` JavaScript, declarations and CSS.
- `npm run typecheck` - checks TypeScript without emitting files.
- `npm test` - runs contract and state tests.
