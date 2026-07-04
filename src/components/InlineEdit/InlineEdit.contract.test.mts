import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();

function read(path: string) {
    return readFileSync(join(root, 'src', path), 'utf8');
}

test('InlineEdit exposes busy state, action slot and multi layout', () => {
    const source = read('components/InlineEdit/InlineEdit.tsx');
    const styles = read('styles/_fields.sass');
    const index = read('index.ts');

    assert.match(index, /components\/InlineEdit\/InlineEdit/);
    assert.match(source, /busy = false/);
    assert.match(source, /ResizeObserver/);
    assert.match(source, /oui-inline-edit-compact/);
    assert.match(source, /data-col=\{col \? 'true' : undefined\}/);
    assert.match(source, /busy \? <Spinner size=\{1\} \/> : action/);
    assert.match(source, /InlineEditMultiField/);
    assert.match(source, /onOpen\?: \(\) => void/);
    assert.match(source, /data-clickable=\{onOpen && !disabled \? 'true' : undefined\}/);
    assert.match(source, /event\.key === 'Enter' \|\| event\.key === ' '/);
    assert.match(source, /className='oui-inline-edit-actions'/);
    assert.match(styles, /grid-template-areas: "label extra actions"/);
    assert.match(styles, /\.oui-inline-edit-compact[\s\S]*"label actions" "extra extra"/);
    assert.doesNotMatch(styles, /\.oui-inline-edit:hover,[\s\S]*background:/);
    assert.match(styles, /\.oui-inline-edit-label[\s\S]*text-overflow: ellipsis/);
    assert.match(styles, /\.oui-inline-edit-multi-items[\s\S]*flex-wrap: wrap/);
    assert.match(styles, /\.oui-inline-edit-multi\[data-clickable="true"\][\s\S]*cursor: pointer/);
    assert.match(styles, /data-col="true"[\s\S]*flex-direction: column/);
    assert.match(styles, /data-busy="true"[\s\S]*opacity: 1/);
});
