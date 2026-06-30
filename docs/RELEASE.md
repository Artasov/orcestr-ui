# Release @orcestr/ui

Эта инструкция описывает нормальный release-flow для `@orcestr/ui`.

Публикация в NPM делается автоматически через GitHub Actions после push тега формата `ui-vX.Y.Z`. Вручную `npm publish` локально не запускаем, кроме аварийного восстановления.

## Что должно быть настроено один раз

- Репозиторий: `Artasov/orcestr-ui`.
- Workflow: `.github/workflows/release.yml`.
- NPM package: `@orcestr/ui`.
- В NPM должен быть настроен Trusted Publishing для GitHub Actions workflow `release.yml`.

Текущий workflow использует `id-token: write`, поэтому `NPM_TOKEN` не нужен, если Trusted Publishing настроен корректно.

## Перед релизом

1. Убедись, что изменения готовы и закоммичены.

```powershell
git status --short
```

Release-helper требует чистый worktree. Если есть незакоммиченные изменения, сначала закоммить их или отложи.

2. Запусти проверки, которые соответствуют изменению.

Минимальный набор перед релизом:

```powershell
npm run typecheck
npm test
npm run build
npm run pack:dry-run
```

Что проверяют команды:

- `npm run typecheck` - TypeScript без emit.
- `npm test` - contract/state tests.
- `npm run build` - собирает `dist` JavaScript, declarations и CSS.
- `npm run pack:dry-run` - показывает, что реально попадет в NPM package.

## Первый релиз 0.0.1

Для первого публичного релиза версия уже должна быть выставлена как `0.0.1` в `package.json` и `package-lock.json`.

После commit с готовым состоянием создай и запушь тег текущей версии:

```powershell
git tag ui-v0.0.1
git push origin ui-v0.0.1
```

После push тега CI автоматически запустит публикацию.

## Следующие релизы

Выбери тип semver bump:

- `patch` - исправления без изменения API.
- `minor` - новый совместимый API или новые компоненты.
- `major` - breaking changes.

Запусти один из helper-скриптов:

```powershell
npm run release:patch
npm run release:minor
npm run release:major
```

Скрипт делает следующее:

1. Проверяет, что git worktree чистый.
2. Проверяет, что tag еще не существует.
3. Поднимает версию в `package.json`.
4. Поднимает версию в `package-lock.json`.
5. Запускает `npm install --package-lock-only`, чтобы lockfile был консистентным.
6. Создает commit вида `chore: release @orcestr/ui ui-v0.1.1`.
7. Создает локальный tag вида `ui-v0.1.1`.

Пример:

```powershell
npm run release:patch
```

Если текущая версия `0.0.1`, `npm run release:patch` создаст tag `ui-v0.0.2`.

## Push релиза

После release-helper push commit и tag:

```powershell
git push
git push origin ui-v0.0.2
```

Можно сразу создать и запушить релиз одной командой:

```powershell
node scripts/release.mjs patch --push
```

Но обычный способ через `.run` и ручной push удобнее: перед публикацией можно глазами проверить commit и tag.

## Что делает CI

После push тега `ui-vX.Y.Z` запускается `.github/workflows/release.yml`.

Job `quality-checks` запускается на Node `20` и `22`:

```text
npm ci
npm run typecheck
npm test
npm run build
npm run pack:dry-run
```

Job `publish` запускается только для tag refs `refs/tags/ui-v*`:

1. Ставит зависимости через `npm ci`.
2. Проверяет, что версия в `package.json` равна версии из тега.
3. Собирает пакет через `npm run build`.
4. Публикует `@orcestr/ui` в NPM:

```bash
npm publish --access public
```

Если tag `ui-v0.0.1`, то `package.json` обязан содержать `"version": "0.0.1"`. Иначе workflow упадет до публикации.

## После публикации

1. Проверь package page в NPM.
2. В продуктовых репозиториях обнови зависимость `@orcestr/ui` до новой версии.
3. Для основного Orcestr repo обнови `frontend/package.json` и `frontend/package-lock.json`.
4. Если локально нужно снова работать с соседним checkout `../orcestr-ui`, используй в основном проекте:

```powershell
cd F:\dev\orcestr\frontend
npm run ui:local
```

## Если релиз упал

- Если упали `typecheck`, `test`, `build` или `pack:dry-run`, исправь код отдельным commit, затем создай новый release tag с новой версией.
- Не переиспользуй уже запушенный tag для другого содержимого.
- Если ошибка только в NPM Trusted Publishing, исправь настройки NPM/GitHub и перезапусти workflow для того же тега через GitHub Actions.
- Если версия в `package.json` не совпала с тегом, не публикуй вручную. Создай новый корректный release commit/tag.

## IDE run configurations

В `.run` есть готовые команды:

- `release patch`
- `release minor`
- `release major`
- `typecheck`
- `test`
- `build`
- `pack dry-run`
- `clean dist`

Release run configurations создают только локальный commit и tag. Публикация начнется после push тега.
