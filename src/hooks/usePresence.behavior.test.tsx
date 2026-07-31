import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';
import { StrictMode } from 'react';

import { setupDom } from '../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, render, screen, waitFor } = await import('@testing-library/react');

afterEach(cleanup);
after(restoreDom);

const { usePresence } = await import('./usePresence.js');

function Harness({ open }: { open: boolean }) {
    const presence = usePresence(open, 1);
    return (
        <div
            data-testid="presence"
            data-present={presence.present ? 'true' : 'false'}
            data-state={presence.state}
        />
    );
}

test('an initially open presence still runs its entrance state in StrictMode', async () => {
    render(
        <StrictMode>
            <Harness open />
        </StrictMode>,
    );

    const presence = screen.getByTestId('presence');
    assert.equal(presence.dataset.present, 'true');
    assert.equal(presence.dataset.state, 'opening');
    await waitFor(() => assert.equal(presence.dataset.state, 'open'));
});
