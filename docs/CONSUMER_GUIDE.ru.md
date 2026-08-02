<p align="right">
  <a href="./CONSUMER_GUIDE.md">English</a> · <strong>Русский</strong>
</p>

# Руководство по подключению Orcestr UI

Это руководство описывает подключение `@orcestr/ui` к любому React-приложению.
Библиотека ничего не знает о маршрутах, доменах, продуктовых модулях и брендинге
приложения. Темы и бизнес-поведение задаёт само приложение.

## Установка

```bash
npm install @orcestr/ui react react-dom react-icons
```

TanStack Query необязателен и нужен только для отдельного query-адаптера:

```bash
npm install @tanstack/react-query
```

Подключи runtime CSS ровно один раз рядом с корнем приложения:

```tsx
import '@orcestr/ui/styles.css';
```

## Настройка provider

`OrcestrUiProvider` настраивает язык, цветовой режим, токены темы, overlays и
toast-уведомления. Он должен находиться выше компонентов, открывающих modal,
drawer, popover или toast.

```tsx
import type { ReactNode } from 'react';
import { OrcestrUiProvider } from '@orcestr/ui';
import '@orcestr/ui/styles.css';

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <OrcestrUiProvider locale="ru" defaultMode="dark" toastPosition="top-right">
            {children}
        </OrcestrUiProvider>
    );
}
```

Если цветовым режимом управляет состояние приложения, используй пару `mode` /
`onModeChange`. Для неконтролируемого provider используй `defaultMode`.

## Темы приложения

Библиотека содержит одну нейтральную тёмную и одну нейтральную светлую тему.
Именованные пресеты, брендинг и токены конкретных модулей принадлежат приложению.
Они передаются через `themeOverrides`:

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

Храни пресеты в приложении-потребителе и выбирай их по его собственному
маршруту, tenant или продуктовому состоянию. В CSS приложения используй
семантические переменные, например `--oui-pad-bg`, `--oui-text` и
`--oui-primary-base`. Внутренние классы компонентов не являются публичным API
кастомизации.

## Client и server entrypoints

Основной entrypoint `@orcestr/ui` содержит интерактивные client-компоненты и
providers. В Next.js Server Components импортируй render-only примитивы из
`@orcestr/ui/server`:

```tsx
import { Box, Flex, Table, Text } from '@orcestr/ui/server';
```

Если компоненту нужны state, effects, browser API, обработчики событий или
overlays, используй основной entrypoint.

## Overlays

Триггеры modal и drawer должны находиться под `OrcestrUiProvider`. Общий overlay
manager координирует слои, Escape, focus и блокировку прокрутки.

- Используй `open` и `onOpenChange`, если видимостью управляет routing или бизнес-состояние.
- Используй внутреннее состояние компонента только для изолированных UI-взаимодействий.
- Обрабатывай backdrop click и Escape как запрос закрытия через `onOpenChange`.
- Задавай `portalContainer`, только если overlays должны находиться в конкретном DOM root.

## Выбор компонентов

| Задача                                   | Компонент                                          |
| ---------------------------------------- | -------------------------------------------------- |
| Переход на другой адрес                  | `Link`                                             |
| Действие на текущем экране               | `Button` или `IconButton`                          |
| Блокирующее решение или форма            | `Modal` / `Dialog`                                 |
| Дополнительная навигация на узком экране | `Drawer`                                           |
| Короткое статусное сообщение             | `Alert`                                            |
| Временное глобальное уведомление         | `useToast()`                                       |
| Удалённый пагинируемый выбор             | `PaginatedCombobox` и необязательный query-адаптер |

Не заменяй ссылки кнопками или кликабельными контейнерами. Нативная семантика —
часть accessibility-контракта.

## React Query adapter

`@orcestr/ui/react-query` не добавляет data-fetching зависимости в базовый UI
bundle:

```ts
import { usePaginatedComboboxQueryLoader } from '@orcestr/ui/react-query';
```

Query keys, API-вызовы, invalidation кеша и политика ошибок остаются
ответственностью приложения. Адаптер только связывает query state с UI state.

## Проверка локальной сборки

Собери и упакуй библиотеку, затем установи созданный архив в любое приложение:

```bash
npm run build
npm pack
npm install /path/to/orcestr-ui/orcestr-ui-<version>.tgz
```

В публикуемых manifest-файлах всегда должна оставаться registry-версия, а не
локальный путь `file:` или `link:`.
