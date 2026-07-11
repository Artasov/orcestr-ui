import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';
import axe from 'axe-core';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, render, screen } = await import('@testing-library/react');

afterEach(cleanup);
after(restoreDom);

const { Field } = await import('./Field');
const { TextField } = await import('../TextField/TextField');

test('Field links label, required state, error and control semantics', () => {
    render(
        <Field label="Email" error="Required" required>
            <TextField />
        </Field>,
    );

    const input = screen.getByRole('textbox', { name: /Email/ }) as HTMLInputElement;
    const error = screen.getByRole('alert');
    assert.equal(input.required, true);
    assert.equal(input.getAttribute('aria-required'), 'true');
    assert.equal(input.getAttribute('aria-invalid'), 'true');
    assert.equal(input.getAttribute('aria-describedby'), error.id);
});

test('Field and TextField have no serious automated accessibility violations', async () => {
    render(
        <Field label="Name" helperText="Public display name">
            <TextField />
        </Field>,
    );
    const result = await axe.run(document.body, {
        rules: { 'color-contrast': { enabled: false } },
    });
    assert.deepEqual(
        result.violations.filter(
            (violation) => violation.impact === 'serious' || violation.impact === 'critical',
        ),
        [],
    );
});
