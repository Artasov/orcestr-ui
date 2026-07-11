import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';

import { setupDom } from '../test-utils/dom.mts';

const restoreDom = setupDom();
const { act, cleanup, renderHook } = await import('@testing-library/react');

afterEach(cleanup);
after(restoreDom);

const { useControllableState } = await import('./useControllableState');

test('controllable setter is stable and chains functional updates from the latest value', () => {
    const { result } = renderHook(() =>
        useControllableState({ value: undefined, defaultValue: 0 }),
    );
    const setter = result.current[1];

    act(() => {
        setter((current) => current + 1);
        setter((current) => current + 1);
    });

    assert.equal(result.current[0], 2);
    assert.equal(result.current[1], setter);
});
