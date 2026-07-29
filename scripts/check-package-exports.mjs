const runtimeEntrypoints = [
    '@orcestr/ui',
    '@orcestr/ui/server',
    '@orcestr/ui/react-query',
    '@orcestr/ui/example/UiExamplePage',
];

for (const entrypoint of runtimeEntrypoints) {
    await import(entrypoint);
}

console.log(`Verified ${runtimeEntrypoints.length} Node ESM package entrypoints.`);
