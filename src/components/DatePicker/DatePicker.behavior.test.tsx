import assert from 'node:assert/strict';
import {after, afterEach, test} from 'node:test';
import {setupDom} from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const {cleanup, fireEvent, render, screen, waitFor} = await import('@testing-library/react');
const {useState} = await import('react');
const {OrcestrUiProvider} = await import('../../provider/OrcestrUiProvider.js');
const {DatePicker} = await import('./DatePicker.js');
afterEach(cleanup);
after(restoreDom);

test('controlled date picker keeps one calendar open while a custom footer edits time', async () => {
    function Harness() {
        const [value, setValue] = useState('2026-10-15'), [open, setOpen] = useState(false), [time, setTime] = useState('17:30');
        return <OrcestrUiProvider><DatePicker value={value} onValueChange={setValue} open={open} onOpenChange={setOpen} closeOnSelect={false}
            trigger={<button type='button'>Deadline</button>}
            footer={<div><input aria-label='Deadline time' value={time} onChange={(event) => setTime(event.target.value)} /><button onClick={() => setOpen(false)}>Done</button></div>} />
            <output>{value} {time}</output></OrcestrUiProvider>;
    }
    render(<Harness />); fireEvent.click(screen.getByRole('button', {name: 'Deadline'}));
    await screen.findByRole('grid'); assert.equal(screen.getAllByRole('grid').length, 1);
    await waitFor(() => assert.ok(document.activeElement?.closest('[role="grid"]')));
    const choice = document.querySelector<HTMLButtonElement>('[data-oui-date="2026-10-16"]'); assert.ok(choice);
    fireEvent.click(choice); assert.equal(screen.getAllByRole('grid').length, 1);
    const time = screen.getByRole('textbox', {name: 'Deadline time'}); time.focus();
    for (const value of ['1', '19:', '19:45']) {fireEvent.change(time, {target: {value}}); assert.equal(document.activeElement, time);}
    assert.equal(screen.getByRole('status').textContent, '2026-10-16 19:45');
    fireEvent.click(screen.getByRole('button', {name: 'Done'}));
    assert.equal(screen.getByRole('button', {name: 'Deadline'}).getAttribute('aria-expanded'), 'false');
});

test('default date picker selection still closes and a disabled controlled calendar cannot select dates', async () => {
    const changes: string[] = [];
    const view = render(<OrcestrUiProvider><DatePicker value='2026-10-15' onValueChange={(date) => changes.push(date)} trigger={<button>Default date</button>} /></OrcestrUiProvider>);
    fireEvent.click(screen.getByRole('button', {name: 'Default date'}));
    await screen.findByRole('grid');
    await waitFor(() => assert.ok(document.activeElement?.closest('[role="grid"]')));
    const choice = document.querySelector<HTMLButtonElement>('[data-oui-date="2026-10-16"]'); assert.ok(choice);
    fireEvent.click(choice); assert.deepEqual(changes, ['2026-10-16']); assert.equal(screen.getByRole('button', {name: 'Default date'}).getAttribute('aria-expanded'), 'false');
    view.rerender(<OrcestrUiProvider><DatePicker value='2026-10-15' onValueChange={(date) => changes.push(date)} open disabled trigger={<button>Disabled date</button>} /></OrcestrUiProvider>);
    const disabled = document.querySelector<HTMLButtonElement>('[data-oui-date="2026-10-17"]'); assert.ok(disabled); assert.equal(disabled.disabled, true);
    fireEvent.click(disabled); assert.deepEqual(changes, ['2026-10-16']);
});
