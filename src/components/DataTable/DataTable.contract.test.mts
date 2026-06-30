import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('DataTable column resize does not call controlled handlers inside setState updater', () => {
    const source = read('components/DataTable/DataTable.tsx');
    const setColumnWidthsUpdaterCalls = [
        ...source.matchAll(/setColumnWidths\(\(current\)[\s\S]*?\}\)\);/g),
    ].map((match) => match[0]);

    assert.ok(setColumnWidthsUpdaterCalls.length > 0);
    for (const call of setColumnWidthsUpdaterCalls) {
        assert.doesNotMatch(call, /onColumnWidthsChange/);
    }
    assert.match(source, /columnSettings\.onColumnWidthsChange\(\{/);
});

test('DataTable settings and pinned cells use shared UI primitives', () => {
    const source = read('components/DataTable/DataTable.tsx');
    const styles = read('styles/_data.sass');

    assert.match(source, /toolbar\?: ReactNode/);
    assert.match(source, /horizontalScrollTargetRef/);
    assert.match(source, /const cancelHorizontalScrollAnimation = useCallback/);
    assert.match(source, /window\.requestAnimationFrame\(tick\)/);
    assert.match(source, /normalizeWheelDelta\(event, node\)/);
    assert.match(source, /onPointerDown=\{cancelHorizontalScrollAnimation\}/);
    assert.match(source, /onMouseDown=\{cancelHorizontalScrollAnimation\}/);
    assert.match(source, /useEffect\(\(\) => \(\) => cancelHorizontalScrollAnimation\(\), \[cancelHorizontalScrollAnimation\]\)/);
    assert.doesNotMatch(source, /node\.scrollLeft \+= event\.deltaY/);
    assert.match(source, /className='oui-data-table-sort-label'/);
    assert.match(source, /\{toolbar \|\| columnSettings \? \([\s\S]*?<div className='oui-data-table-toolbar'>[\s\S]*?oui-data-table-toolbar-content[\s\S]*?<ColumnSettingsPanel/);
    assert.match(styles, /\.oui-data-table-toolbar\s+display: flex[\s\S]*?align-items: stretch[\s\S]*?gap: 8px/);
    assert.match(styles, /\.oui-data-table-toolbar-content\s+display: flex[\s\S]*?flex: 1 1 auto/);
    assert.match(styles, /\.oui-data-table th,[\s\S]*?\.oui-data-table td\s+padding:[\s\S]*?vertical-align: middle/);
    assert.match(styles, /\.oui-data-table-wrap:focus,[\s\S]*?\.oui-data-table-wrap:focus-visible\s+outline: none/);
    assert.match(styles, /\.oui-data-table-sort-label\s+display: inline-flex[\s\S]*?transition: background-color 180ms ease, color 180ms ease, box-shadow 180ms ease/);
    assert.match(styles, /\.oui-data-table-sort:hover \.oui-data-table-sort-label\s+background:/);
    assert.doesNotMatch(styles, /\.oui-data-table-sort:hover\s+background:/);
    assert.match(styles, /\.oui-data-table-select-cell\s+width: 42px[\s\S]*?padding-inline: 0 !important[\s\S]*?text-align: center/);
    assert.equal((source.match(/className='oui-data-table-select-control'/g) ?? []).length, 2);
    assert.match(styles, /\.oui-data-table-select-control\s+display: inline-flex[\s\S]*?width: 100%[\s\S]*?justify-content: center/);
    assert.match(styles, /\.oui-data-table-select-cell \.oui-checkbox\s+justify-content: center/);
    assert.doesNotMatch(styles, /\.oui-data-table-select-cell \.oui-checkbox[\s\S]*?margin-inline: auto/);
    assert.match(source, /<Button\s+className='oui-data-table-settings-reset'[\s\S]*?size=\{1\}[\s\S]*?v='ghost'[\s\S]*?leftIcon=\{<LuRotateCcw size=\{13\} \/>\}/);
    assert.doesNotMatch(source, /<button\s+type='button'\s+className='oui-data-table-settings-reset'/);
    assert.match(styles, /\.oui-data-table-wrap\s+--oui-data-table-row-base-bg:/);
    assert.match(styles, /\.oui-data-table tbody tr\s+--oui-data-table-row-bg: var\(--oui-data-table-row-base-bg\)/);
    assert.match(styles, /\.oui-data-table td\[data-pinned="left"\],[\s\S]*?background: linear-gradient\(var\(--oui-data-table-row-bg\), var\(--oui-data-table-row-bg\)\), var\(--oui-data-table-row-base-bg\)/);
    assert.match(styles, /\.oui-data-table td\.oui-data-table-expand-cell,[\s\S]*?background: linear-gradient\(var\(--oui-data-table-row-bg\), var\(--oui-data-table-row-bg\)\), var\(--oui-data-table-row-base-bg\)/);
    assert.match(styles, /\.oui-data-table tbody tr\[data-selected="true"\]\s+--oui-data-table-row-bg: var\(--oui-selected-bg\)[\s\S]*?background: linear-gradient\(var\(--oui-data-table-row-bg\), var\(--oui-data-table-row-bg\)\), var\(--oui-data-table-row-base-bg\)/);
    assert.match(styles, /\.oui-data-table-settings-reset\s+flex: 0 0 auto/);
    assert.doesNotMatch(styles, /\.oui-data-table-settings-reset:hover/);
    assert.match(styles, /\.oui-data-table-column-settings-row\s+display: flex[\s\S]*?padding: 6px 8px/);
});
