import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('./SpecialModal.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../../styles/_special-modal.sass', import.meta.url), 'utf8');
const barrel = readFileSync(new URL('../../index.ts', import.meta.url), 'utf8');

test('SpecialModal is a library-owned styled modal without legacy naming', () => {
    assert.match(source, /export const SpecialModal = Object\.assign/);
    assert.match(source, /SpecialModalHeader/);
    assert.match(source, /SpecialModalBody/);
    assert.match(source, /SpecialModalFooter/);
    assert.match(source, /SpecialModalClose/);
    assert.match(styles, /\.oui-special-modal/);
    assert.match(barrel, /components\/SpecialModal\/SpecialModal/);
    for (const token of ['m' + 'st-', 'ra' + 'dix', 'data-' + 'ra' + 'dix']) {
        assert.equal(`${source}\n${styles}`.includes(token), false);
    }
});
