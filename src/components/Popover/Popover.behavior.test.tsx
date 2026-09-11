import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';
import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { act, cleanup, render, waitFor } = await import('@testing-library/react');
const { OrcestrUiProvider } = await import('../../provider/OrcestrUiProvider.js');
const { Popover } = await import('./Popover.js');

afterEach(cleanup);
after(restoreDom);

test('viewport popover clears a clipped table, flips and shrinks without changing default placement', async (t) => {
    let triggerTop = 215;
    const rect = (left: number, top: number, width: number, height: number) =>
        ({ left, top, right: left + width, bottom: top + height, width, height, x: left, y: top, toJSON() {} }) as DOMRect;
    t.mock.method(HTMLElement.prototype, 'getBoundingClientRect', function (this: HTMLElement) {
        if (this.dataset.table === 'true') return rect(100, 200, 400, 60);
        if (this.classList.contains('oui-popover-trigger')) return rect(120, triggerTop, 120, 24);
        if (this.classList.contains('oui-popover-content')) {
            return rect(0, 0, 300, Math.min(280, parseFloat(this.style.maxHeight) || 280));
        }
        return rect(0, 0, 0, 0);
    });
    const originalHeight = window.innerHeight;
    const example = (fit: boolean) => <OrcestrUiProvider>
        <div data-table="true" style={{ overflowX: 'hidden', overflowY: 'auto' }}>
            <Popover open collisionBoundary={fit ? 'viewport' : undefined} avoidTriggerOverlap={fit}
                sideOffset={4} onOpenAutoFocus={(event) => event.preventDefault()}
                trigger={<button>Article</button>}>
                <div>Suggestions</div>
            </Popover>
        </div>
    </OrcestrUiProvider>;
    const view = render(example(false));
    const popup = () => document.querySelector<HTMLElement>('.oui-popover-content')!;
    try {
        await waitFor(() => assert.equal(popup().style.top, '208px'));
        assert.equal(popup().style.maxHeight, '');
        view.rerender(example(true));
        await waitFor(() => assert.equal(popup().style.top, '243px'));
        assert.ok(!document.querySelector('[collisionboundary], [avoidtriggeroverlap]'));
        Object.defineProperty(window, 'innerHeight', { configurable: true, value: 400 });
        await act(async () => window.dispatchEvent(new Event('resize')));
        await waitFor(() => assert.equal(popup().style.maxHeight, '203px'));
        assert.equal(popup().style.top, '8px');
        assert.equal(parseFloat(popup().style.top) + parseFloat(popup().style.maxHeight), triggerTop - 4);

        triggerTop = 60;
        await act(async () => document.dispatchEvent(new Event('scroll')));
        await waitFor(() => assert.equal(popup().style.top, '88px'));
        assert.equal(popup().style.maxHeight, '304px');

        view.rerender(example(false));
        await waitFor(() => assert.equal(popup().style.maxHeight, ''));
        assert.equal(popup().style.visibility, 'hidden');
    } finally {
        Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalHeight });
        view.unmount();
    }
});
