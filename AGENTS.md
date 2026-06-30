# AGENTS.md

Инструкции для агентов, работающих с `F:\dev\orcestr-ui`.

Отвечай на русском, коротко и по делу. Сохраняй текстовые файлы в UTF-8 без BOM.

## Что это за проект

`@orcestr/ui` - shared React UI-библиотека для продуктов Orcestr.

Библиотека выделяется из реальной продуктовой разработки и используется в основном проекте `F:\dev\orcestr`. Это не витринная дизайн-система, а практический UI kit для операционного софта: dashboards, catalogs, workflows, approvals, forms, overlays, tables, state views, app shell и workflow primitives.

## Структура

- `src/index.ts` - главный public API entrypoint `@orcestr/ui`.
- `src/react-query.ts` - optional entrypoint `@orcestr/ui/react-query`.
- `src/example/UiExamplePage.tsx` - demo entrypoint `@orcestr/ui/example/UiExamplePage`.
- `src/components/*` - компоненты.
- `src/hooks/*` - hooks.
- `src/provider/*` - providers.
- `src/theme/*` - theme API и tokens.
- `src/locale/*` - locale/i18n primitives.
- `src/styles/*` - SASS/CSS source styles.
- `dist/` - generated build output. Не редактировать руками.
- `docs/RELEASE.md` - release-flow.
- `.github/workflows/release.yml` - CI/CD публикации в NPM.
- `.run/` - удобные IDE-команды.

## Технический стек

- TypeScript strict mode.
- React 19.
- CSS/SASS styles.
- Node built-in test runner для `*.test.mts`.
- Build через `tsc -p tsconfig.build.json` и `sass`.
- Package manager: npm с `package-lock.json`.

## Правила разработки

- Не редактируй `dist/` вручную. Меняй `src/`, затем собирай.
- Не добавляй runtime dependencies без явной причины. Для React ecosystem предпочитай `peerDependencies`.
- Не ломай public API без осознанного major release.
- Если добавляешь public component/hook/type, экспортируй его из нужного public entrypoint.
- Если добавляешь новый package entrypoint, обнови `package.json` `exports`, README и release/package docs.
- Стили библиотеки держи в `src/styles` или рядом с компонентом, если такой паттерн уже есть.
- Example/demo code не должен становиться обязательной runtime-зависимостью main entrypoint.
- Избегай больших универсальных компонентов, если проще выделить маленькие composable primitives.
- Не запускай `npm ci` без необходимости: это долго и переписывает локальное окружение. Для обычной проверки используй точечные npm scripts.

## Проверки

Перед завершением изменения выбери проверки по риску:

```powershell
npm run typecheck
npm test
npm run build
npm run pack:dry-run
```

Для документации достаточно проверить Markdown глазами, JSON validity и `git diff --check`.

Полный минимальный набор перед релизом:

```powershell
npm run typecheck
npm test
npm run build
npm run pack:dry-run
```

## Локальная интеграция с основным Orcestr

Основной проект лежит рядом:

```text
F:\dev\orcestr
F:\dev\orcestr-ui
```

В `F:\dev\orcestr\frontend` есть helper:

```powershell
npm run ui:local
```

Он ставит локальный `@orcestr/ui` из `../../orcestr-ui` в `node_modules`, не переписывая `package.json` и `package-lock.json` основного проекта.

Для обычной установки и деплоя основной проект должен использовать NPM-версию `@orcestr/ui`, а не `file:../../orcestr-ui`.

## Release-flow

Релиз описан подробно в `docs/RELEASE.md`.

Коротко:

1. Все обычные изменения должны быть уже закоммичены.
2. Worktree должен быть чистым.
3. Запусти проверки:

```powershell
npm run typecheck
npm test
npm run build
npm run pack:dry-run
```

4. Создай release commit и tag:

```powershell
npm run release:patch
```

или:

```powershell
npm run release:minor
npm run release:major
```

5. Push commit и tag:

```powershell
git push
git push origin ui-v0.0.2
```

6. GitHub Actions автоматически запустит `.github/workflows/release.yml` и опубликует пакет в NPM.

Для первого релиза `0.0.1` release-helper не нужен: после commit готового состояния создай tag `ui-v0.0.1` и запушь его.

Не запускай `npm publish` локально, если пользователь явно не просит аварийное ручное восстановление.

## CI/CD

Workflow публикации:

```text
.github/workflows/release.yml
```

Триггер:

```text
push tag ui-v*
```

CI проверяет:

- `npm ci`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run pack:dry-run`
- совпадение версии `package.json` с tag version

Затем публикует:

```bash
npm publish --access public
```

Workflow рассчитан на NPM Trusted Publishing через GitHub OIDC (`id-token: write`). Если публикация падает на auth, проверяй настройки Trusted Publishing в NPM package.

## Git

- Не откатывай чужие незакоммиченные изменения.
- Не делай `git reset --hard` и не удаляй пользовательские файлы.
- Release-helper сам создает release commit и tag, но только при чистом worktree.
- Если в worktree есть чужие изменения, сначала покажи их пользователю или работай только в своей зоне.
