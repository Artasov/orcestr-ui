import assert from 'node:assert/strict';
import {after, afterEach, test} from 'node:test';
import {setupDom} from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const {cleanup, render} = await import('@testing-library/react');
const {Tooltip} = await import('./Tooltip.js');
const {OrcestrUiProvider} = await import('../../provider/OrcestrUiProvider.js');
const measuredWidths: number[] = [];
let viewportWidth = 1024;
let clipped = false;

// No animation frames run: initial placement must finish before the first paint.
window.requestAnimationFrame = () => 1;
window.cancelAnimationFrame = () => undefined;
Object.defineProperty(window, 'innerWidth', {get: () => viewportWidth, configurable: true});
Object.defineProperty(window.HTMLElement.prototype, 'offsetWidth', {configurable: true, get() {
    if (this.getAttribute('role') !== 'tooltip') return 16;
    const width = Math.min(600, parseFloat(this.style.maxWidth) || 600);
    measuredWidths.push(width);
    return width;
}});
Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', {configurable: true, get() {
    return this.getAttribute('role') === 'tooltip' ? 80 : 20;
}});
window.HTMLElement.prototype.getBoundingClientRect = function () {
    const left = this.classList.contains('clip-cell') ? (clipped ? 0 : viewportWidth - 100) : viewportWidth - 40;
    const width = this.classList.contains('clip-cell') ? 80 : 16;
    return {x: left, y: 200, left, top: 200, right: left + width, bottom: 280, width, height: 80, toJSON: () => ({})};
};
afterEach(() => {cleanup(); measuredWidths.length = 0; viewportWidth = 1024; clipped = false;});
after(restoreDom);

function content() {
    return <OrcestrUiProvider><div className="clip-cell" style={{overflowX: 'hidden', overflowY: 'hidden'}}>
        <Tooltip open side="right" content="Long text including defect_records_without_spaces">
            <button>Info</button>
        </Tooltip>
    </div></OrcestrUiProvider>;
}

test('first visible tooltip uses viewport width and final left placement, without waiting for a frame', () => {
    render(content());
    const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')!;
    assert.equal(tooltip.style.maxWidth, '320px');
    assert.equal(tooltip.style.visibility, 'visible');
    assert.equal(tooltip.style.left, '656px');
    assert.ok(measuredWidths.length > 0);
    assert.ok(measuredWidths.every(width => width === 320));
});

test('narrow viewport constrains text before measuring and positioning', () => {
    viewportWidth = 240;
    render(content());
    const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')!;
    assert.equal(tooltip.style.maxWidth, '224px');
    assert.equal(tooltip.style.left, '8px');
    assert.ok(measuredWidths.every(width => width === 224));
});

test('a clipped trigger still hides its portalled tooltip', () => {
    clipped = true;
    render(content());
    assert.equal(document.querySelector<HTMLElement>('[role="tooltip"]')!.style.visibility, 'hidden');
});

test('a fresh opening at a different viewport does not reuse stale placement', () => {
    const first = render(content());
    first.unmount();
    viewportWidth = 600;
    render(content());
    const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')!;
    assert.equal(tooltip.style.left, '232px');
    assert.equal(tooltip.style.visibility, 'visible');
});
