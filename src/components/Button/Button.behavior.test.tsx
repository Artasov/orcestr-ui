import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, render, screen } = await import('@testing-library/react');
const userEvent = (await import('@testing-library/user-event')).default;

afterEach(cleanup);
after(restoreDom);

const { Button } = await import('./Button');

test('asChild composes handlers and blocks disabled link activation', async () => {
    const calls: string[] = [];
    const user = userEvent.setup();
    const { rerender } = render(
        <Button asChild onClick={() => calls.push('button')}>
            <a href="#target" onClick={() => calls.push('link')}>
                Open
            </a>
        </Button>,
    );

    await user.click(screen.getByRole('link', { name: 'Open' }));
    assert.deepEqual(calls, ['link', 'button']);

    rerender(
        <Button asChild disabled onClick={() => calls.push('disabled-button')}>
            <a href="#other" onClick={() => calls.push('disabled-link')}>
                Disabled
            </a>
        </Button>,
    );
    await user.click(screen.getByText('Disabled'));
    assert.deepEqual(calls, ['link', 'button']);
    assert.equal(screen.getByText('Disabled').getAttribute('aria-disabled'), 'true');
});
