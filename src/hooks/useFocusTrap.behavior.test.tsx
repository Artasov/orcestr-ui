import assert from 'node:assert/strict';
import {after, afterEach, test} from 'node:test';
import {setupDom} from '../test-utils/dom.mts';

const restoreDom = setupDom();
const {cleanup, fireEvent, render, screen} = await import('@testing-library/react');
const {useRef} = await import('react');
const {OrcestrUiProvider} = await import('../provider/OrcestrUiProvider.js');
const {useFocusTrap} = await import('./useFocusTrap.js');
afterEach(cleanup);
after(restoreDom);

function Trap({close, editor = false}: {close: () => void; editor?: boolean}) {
    const ref = useRef<HTMLDivElement>(null);
    useFocusTrap(ref, true, {onEscape: close});
    return <div ref={ref}><input aria-label='Title' onKeyDown={editor ? (event) => {
        if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation();}
    } : undefined} /><button>Last action</button></div>;
}

test('an editor can consume Escape without closing its containing focus layer', () => {
    let closed = 0;
    const view = render(<OrcestrUiProvider><Trap close={() => closed++} editor /></OrcestrUiProvider>);
    fireEvent.keyDown(screen.getByRole('textbox'), {key: 'Escape', bubbles: true, cancelable: true});
    assert.equal(closed, 0);
    view.rerender(<OrcestrUiProvider><Trap close={() => closed++} /></OrcestrUiProvider>);
    fireEvent.keyDown(screen.getByRole('textbox'), {key: 'Escape', bubbles: true, cancelable: true});
    assert.equal(closed, 1);
});

test('a document keyboard sensor can cancel a drag before Escape dismisses the overlay', () => {
    let closed = 0, cancelled = 0;
    render(<OrcestrUiProvider><Trap close={() => closed++} /></OrcestrUiProvider>);
    const sensor = (event: KeyboardEvent) => {if (event.key === 'Escape') {event.preventDefault(); cancelled++;}};
    document.addEventListener('keydown', sensor);
    try {
        fireEvent.keyDown(screen.getByRole('textbox'), {key: 'Escape', bubbles: true, cancelable: true});
        assert.equal(cancelled, 1); assert.equal(closed, 0);
    } finally {document.removeEventListener('keydown', sensor);}
    fireEvent.keyDown(screen.getByRole('textbox'), {key: 'Escape', bubbles: true, cancelable: true});
    assert.equal(closed, 1);
});

test('Tab still wraps focus even when a child stops keyboard bubbling', () => {
    render(<OrcestrUiProvider><Trap close={() => {}} /></OrcestrUiProvider>);
    const last = screen.getByRole('button'); last.focus();
    last.addEventListener('keydown', (event) => event.stopPropagation());
    fireEvent.keyDown(last, {key: 'Tab', bubbles: true, cancelable: true});
    assert.equal(document.activeElement, screen.getByRole('textbox'));
});

test('Escape dismisses only the top focus layer', () => {
    let parent = 0, child = 0;
    render(<OrcestrUiProvider><Trap close={() => parent++} /><Trap close={() => child++} /></OrcestrUiProvider>);
    fireEvent.keyDown(screen.getAllByRole('textbox', {hidden: true})[1], {key: 'Escape', bubbles: true, cancelable: true});
    assert.equal(parent, 0); assert.equal(child, 1);
});
