import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('ConfirmDialog is exported through the public Orcestr UI barrel', () => {
    const barrel = read('index.ts');
    assert.match(barrel, /export \* from '\.\/components\/ConfirmDialog\/ConfirmDialog';/);
});

test('ConfirmDialog is built on Orcestr primitives only', () => {
    const source = read('components/ConfirmDialog/ConfirmDialog.tsx');
    assert.match(source, /from '\.\.\/Modal\/Modal'/);
    assert.match(source, /from '\.\.\/Button\/Button'/);
    assert.doesNotMatch(source, /@\/modules\/|mst-|rt-|window\.confirm/);
});

test('ActionConfirmModal delegates to public ConfirmDialog', () => {
    const source = read('components/Action/ActionConfirmModal.tsx');
    assert.match(source, /from '\.\.\/ConfirmDialog\/ConfirmDialog'/);
    assert.match(source, /<ConfirmDialog/);
    assert.doesNotMatch(source, /window\.confirm|<Modal|<Button/);
});
