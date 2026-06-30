import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('Workflow exports generic status, timeline, pipeline and lifecycle primitives', () => {
    const source = read('components/Workflow/Workflow.tsx');
    assert.match(source, /export function StatusBadge/);
    assert.match(source, /export function Timeline/);
    assert.match(source, /export function Pipeline/);
    assert.match(source, /export function WorkflowSummaryBar/);
    assert.match(source, /export function LifecycleBlockReasonCallout/);
    assert.match(source, /export function LifecycleActionPanel/);
    assert.match(source, /export type WorkflowStepStatus/);
});

test('Workflow pipeline supports loading, disabled reasons and action semantics', () => {
    const source = read('components/Workflow/Workflow.tsx');
    assert.match(source, /loadingSteps/);
    assert.match(source, /disabledReason/);
    assert.match(source, /Tooltip content=\{tooltip\}/);
    assert.match(source, /data-status=\{status\}/);
    assert.match(source, /data-clickable=\{!isDisabled/);
    assert.match(source, /workflowStatusIcon/);
});

test('Workflow primitives reuse Orcestr UI action and state building blocks', () => {
    const source = read('components/Workflow/Workflow.tsx');
    assert.match(source, /type \{OrcestrActionItem\}/);
    assert.match(source, /<Alert/);
    assert.match(source, /<Button/);
    assert.match(source, /<Skeleton/);
    assert.match(source, /<StatusBadge/);
});

test('Workflow stays generic and does not pull operations business logic', () => {
    const source = read('components/Workflow/Workflow.tsx');
    assert.doesNotMatch(source, /@\/modules/);
    assert.doesNotMatch(source, /operations|CustomerOrder|PurchaseOrder|InventoryCount|SalesOffer/);
    assert.doesNotMatch(source, /mst-/);
});
