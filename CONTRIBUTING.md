# Contributing

Thanks for considering a contribution.

Orcestr UI is a public React UI library extracted from real Orcestr product work. Keep changes focused, easy to review and safe for production interfaces.

## Development

Install dependencies with npm when needed, then use the project scripts:

```bash
npm run typecheck
npm test
npm run build
npm run pack:dry-run
```

For documentation-only changes, a focused visual/readability review is enough.

## Component Changes

When changing components, keep these points explicit in the pull request:

- public API changes;
- keyboard and focus behavior;
- theme token usage;
- dark and light theme behavior;
- whether the example page needs an update;
- whether package exports or README docs need an update.

Do not edit `dist/` by hand. Change `src/`, then build.

## Pull Requests

Use a concise title and explain:

- what changed;
- why it is needed;
- how it was tested;
- screenshots or short recordings for visual changes;
- whether it affects public API, accessibility, themes or package output.
