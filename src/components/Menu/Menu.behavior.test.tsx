import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, fireEvent, render } = await import('@testing-library/react');
const { MenuContent } = await import('./Menu.js');

afterEach(cleanup);
after(restoreDom);

test('menu separators occupy their own spacing slot and do not interrupt keyboard actions', () => {
    let selected = '';
    let closed = 0;
    const view = render(
        <MenuContent
            items={[
                { key: 'copy', label: 'Copy', separatorBefore: true },
                { key: 'paste', label: 'Paste', separatorBefore: true, onSelect: () => { selected = 'paste'; } },
            ]}
            close={() => { closed++; }}
            requestConfirmation={() => {}}
        />,
    );
    const menu = view.getByRole('menu');
    const separator = view.getByRole('separator');
    assert.equal(menu.firstElementChild?.textContent, 'Copy', 'A section boundary never adds a leading separator.');
    assert.equal(separator.parentElement, menu, 'Equal list gaps surround both sides of each separator.');
    assert.equal(separator.previousElementSibling?.textContent, 'Copy');
    assert.equal(separator.nextElementSibling?.textContent, 'Paste');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    fireEvent.keyDown(menu, { key: 'Enter' });
    assert.equal(selected, 'paste');
    assert.equal(closed, 1);
});
