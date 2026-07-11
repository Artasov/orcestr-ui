import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('selection components expose selected fallback labels', () => {
    assert.match(read('components/Combobox/Combobox.tsx'), /selectedFallbackLabel\?: ReactNode/);
    assert.match(read('components/Select/Select.tsx'), /selectedFallbackLabel\?: ReactNode/);
    assert.match(
        read('components/MultiSelect/MultiSelect.tsx'),
        /selectedFallbackLabel\?: ReactNode \| \(\(values: ReadonlyArray<V>\) => ReactNode\)/,
    );
});

test('selection dropdown surfaces use themed floating background', () => {
    const selectionStyles = read('styles/_selection.sass');
    const overlayStyles = read('styles/_overlays.sass');

    assert.match(
        selectionStyles,
        /\.oui-combobox-content,\s+\.oui-select-content[\s\S]*?--oui-selection-content-text: var\(--oui-text, #202020\)[\s\S]*?--oui-selection-content-bg: var\(--oui-floating-bg, var\(--oui-bg, #ffffff\)\)/,
    );
    assert.match(
        overlayStyles,
        /\.oui-popover-content\.oui-select-content[\s\S]*?color: var\(--oui-selection-content-text, var\(--oui-text, #202020\)\)[\s\S]*?background: var\(--oui-selection-content-bg, var\(--oui-floating-bg, var\(--oui-bg, #ffffff\)\)\)/,
    );
    assert.match(
        selectionStyles,
        /--oui-selection-option-hover-bg: var\(--oui-pad-hover-bg, color-mix\(in srgb, var\(--oui-selection-content-text\) 8%, transparent\)\)/,
    );
    assert.match(
        selectionStyles,
        /--oui-selection-option-selected-bg: var\(--oui-selected-bg, color-mix\(in srgb, var\(--oui-selection-content-text\) 10%, transparent\)\)/,
    );
    assert.match(
        selectionStyles,
        /--oui-selection-option-selected-hover-bg: color-mix\(in srgb, var\(--oui-selection-option-selected-bg\) 76%, var\(--oui-selection-option-hover-bg\)\)/,
    );
    assert.doesNotMatch(selectionStyles, /\.oui-combobox-content\[data-oui-theme="light"\]/);
    assert.doesNotMatch(selectionStyles, /\.oui-combobox-content\[data-oui-theme="dark"\]/);
    assert.doesNotMatch(selectionStyles, /--oui-selection-option-selected-bg: #008ff519/);
    assert.doesNotMatch(selectionStyles, /--oui-selection-option-selected-bg: #0077ff3a/);
    assert.match(
        selectionStyles,
        /\.oui-button\.oui-combobox-trigger\s+background-color: var\(--oui-control-bg, transparent\)[\s\S]*?border-color: var\(--oui-field-border-color, var\(--oui-border\)\)/,
    );
    assert.match(
        selectionStyles,
        /\.oui-button\.oui-combobox-trigger:not\(:disabled\):hover\s+background-color: var\(--oui-control-bg, transparent\)[\s\S]*?border-color: var\(--oui-field-border-hover-color, var\(--oui-border-strong\)\)/,
    );
    assert.match(
        overlayStyles,
        /\.oui-popover-content\.oui-select-content[\s\S]*?background: var\(--oui-selection-content-bg, var\(--oui-floating-bg, var\(--oui-bg, #ffffff\)\)\)/,
    );
    assert.doesNotMatch(
        overlayStyles,
        /oui-popover-content\.oui-select-content \.oui-combobox-option\[data-selected="true"\]/,
    );
    assert.doesNotMatch(
        overlayStyles,
        /oui-popover-content\.oui-select-content \.oui-combobox-check/,
    );
    assert.match(
        selectionStyles,
        /\.oui-combobox-option,[\s\S]*?color: var\(--oui-selection-content-text, var\(--oui-text, #202020\)\)/,
    );
    assert.match(
        selectionStyles,
        /\.oui-combobox-check\s+flex:[\s\S]*?color: var\(--oui-selection-check-color\)/,
    );
});

test('BadgeSelectMenu uses the shared selection dropdown surface', () => {
    const source = read('components/BadgeSelectMenu/BadgeSelectMenu.tsx');
    const barrel = read('index.ts');

    assert.match(source, /export type BadgeSelectItem/);
    assert.match(source, /export function BadgeSelectMenu/);
    assert.match(source, /className=["\']oui-combobox-option oui-badge-select-option["\']/);
    assert.match(barrel, /export \* from '\.\/components\/BadgeSelectMenu\/BadgeSelectMenu';/);
});

test('PaginatedCombobox exposes retry contract for failed page loads', () => {
    const source = read('components/PaginatedCombobox/PaginatedCombobox.tsx');
    assert.match(source, /trigger\?: ReactNode/);
    assert.match(source, /trigger \?\? \(/);
    assert.match(source, /retryLabel\?: ReactNode/);
    assert.match(source, /onClick=\{\(\) => void fetchPage\(1, debouncedSearch\)\}/);
    assert.match(source, /actualRetryLabel/);
});

test('EntityPicker forwards paginated loading error and retry labels', () => {
    const source = read('components/EntityPicker/EntityPicker.tsx');
    assert.match(source, /loadingText\?: ReactNode/);
    assert.match(source, /errorText\?: ReactNode/);
    assert.match(source, /retryLabel\?: ReactNode/);
    assert.match(source, /trigger\?: ReactNode/);
    assert.match(source, /trigger=\{trigger\}/);
    assert.match(source, /retryLabel=\{retryLabel\}/);
});

test('PaginatedCombobox react-query adapter stays public', () => {
    const adapterEntry = read('react-query.ts');
    const adapterSource = read(
        'components/PaginatedCombobox/PaginatedComboboxReactQueryAdapter.tsx',
    );
    assert.match(
        adapterEntry,
        /export \* from '\.\/components\/PaginatedCombobox\/PaginatedComboboxReactQueryAdapter';/,
    );
    assert.match(adapterSource, /queryKey: TQueryKey \| \(\(params:/);
    assert.match(adapterSource, /const optionsRef = useRef/);
    assert.match(adapterSource, /\[queryClient\]/);
    assert.match(adapterSource, /export function ReactQueryPaginatedCombobox<T>/);
    assert.match(adapterSource, /ReactQueryPaginatedCombobox as PaginatedCombobox/);
    assert.match(adapterSource, /pageSize \?\? null/);
});

test('PaginatedCombobox and EntityPicker share the public option action contract', () => {
    const comboboxSource = read('components/PaginatedCombobox/PaginatedCombobox.tsx');
    const entityPickerSource = read('components/EntityPicker/EntityPicker.tsx');

    assert.match(comboboxSource, /export type PaginatedComboboxOptionAction<T>/);
    assert.match(comboboxSource, /optionAction\?: PaginatedComboboxOptionAction<T>/);
    assert.match(
        entityPickerSource,
        /export type EntityPickerOptionAction<T> = PaginatedComboboxOptionAction<T>/,
    );
});
