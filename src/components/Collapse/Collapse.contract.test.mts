import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('Collapse animates without layout measurement loops', () => {
    const source = read('components/Collapse/Collapse.tsx');
    const styles = read('styles/_selection.sass');

    assert.match(source, /gridTemplateRows: open \? '1fr' : '0fr'/);
    assert.match(source, /grid-template-rows 220ms/);
    assert.doesNotMatch(source, /ResizeObserver|useLayoutEffect|scrollHeight|setContentHeight|height: open/);
    assert.match(styles, /\.oui-collapse\s+display: grid[\s\S]*?overflow: hidden/);
    assert.match(styles, /\.oui-collapse-content\s+overflow: hidden/);
});
