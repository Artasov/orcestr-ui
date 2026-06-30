import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('theme contract includes surfaces and full token families', () => {
    const types = read('theme/themeTypes.ts');
    assert.match(types, /OrcestrThemeSurface = 'orcestr' \| 'operations' \| 'media' \| 'catalog'/);
    assert.match(types, /colors: \{/);
    assert.match(types, /density: \{/);
    assert.match(types, /radii: \{/);
    assert.match(types, /spacing: \{/);
    assert.match(types, /breakpoints: \{/);
    assert.match(types, /shadows: \{/);
    assert.match(types, /typography: \{/);
    assert.match(types, /zIndex: \{/);
    assert.match(types, /motion: \{/);
    assert.match(types, /states: \{/);
    assert.match(types, /components: \{/);
});

test('theme surface registry includes all first-party surfaces', () => {
    const source = read('theme/defaultTheme.ts');
    assert.match(source, /orcestrThemeSurfaceRegistry/);
    assert.match(source, /orcestrThemeSurfaceRegistry\.orcestr/);
    assert.match(source, /orcestrThemeSurfaceRegistry\.operations/);
    assert.match(source, /orcestrThemeSurfaceRegistry\.media/);
    assert.match(source, /orcestrThemeSurfaceRegistry\.catalog/);
});

test('theme contract keeps only active component tokens', () => {
    const types = read('theme/themeTypes.ts');
    assert.match(types, /tableCellPaddingY: string/);
    assert.match(types, /fieldGap: string/);
    assert.match(types, /pipelineStepMinWidth: string/);
    assert.doesNotMatch(types, /widgetRadius: string/);
    assert.doesNotMatch(types, /chatBubbleRadius: string/);
    assert.doesNotMatch(types, /composerMinHeight: string/);
    assert.doesNotMatch(types, /mediaPreviewBackground: string/);
});

test('theme provider exposes component tokens as CSS variables', () => {
    const provider = read('theme/ThemeProvider.tsx');
    assert.match(provider, /--oui-space-page/);
    assert.match(provider, /--oui-breakpoint-desktop/);
    assert.match(provider, /--oui-state-disabled-opacity/);
    assert.match(provider, /--oui-pipeline-step-min-width/);
    assert.doesNotMatch(provider, /--oui-widget-radius/);
    assert.doesNotMatch(provider, /--oui-chat-bubble-radius/);
    assert.doesNotMatch(provider, /--oui-composer-min-height/);
    assert.doesNotMatch(provider, /--oui-media-preview-bg/);
});

test('theme provider mirrors active CSS variables to document root for portals', () => {
    const provider = read('theme/ThemeProvider.tsx');

    assert.match(provider, /document\.documentElement/);
    assert.match(provider, /themeStyle/);
    assert.match(provider, /Object\.entries\(themeStyle\)/);
    assert.match(provider, /root\.style\.setProperty\(name, String\(value\)\)/);
    assert.match(provider, /root\.style\.removeProperty\(name\)/);
});

test('theme provider can be controlled by playground state', () => {
    const types = read('theme/themeTypes.ts');
    const provider = read('theme/ThemeProvider.tsx');
    const uiProvider = read('provider/OrcestrUiProvider.tsx');

    assert.match(types, /mode\?: OrcestrThemeMode/);
    assert.match(types, /onModeChange\?: \(mode: OrcestrThemeMode\) => void/);
    assert.match(types, /onSurfaceChange\?: \(surface: OrcestrThemeSurface\) => void/);
    assert.match(provider, /controlledMode/);
    assert.match(provider, /resolvedMode/);
    assert.match(uiProvider, /onModeChange={onModeChange}/);
    assert.match(uiProvider, /onSurfaceChange={onSurfaceChange}/);
});

test('default themes include module surface overrides', () => {
    const source = read('theme/defaultTheme.ts');
    assert.match(source, /operations: \{/);
    assert.match(source, /media: \{/);
    assert.match(source, /catalog: \{/);
    assert.match(source, /pipelineStepMinWidth: '148px'/);
    assert.doesNotMatch(source, /chatBubbleRadius/);
    assert.doesNotMatch(source, /mediaPreviewBackground/);
});

test('theme playground exposes new token families and catalog presets', () => {
    const source = read('example/ExampleThemePlayground.tsx');
    assert.match(source, /id: 'catalog-dark'/);
    assert.match(source, /id: 'catalog-light'/);
    assert.match(source, /tokenSections: \{[\s\S]*?spacing: 'Отступы'/);
    assert.match(source, /tokenSections: \{[\s\S]*?breakpoints: 'Брейкпоинты'/);
    assert.match(source, /tokenSections: \{[\s\S]*?states: 'Состояния'/);
    assert.match(source, /tokenSections: \{[\s\S]*?spacing: 'Spacing'/);
    assert.match(source, /tokenSections: \{[\s\S]*?breakpoints: 'Breakpoints'/);
    assert.match(source, /tokenSections: \{[\s\S]*?states: 'States'/);
});
