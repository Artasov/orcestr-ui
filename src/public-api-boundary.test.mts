import assert from 'node:assert/strict';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, relative, sep} from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';

const sourceRoot = fileURLToPath(new URL('.', import.meta.url));
const packageRoot = fileURLToPath(new URL('..', import.meta.url));
const sourceExtensions = new Set(['.ts', '.tsx', '.sass']);

test('package manifest exposes runtime, styles, demo and optional adapters explicitly', () => {
    const manifest = readFileSync(join(packageRoot, 'package.json'), 'utf8');

    assert.match(manifest, /"name": "@orcestr\/ui"/);
    assert.match(manifest, /"\.\/styles\.css": "\.\/dist\/styles\/orcestr-ui\.css"/);
    assert.match(manifest, /"\.\/example\/styles\.css": "\.\/dist\/example\/styles\.css"/);
    assert.match(manifest, /"\.\/react-query": \{/);
    assert.match(manifest, /"@tanstack\/react-query": \{\s+"optional": true\s+\}/);
});

test('main public barrel excludes demo, legacy bridges and optional adapters', () => {
    const barrel = readFileSync(join(sourceRoot, 'index.ts'), 'utf8');

    assert.match(barrel, /^'use client';/);
    assert.doesNotMatch(barrel, /example\//);
    assert.doesNotMatch(barrel, /ToastBridge/);
    assert.doesNotMatch(barrel, /PaginatedComboboxReactQueryAdapter/);
});

test('Orcestr UI sources stay independent from app modules and legacy UI selectors', () => {
    const banned = [
        {name: 'app alias imports', pattern: /@\/(?:app|modules|shared)\//},
        {name: 'legacy mst classes', pattern: /(?:className=['"][^'"]*\bmst-|\.mst-|--mst-)/},
    ];
    const violations = sourceFiles(['components', 'hooks', 'locale', 'provider', 'styles', 'theme', 'utils'])
        .flatMap((file) => {
            const source = readFileSync(file, 'utf8');
            return banned
                .filter(({pattern}) => pattern.test(source))
                .map(({name}) => `${relativePath(file)}: ${name}`);
        });

    assert.deepEqual(violations, []);
});

test('Orcestr UI keeps runtime and example styles split', () => {
    const styleIndex = readFileSync(join(sourceRoot, 'styles/orcestr-ui.sass'), 'utf8');
    const exampleStyles = readFileSync(join(sourceRoot, 'example/styles.sass'), 'utf8');
    const dataStyles = readFileSync(join(sourceRoot, 'styles/_data.sass'), 'utf8');
    const shellStyles = readFileSync(join(sourceRoot, 'styles/_shell.sass'), 'utf8');
    const stateStyles = readFileSync(join(sourceRoot, 'styles/_state.sass'), 'utf8');
    const styleUses = [...styleIndex.matchAll(/@use '\.\/([^']+)'/g)]
        .map((match) => match[1].replace(/^_/, '').replace(/\.sass$/, ''));
    const emptyComponentDirs = readdirSync(join(sourceRoot, 'components'))
        .map((entry) => join(sourceRoot, 'components', entry))
        .filter((path) => statSync(path).isDirectory())
        .filter((path) => sourceFiles([relative(sourceRoot, path)]).length === 0)
        .map((path) => relative(sourceRoot, path));

    assert.deepEqual(styleUses, [
        'theme',
        'shell',
        'buttons',
        'badge',
        'fields',
        'icon-text',
        'state',
        'alert',
        'selection',
        'overlays',
        'drawer',
        'data',
        'scroll-area',
        'highlight',
        'separator',
        'spinner',
        'skeleton',
        'visually-hidden',
        'workflow',
        'animations',
    ]);
    assert.match(exampleStyles, /@use '\.\.\/styles\/_example\.sass'/);
    assert.deepEqual(emptyComponentDirs, []);
    assert.doesNotMatch(dataStyles, /oui-scroll-area|oui-highlight|oui-separator|oui-spinner|oui-skeleton|oui-visually-hidden/);
    assert.doesNotMatch(shellStyles, /oui-workflow|oui-pipeline|oui-lifecycle|oui-timeline|oui-status-badge/);
    assert.doesNotMatch(stateStyles, /oui-icon-text|oui-alert|oui-badge/);
});

function sourceFiles(dirs: string[]): string[] {
    return dirs.flatMap((dir) => walk(join(sourceRoot, dir)));
}

function walk(path: string): string[] {
    const stat = statSync(path);
    if (stat.isFile()) {
        return sourceExtensions.has(extension(path)) ? [path] : [];
    }
    if (!stat.isDirectory()) return [];
    return readdirSync(path).flatMap((entry) => walk(join(path, entry)));
}

function relativePath(path: string): string {
    return relative(sourceRoot, path).split(sep).join('/');
}

function extension(path: string): string {
    const dotIndex = path.lastIndexOf('.');
    return dotIndex === -1 ? '' : path.slice(dotIndex);
}
