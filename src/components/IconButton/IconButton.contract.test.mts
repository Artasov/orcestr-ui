import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const iconButtonSource = readFileSync(new URL('./IconButton.tsx', import.meta.url), 'utf8');
const buttonStyles = readFileSync(new URL('../../styles/_buttons.sass', import.meta.url), 'utf8');

test('IconButton owns numeric badge placement', () => {
    assert.match(iconButtonSource, /badge\?: ReactNode/);
    assert.match(iconButtonSource, /badgeTone\?: ToneInput/);
    assert.match(iconButtonSource, /badgeMax\?: number/);
    assert.match(iconButtonSource, /className=["\']oui-icon-button-badge["\']/);
    assert.match(iconButtonSource, /withBadge\(children, badgeNode\)/);

    assert.match(buttonStyles, /\.oui-icon-button-badge/);
    assert.match(buttonStyles, /top: -7px/);
    assert.match(buttonStyles, /right: -10px/);
    assert.match(buttonStyles, /min-width: 17px/);
    assert.match(buttonStyles, /height: 17px/);
});
