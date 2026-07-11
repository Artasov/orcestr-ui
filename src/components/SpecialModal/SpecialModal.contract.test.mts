import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('./SpecialModal.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../../styles/_special-modal.sass', import.meta.url), 'utf8');
const scrollAreaStyles = readFileSync(new URL('../../styles/_scroll-area.sass', import.meta.url), 'utf8');
const barrel = readFileSync(new URL('../../index.ts', import.meta.url), 'utf8');

test('SpecialModal is a library-owned styled modal', () => {
    assert.match(source, /export const SpecialModal = Object\.assign/);
    assert.match(source, /SpecialModalHeader/);
    assert.match(source, /SpecialModalBody/);
    assert.match(source, /SpecialModalFooter/);
    assert.match(source, /SpecialModalClose/);
    assert.match(source, /Omit<ComponentPropsWithoutRef<'div'>, 'title'>/);
    assert.match(styles, /overflow-x: hidden/);
    assert.match(styles, /overflow-y: auto/);
    assert.match(styles, /padding: 0 14px 12px/);
    assert.match(styles, /padding: 0 12px 10px/);
    assert.match(scrollAreaStyles, /\.oui-special-modal-body::-webkit-scrollbar/);
    assert.match(styles, /\.oui-special-modal/);
    assert.match(barrel, /components\/SpecialModal\/SpecialModal/);
});
