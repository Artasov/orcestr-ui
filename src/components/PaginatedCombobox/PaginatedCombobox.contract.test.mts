import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('selection components expose selected fallback labels', () => {
    assert.match(read('components/Combobox/Combobox.tsx'), /selectedFallbackLabel\?: ReactNode/);
    assert.match(read('components/Select/Select.tsx'), /selectedFallbackLabel\?: ReactNode/);
    assert.match(read('components/MultiSelect/MultiSelect.tsx'), /selectedFallbackLabel\?: ReactNode \| \(\(values: ReadonlyArray<V>\) => ReactNode\)/);
});

test('selection dropdown surfaces use theme page background', () => {
    const selectionStyles = read('styles/_selection.sass');
    const overlayStyles = read('styles/_overlays.sass');

    assert.match(
        selectionStyles,
        /\.oui-combobox-content,\s+\.oui-select-content[\s\S]*?background: var\(--oui-bg\)/,
    );
    assert.match(
        overlayStyles,
        /\.oui-popover-content\.oui-select-content[\s\S]*?background: var\(--oui-bg\)/,
    );
});

test('PaginatedCombobox exposes retry contract for failed page loads', () => {
    const source = read('components/PaginatedCombobox/PaginatedCombobox.tsx');
    assert.match(source, /retryLabel\?: ReactNode/);
    assert.match(source, /onClick=\{\(\) => void fetchPage\(1, debouncedSearch\)\}/);
    assert.match(source, /actualRetryLabel/);
});

test('EntityPicker forwards paginated loading error and retry labels', () => {
    const source = read('components/EntityPicker/EntityPicker.tsx');
    assert.match(source, /loadingText\?: ReactNode/);
    assert.match(source, /errorText\?: ReactNode/);
    assert.match(source, /retryLabel\?: ReactNode/);
    assert.match(source, /retryLabel=\{retryLabel\}/);
});

test('PaginatedCombobox react-query adapter stays public', () => {
    const adapterEntry = read('react-query.ts');
    assert.match(
        adapterEntry,
        /export \* from '\.\/components\/PaginatedCombobox\/PaginatedComboboxReactQueryAdapter';/,
    );
});
