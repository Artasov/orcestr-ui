import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';
import { setupDom } from '../../test-utils/dom.mts';
import type { StepperInputProps } from './StepperInput.js';
import type { OrcestrUiCopy } from '../../locale/LocaleProvider.js';

const restoreDom = setupDom();
const { cleanup, fireEvent, render, screen } = await import('@testing-library/react');
const { useState } = await import('react');
const { OrcestrUiProvider } = await import('../../provider/OrcestrUiProvider.js');
const { StepperInput } = await import('./StepperInput.js');
afterEach(cleanup);
after(restoreDom);

// Compile-time contracts: existing numeric handlers/copy remain valid; nullable input is explicit.
function publicTypes(common: Omit<OrcestrUiCopy['common'], 'stepBy' | 'stepModifiers'>) {
    const unchangedCopy: OrcestrUiCopy['common'] = common;
    const numeric: StepperInputProps = {value: 1, onChange: (_next: number) => {}};
    const optional: StepperInputProps = {allowEmpty: true, value: null, onChange: (_next: number | null) => {}};
    // @ts-expect-error Nullable values require explicit allowEmpty.
    const invalid: StepperInputProps = {value: null, onChange: (_next: number) => {}};
    return {unchangedCopy, numeric, optional, invalid};
}
void publicTypes;

function Numeric({initial = 0, ...props}: {initial?: number} & Omit<StepperInputProps, 'value' | 'onChange' | 'allowEmpty'>) {
    const [value, setValue] = useState(initial);
    return <OrcestrUiProvider locale="en"><StepperInput {...props} value={value} onChange={setValue} ariaLabel="Quantity" />
        <output>{value}</output></OrcestrUiProvider>;
}

test('manual decimal and comma values keep three places independently of the step grid', () => {
    render(<Numeric initial={1} step={0.1} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    for (const [raw, expected] of [['1.234', '1.234'], ['0,125', '0.125']]) {
        fireEvent.focus(input); fireEvent.change(input, {target: {value: raw}}); fireEvent.blur(input);
        assert.equal(input.value, expected); assert.equal(screen.getByRole('status').textContent, expected);
    }
    fireEvent.focus(input); fireEvent.change(input, {target: {value: '2.345'}}); fireEvent.keyDown(input, {key: 'Enter'});
    assert.equal(screen.getByRole('status').textContent, '2.345');
    fireEvent.change(input, {target: {value: '8.765'}}); fireEvent.keyDown(input, {key: 'Escape'});
    assert.equal(input.value, '2.345');
});

test('step clicks add decimal increments exactly and support both modifier levels', () => {
    render(<Numeric initial={0.1} step={0.1} shiftStep={1} ctrlShiftStep={10} />);
    const plus = screen.getByRole('button', {name: 'Increase'}), minus = screen.getByRole('button', {name: 'Decrease'});
    fireEvent.click(plus); fireEvent.click(plus); assert.equal(screen.getByRole('status').textContent, '0.3');
    fireEvent.click(plus, {shiftKey: true}); assert.equal(screen.getByRole('status').textContent, '1.3');
    fireEvent.click(plus, {shiftKey: true, ctrlKey: true}); assert.equal(screen.getByRole('status').textContent, '11.3');
    fireEvent.click(minus, {shiftKey: true, metaKey: true}); assert.equal(screen.getByRole('status').textContent, '1.3');
});

test('arrow keys use modifiers and step from the current uncommitted manual draft', () => {
    render(<Numeric step={0.1} shiftStep={1} ctrlShiftStep={10} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.focus(input); fireEvent.change(input, {target: {value: '1.234'}});
    fireEvent.keyDown(input, {key: 'ArrowUp'}); assert.equal(screen.getByRole('status').textContent, '1.334');
    fireEvent.keyDown(input, {key: 'ArrowDown', shiftKey: true}); assert.equal(screen.getByRole('status').textContent, '0.334');
    fireEvent.keyDown(input, {key: 'ArrowUp', shiftKey: true, ctrlKey: true}); assert.equal(screen.getByRole('status').textContent, '10.334');
    fireEvent.keyDown(input, {key: 'ArrowDown', shiftKey: true, metaKey: true}); assert.equal(screen.getByRole('status').textContent, '0.334');
});

test('optional mode keeps null distinct from zero and supports keyboard and clear-button clearing', () => {
    function Optional() {
        const [value, setValue] = useState<number | null>(null);
        return <OrcestrUiProvider locale="en"><StepperInput allowEmpty value={value} onChange={setValue} min={0} step={0.1} />
            <output>{value === null ? 'unset' : value}</output></OrcestrUiProvider>;
    }
    render(<Optional />); const input = screen.getByRole('spinbutton') as HTMLInputElement;
    assert.equal(input.value, ''); assert.equal(input.hasAttribute('aria-valuenow'), false);
    fireEvent.click(screen.getByRole('button', {name: 'Increase'})); assert.equal(screen.getByRole('status').textContent, '0.1');
    fireEvent.click(screen.getByRole('button', {name: 'Clear'})); assert.equal(screen.getByRole('status').textContent, 'unset');
    fireEvent.change(input, {target: {value: '0'}}); fireEvent.blur(input); assert.equal(screen.getByRole('status').textContent, '0');
    fireEvent.change(input, {target: {value: ''}}); fireEvent.blur(input); assert.equal(screen.getByRole('status').textContent, 'unset');
});

test('required numeric mode restores cleared, incomplete and inexact input without emitting null or rounded numbers', () => {
    render(<Numeric initial={2.345} step={0.1} />); const input = screen.getByRole('spinbutton') as HTMLInputElement;
    for (const raw of ['', '-', '.', '99999999999999.125001']) {
        fireEvent.change(input, {target: {value: raw}}); fireEvent.blur(input);
        assert.equal(input.value, '2.345'); assert.equal(screen.getByRole('status').textContent, '2.345');
    }
    assert.equal(screen.queryByRole('button', {name: 'Clear'}), null);
});

test('cleared nullable draft steps from zero before blur with buttons and arrow keys, including at a prior bound', () => {
    function Optional() {
        const [value, setValue] = useState<number | null>(5);
        return <OrcestrUiProvider locale="en"><StepperInput allowEmpty value={value} onChange={setValue} min={0} max={5} step={0.1} />
            <output>{value === null ? 'unset' : value}</output></OrcestrUiProvider>;
    }
    for (const action of ['click', 'ArrowUp', 'ArrowDown']) {
        render(<Optional />);
        const input = screen.getByRole('spinbutton'), increase = screen.getByRole('button', {name: 'Increase'}) as HTMLButtonElement;
        assert.equal(increase.disabled, true);
        fireEvent.focus(input); fireEvent.change(input, {target: {value: ''}});
        assert.equal(increase.disabled, false);
        if (action === 'click') fireEvent.click(increase);
        else fireEvent.keyDown(input, {key: action});
        assert.equal(screen.getByRole('status').textContent, action === 'ArrowDown' ? '0' : '0.1');
        cleanup();
    }
});

test('optional clear button can be hidden without preventing keyboard clearing', () => {
    const changes: (number | null)[] = [];
    render(<OrcestrUiProvider locale="en"><StepperInput allowEmpty clearable={false} value={1.234} onChange={value => changes.push(value)} /></OrcestrUiProvider>);
    assert.equal(screen.queryByRole('button', {name: 'Clear'}), null);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value: ''}}); fireEvent.blur(input);
    assert.equal(changes.length, 1); assert.equal(changes[0], null);
});

test('min and max clamp manual and modified input and disable buttons at the bounds', () => {
    render(<Numeric initial={0.5} min={0} max={1} step={0.1} shiftStep={1} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    fireEvent.click(screen.getByRole('button', {name: 'Increase'}), {shiftKey: true});
    assert.equal(input.value, '1'); assert.equal((screen.getByRole('button', {name: 'Increase'}) as HTMLButtonElement).disabled, true);
    fireEvent.change(input, {target: {value: '-0.125'}}); fireEvent.blur(input);
    assert.equal(input.value, '0'); assert.equal((screen.getByRole('button', {name: 'Decrease'}) as HTMLButtonElement).disabled, true);
});

test('readonly, disabled, size and full-width props preserve native field accessibility', () => {
    const changes: unknown[] = [];
    const view = render(<OrcestrUiProvider locale="en"><label htmlFor="minimum">Minimum stock</label>
        <StepperInput allowEmpty value={1.234} onChange={value => changes.push(value)} id="minimum" name="minimum"
            placeholder="Not set" readOnly fullWidth size={2} testId="stepper" aria-describedby="help" /></OrcestrUiProvider>);
    const input = screen.getByRole('spinbutton', {name: 'Minimum stock'}) as HTMLInputElement;
    assert.equal(input.readOnly, true); assert.equal(input.name, 'minimum'); assert.equal(input.getAttribute('aria-describedby'), 'help');
    assert.equal(screen.getByTestId('stepper').getAttribute('data-full-width'), 'true');
    assert.equal(screen.getByTestId('stepper').getAttribute('data-size'), '2');
    assert.equal(screen.getByTestId('stepper-decrease').tagName, 'BUTTON');
    assert.equal(screen.getByTestId('stepper-increase').tagName, 'BUTTON');
    assert.equal(screen.getByTestId('stepper-input'), input);
    assert.ok([...document.querySelectorAll('button')].every(button => button.disabled));
    fireEvent.keyDown(input, {key: 'ArrowUp'}); fireEvent.change(input, {target: {value: '3'}}); fireEvent.blur(input);
    assert.equal(changes.length, 0); assert.equal(input.value, '1.234');
    view.rerender(<OrcestrUiProvider><StepperInput value={1} onChange={value => changes.push(value)} disabled /></OrcestrUiProvider>);
    assert.equal((screen.getByRole('spinbutton') as HTMLInputElement).disabled, true);
});

test('shared step tooltips are localized, customizable and can be completely disabled', async () => {
    const props = {value: 1, onChange() {}, step: 0.1, shiftStep: 1, ctrlShiftStep: 10};
    const view = render(<OrcestrUiProvider locale="ru"><StepperInput {...props} /></OrcestrUiProvider>);
    const decrease = screen.getByRole('button', {name: 'Уменьшить'});
    assert.equal(decrease.hasAttribute('title'), false); fireEvent.mouseEnter(decrease);
    assert.match((await screen.findByRole('tooltip', {hidden: true})).textContent ?? '', /Уменьшить на 0,1.*Shift: 1.*Ctrl\/Cmd \+ Shift: 10/);
    view.rerender(<OrcestrUiProvider locale="en"><StepperInput {...props} showStepTooltips={false} /></OrcestrUiProvider>);
    fireEvent.mouseEnter(screen.getByRole('button', {name: 'Decrease'}));
    assert.equal(screen.queryByRole('tooltip', {hidden: true}), null);
    view.rerender(<OrcestrUiProvider locale="en"><StepperInput {...props} /></OrcestrUiProvider>);
    fireEvent.mouseEnter(screen.getByRole('button', {name: 'Decrease'}));
    assert.match((await screen.findByRole('tooltip', {hidden: true})).textContent ?? '', /Decrease by 0\.1.*Shift: 1.*Ctrl\/Cmd \+ Shift: 10/);
    view.rerender(<OrcestrUiProvider locale="en"><StepperInput key="custom" {...props} stepTooltip={({direction, shiftStep, locale}) => `${direction} ${shiftStep} ${locale}`} /></OrcestrUiProvider>);
    fireEvent.mouseEnter(screen.getByRole('button', {name: 'Increase'}));
    assert.equal((await screen.findByRole('tooltip', {hidden: true})).textContent, 'increase 1 en');
});
