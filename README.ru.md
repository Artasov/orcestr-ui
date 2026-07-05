<p align="right">
  <a href="./README.md">English</a> · <strong>Русский</strong>
</p>

<p align="center">
  <a href="https://orcestr.com">
    <img src="./assets/orcestr-banner.webp" alt="Баннер Orcestr" width="100%" />
  </a>
</p>

# Orcestr UI

[![npm](https://img.shields.io/npm/v/@orcestr/ui)](https://www.npmjs.com/package/@orcestr/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## [Live Demo](https://orcestr.com/ui)

Доступные React-компоненты и стили для интерфейсов приложений.

В пакете есть layout primitives, контролы, поля, overlays, data views, workflow-состояния, theme tokens и utility hooks.

Основной сайт: [orcestr.com](https://orcestr.com)

## Статус

| Пункт   | Значение                        |
| ------- | ------------------------------- |
| Package | `@orcestr/ui`                   |
| Version | `0.2.3`                         |
| Status  | Dev / Beta                      |
| Runtime | React 19                        |
| Styling | CSS из `@orcestr/ui/styles.css` |

Public API еще формируется, пока пакет находится в beta.

## Что внутри

| Зона       | Что входит                                                                     |
| ---------- | ------------------------------------------------------------------------------ |
| App layout | shell, навигационные паттерны, page surfaces                                   |
| Actions    | buttons, icon buttons, menus, command surfaces                                 |
| Inputs     | fields, selects, comboboxes, pickers, switches, checkboxes, segmented controls |
| Overlays   | dialogs, drawers, modals, popovers, tooltips, context menus, confirm flows     |
| Data views | tables, pagination, empty/error/loading states, badges, alerts                 |
| Workflows  | lifecycle и status components для операционных экранов                         |
| Foundation | provider, locale, theme tokens, CSS variables, utility hooks                   |

## Установка

```bash
npm install @orcestr/ui
```

Для локальной разработки внутри Orcestr:

```bash
npm install ../../orcestr-ui
```

## Использование

Подключи CSS один раз рядом с корнем приложения и оберни приложение в `OrcestrUiProvider`.

```tsx
import { Button, OrcestrUiProvider } from '@orcestr/ui';
import '@orcestr/ui/styles.css';

export function App() {
    return (
        <OrcestrUiProvider locale="ru" defaultMode="dark">
            <Button>Сохранить</Button>
        </OrcestrUiProvider>
    );
}
```

React Query integration опциональная:

```ts
import { usePaginatedComboboxQueryLoader } from '@orcestr/ui/react-query';
```

Demo page экспортируется отдельно:

```tsx
import { UiExamplePage } from '@orcestr/ui/example/UiExamplePage';
import '@orcestr/ui/example/styles.css';
```

## Entrypoints

| Entrypoint                          | Назначение                               |
| ----------------------------------- | ---------------------------------------- |
| `@orcestr/ui`                       | Components, providers, hooks и theme API |
| `@orcestr/ui/styles.css`            | Runtime styles UI kit                    |
| `@orcestr/ui/react-query`           | Optional React Query adapter             |
| `@orcestr/ui/example/UiExamplePage` | Demo page component                      |
| `@orcestr/ui/example/styles.css`    | Demo page styles                         |

## Скрипты

```bash
npm run build
npm run typecheck
npm test
npm run pack:dry-run
```

| Script                 | Что проверяет                         |
| ---------------------- | ------------------------------------- |
| `npm run build`        | TypeScript output, declarations и CSS |
| `npm run typecheck`    | TypeScript без emit                   |
| `npm test`             | Contract и state tests                |
| `npm run pack:dry-run` | Состав публикуемого пакета            |

## Release

Публикация в NPM идет через GitHub Actions по тегам `ui-v*`.

Локальные helpers:

```bash
npm run release:patch
npm run release:minor
npm run release:major
```

Каждый helper обновляет `package.json` и `package-lock.json`, создает release commit и tag вроде `ui-v0.2.3`.

```bash
git push
git push origin ui-v0.2.3
```

Workflow перед публикацией запускает typecheck, tests, build и `npm pack --dry-run`.

Полная инструкция: [docs/RELEASE.md](./docs/RELEASE.md).

## Maintainer

Публичные обновления ведет [@Artasov](https://github.com/Artasov).

## License

MIT. См. [LICENSE](./LICENSE).
