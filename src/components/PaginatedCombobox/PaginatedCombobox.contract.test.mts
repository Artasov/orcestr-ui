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

test('all selection inputs expose the shared floating label mode', () => {
    for (const path of [
        'components/Select/Select.tsx',
        'components/Combobox/Combobox.tsx',
        'components/MultiSelect/MultiSelect.tsx',
        'components/PaginatedCombobox/PaginatedCombobox.tsx',
        'components/EntityPicker/EntityPicker.tsx',
    ]) {
        assert.match(read(path), /floatingLabel\?: ReactNode/);
    }
    assert.match(
        read('components/EntityPicker/EntityPicker.tsx'),
        /floatingLabel=\{floatingLabel\}/,
    );
});

test('floating selection fields render only the shared outlined border', () => {
    const styles = read('styles/_selection.sass');
    const ordinaryStateIndex = styles.indexOf(
        '.oui-button.oui-combobox-trigger[data-state="open"]',
    );
    const floatingOverrideIndex = styles.indexOf(
        '.oui-button.oui-combobox-trigger.oui-floating-field,',
    );

    assert.ok(ordinaryStateIndex >= 0);
    assert.ok(floatingOverrideIndex > ordinaryStateIndex);
    assert.match(
        styles.slice(floatingOverrideIndex),
        /\.oui-button\.oui-combobox-trigger\.oui-floating-field,[\s\S]*?border-color: transparent[\s\S]*?box-shadow: none/,
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
    assert.match(barrel, /export \* from '\.\/components\/BadgeSelectMenu\/BadgeSelectMenu\.js';/);
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
        /export \* from '\.\/components\/PaginatedCombobox\/PaginatedComboboxReactQueryAdapter\.js';/,
    );
    assert.match(adapterSource, /queryKey: TQueryKey \| \(\(params:/);
    assert.match(adapterSource, /const optionsRef = useRef/);
    assert.match(adapterSource, /\[queryClient\]/);
    assert.match(adapterSource, /export function ReactQueryPaginatedCombobox<T>/);
    assert.match(adapterSource, /ReactQueryPaginatedCombobox as PaginatedCombobox/);
    assert.match(adapterSource, /requestedPageSize \?\? null/);
    assert.match(adapterSource, /queryFn: \(\{ signal \}\)/);
    assert.match(adapterSource, /loadPage\(page, search, \{ signal, pageSize:/);
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

test('selection controls share the compact search row', () => {
    const source = read('components/PaginatedCombobox/PaginatedCombobox.tsx');
    const styles = read('styles/_selection.sass');

    assert.match(source, /oui-paginated-combobox-search-wrap/);
    assert.match(source, /<TextField[\s\S]*?size=\{1\}/);
    assert.match(source, /const handleOpenChange = useCallback/);
    assert.match(source, /onOpenChange=\{handleOpenChange\}/);
    assert.match(styles, /\.oui-combobox-search-wrap[\s\S]*?min-height: 28px/);
    assert.match(styles, /\.oui-combobox-search-wrap[\s\S]*?padding: 0 4px 3px/);
});

test('PaginatedCombobox exposes opt-in search autofocus', () => {
    const source = read('components/PaginatedCombobox/PaginatedCombobox.tsx');
    const entityPickerSource = read('components/EntityPicker/EntityPicker.tsx');

    assert.match(source, /autoFocusSearch\?: boolean/);
    assert.match(source, /autoFocusSearch = false/);
    assert.match(source, /const setSearchInputRef = useCallback/);
    assert.match(source, /node\.focus\(\{ preventScroll: true \}\)/);
    assert.match(source, /ref=\{setSearchInputRef\}/);
    assert.match(entityPickerSource, /autoFocusSearch\?: boolean/);
    assert.match(entityPickerSource, /autoFocusSearch=\{autoFocusSearch\}/);
});

test('MultiSelect exposes an optional searchable list', () => {
    const source = read('components/MultiSelect/MultiSelect.tsx');

    assert.match(source, /searchable\?: boolean/);
    assert.match(source, /searchPlaceholder\?: string/);
    assert.match(source, /filteredItems/);
    assert.match(source, /aria-autocomplete="list"/);
});

test('PaginatedCombobox keeps loader identity and touch scrolling stable', () => {
    const source = read('components/PaginatedCombobox/PaginatedCombobox.tsx');
    const styles = read('styles/_selection.sass');

    assert.match(source, /const loadPageRef = useRef\(loadPage\)/);
    assert.match(source, /loadPageRef\.current\(page, search/);
    assert.match(source, /\{ root: scrollRef\.current, threshold: 0\.1 \}/);
    assert.match(styles, /\.oui-combobox-scroll[\s\S]*?touch-action: pan-y/);
});
