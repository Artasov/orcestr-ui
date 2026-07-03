import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';

const source = readFileSync(new URL('./CopyButton.tsx', import.meta.url), 'utf8');
const barrel = readFileSync(new URL('../../index.ts', import.meta.url), 'utf8');
const preview = readFileSync(new URL('../../example/CodePreview.tsx', import.meta.url), 'utf8');
const actions = readFileSync(new URL('../../example/ExampleActionsSection.tsx', import.meta.url), 'utf8');
const samples = readFileSync(new URL('../../example/codeSamples.ts', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../../styles/_example.sass', import.meta.url), 'utf8');

test('Copy buttons own clipboard action and toast feedback', () => {
    assert.match(source, /export type CopyButtonProps/);
    assert.match(source, /export type CopyIconButtonProps/);
    assert.match(source, /navigator\.clipboard\?\.writeText/);
    assert.match(source, /toast\.success\(successMessage\)/);
    assert.match(source, /toast\.error\(errorMessage\)/);
    assert.match(barrel, /components\/CopyButton\/CopyButton/);
});

test('Code preview exposes a hover copy icon without vertical scroll ownership', () => {
    assert.match(preview, /<CopyIconButton[\s\S]*?className='oui-code-preview-copy'/);
    assert.match(preview, /<ScrollArea[\s\S]*?className='oui-code-preview-scroll oui-code-preview-scroll-inline'[\s\S]*?scrollbars='horizontal'/);
    assert.match(styles, /\.oui-code-preview-wrap\s+position: relative/);
    assert.match(styles, /\.oui-code-preview-copy\s+position: absolute[\s\S]*?opacity: 0/);
    assert.match(styles, /\.oui-code-preview-wrap:hover \.oui-code-preview-copy/);
    assert.match(styles, /\.oui-code-preview-scroll-inline\s+overflow: hidden/);
    assert.match(styles, /\.oui-code-preview-scroll-inline \.oui-scroll-area-viewport\s+max-height: none[\s\S]*?overflow-x: auto[\s\S]*?overflow-y: hidden[\s\S]*?overscroll-behavior-x: contain[\s\S]*?overscroll-behavior-y: auto/);
    assert.match(styles, /\.oui-code-inline-panel \.oui-code-preview\s+padding-bottom: 42px/);
});

test('Copy buttons are represented in the button examples', () => {
    assert.match(actions, /<CopyButton/);
    assert.match(actions, /<CopyIconButton/);
    assert.match(samples, /import \{Button, CopyButton, CopyIconButton, Spinner\} from '@orcestr\/ui'/);
});
