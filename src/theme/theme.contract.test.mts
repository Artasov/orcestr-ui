import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { splitSystemProps } from './systemProps.ts';

const root = fileURLToPath(new URL('..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('theme contract includes surfaces and full token families', () => {
    const types = read('theme/themeTypes.ts');
    assert.match(types, /OrcestrThemeSurface = 'orcestr' \| 'operations' \| 'media' \| 'catalog'/);
    assert.match(types, /colors: \{/);
    assert.match(types, /primary: OrcestrThemeColorRole/);
    assert.match(types, /secondary: OrcestrThemeColorRole/);
    assert.match(types, /base: string/);
    assert.match(types, /contrast: string/);
    assert.doesNotMatch(types, /brandSolid|brandStrong|brandSoft|brandText/);
    assert.match(types, /density: \{/);
    assert.match(types, /radius: \{/);
    assert.match(types, /spacing: \{/);
    assert.match(types, /breakpoints: \{/);
    assert.match(types, /shadows: \{/);
    assert.match(types, /text: \{/);
    assert.match(types, /family: string/);
    assert.match(types, /mono: string/);
    assert.match(types, /headingLine: string/);
    assert.match(types, /regular: number/);
    assert.match(types, /medium: number/);
    assert.match(types, /bold: number/);
    assert.doesNotMatch(
        types,
        /radii|typography|fontFamily|monoFontFamily|titleSize|headingSize|bodySize|compactSize|labelSize|lineHeight|headingLineHeight|weightRegular|weightMedium|weightBold/,
    );
    assert.match(types, /zIndex: \{/);
    assert.match(types, /motion: \{/);
    assert.match(types, /scrollbar: \{/);
    assert.match(types, /states: \{/);
    assert.match(types, /components: \{/);
});

test('system props accept numeric strings as spacing scale values', () => {
    const { systemStyle, restProps } = splitSystemProps({
        p: '4',
        mt: '1',
        g: '2',
        mb: '5',
        py: '6',
        maxW: 'calc(100vw - 24px)',
        id: 'sample',
    });

    assert.equal(systemStyle.padding, '16px');
    assert.equal(systemStyle.marginTop, '4px');
    assert.equal(systemStyle.gap, '8px');
    assert.equal(systemStyle.marginBottom, '24px');
    assert.equal(systemStyle.paddingBlock, '32px');
    assert.equal(systemStyle.maxWidth, 'calc(100vw - 24px)');
    assert.deepEqual(restProps, { id: 'sample' });
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
    assert.doesNotMatch(types, /widgetRadius: string/);
    assert.doesNotMatch(types, /chatBubbleRadius: string/);
    assert.doesNotMatch(types, /composerMinHeight: string/);
    assert.doesNotMatch(types, /mediaPreviewBackground: string/);
});

test('theme provider exposes component tokens as CSS variables', () => {
    const types = read('theme/themeTypes.ts');
    const provider = read('theme/ThemeProvider.tsx');
    const styles = read('styles/_theme.sass');
    assert.match(provider, /--oui-space-page/);
    assert.match(provider, /--oui-primary-base/);
    assert.match(provider, /--oui-primary-text/);
    assert.match(provider, /--oui-secondary-base/);
    assert.doesNotMatch(provider, /--oui-brand/);
    assert.doesNotMatch(provider, /--oui-status-brand/);
    assert.match(provider, /--oui-breakpoint-desktop/);
    assert.match(provider, /--oui-state-disabled-opacity/);
    assert.match(provider, /--oui-scrollbar-thumb': theme\.scrollbar\.thumb/);
    assert.match(provider, /--oui-scrollbar-thumb-hover': theme\.scrollbar\.thumbHover/);
    assert.match(provider, /--oui-scrollbar-track': theme\.scrollbar\.track/);
    assert.match(types, /cssVariables: CSSProperties/);
    assert.match(provider, /--oui-control-bg': controlBackgroundForMode\(theme\)/);
    assert.match(provider, /function relativeLuminance/);
    assert.match(styles, /color-scheme: light/);
    assert.match(styles, /color-scheme: dark/);
    assert.match(styles, /--oui-pad-bg: #00000006/);
    assert.match(styles, /--oui-pad-hover-bg: #0000000f/);
    assert.match(
        styles,
        /--oui-scrollbar-thumb: color-mix\(in srgb, var\(--oui-bg\) 95%, var\(--oui-text\) 5%\)/,
    );
    assert.match(
        styles,
        /--oui-scrollbar-thumb-hover: color-mix\(in srgb, var\(--oui-bg\) 92%, var\(--oui-text\) 8%\)/,
    );
    assert.match(styles, /--oui-scrollbar-track: transparent/);
    assert.match(
        styles,
        /--oui-scrollbar-thumb: color-mix\(in srgb, var\(--oui-bg\) 96%, var\(--oui-text\) 4%\)/,
    );
    assert.match(
        styles,
        /--oui-scrollbar-thumb-hover: color-mix\(in srgb, var\(--oui-bg\) 93%, var\(--oui-text\) 7%\)/,
    );
    assert.doesNotMatch(provider, /--oui-widget-radius/);
    assert.doesNotMatch(provider, /--oui-chat-bubble-radius/);
    assert.doesNotMatch(provider, /--oui-composer-min-height/);
    assert.doesNotMatch(provider, /--oui-media-preview-bg/);
});

test('default toast theme matches compact glass notification defaults', () => {
    const source = read('theme/defaultTheme.ts');
    const overlays = read('styles/_overlays.sass');
    const animations = read('styles/_animations.sass');
    const toast = read('components/Toast/Toast.tsx');
    const provider = read('theme/ThemeProvider.tsx');

    assert.match(source, /background: 'rgb\(12 12 15 \/ 5%\)'/);
    assert.match(source, /background: 'rgb\(255 255 255 \/ 5%\)'/);
    assert.match(source, /blur: 6/);
    assert.doesNotMatch(source, /borderColor/);
    assert.match(source, /animationDuration: '420ms'/);
    assert.match(source, /exitDuration: '320ms'/);
    assert.match(source, /progressHeight: '2px'/);
    assert.match(overlays, /min\(380px, calc\(100vw - 32px\)\)/);
    assert.match(overlays, /padding: 16px/);
    assert.match(overlays, /border: 0/);
    assert.match(overlays, /\.oui-toast-viewport[\s\S]*background: var\(--oui-toast-bg/);
    assert.match(overlays, /\.oui-toast-viewport[\s\S]*backdrop-filter: blur\(6px\)/);
    assert.doesNotMatch(provider, /--oui-toast-filter|function cssToastFilter/);
    assert.doesNotMatch(overlays, /backdrop-filter: (?:var|blur\(var)/);
    assert.match(overlays, /\.oui-toast\[data-tone="success"\]/);
    assert.doesNotMatch(overlays, /saturate\(160%\)/);
    assert.match(overlays, /\.oui-toast-icon/);
    assert.match(animations, /@keyframes ouiToastIn/);
    assert.match(animations, /@keyframes ouiToastOut/);
    assert.match(overlays, /--oui-toast-enter-x/);
    assert.match(overlays, /--oui-toast-exit-x/);
    assert.match(animations, /translate3d\(var\(--oui-toast-enter-x/);
    assert.match(toast, /icon\?: ReactNode \| false/);
    assert.match(toast, /function toastIcon/);
});

test('default theme owns scrollbar tokens and exposes them to shared scroll surfaces', () => {
    const source = read('theme/defaultTheme.ts');
    const scrollArea = read('styles/_scroll-area.sass');
    const data = read('styles/_data.sass');
    const overlays = read('styles/_overlays.sass');
    const selection = read('styles/_selection.sass');

    assert.match(
        source,
        /scrollbar: \{\s+thumb: 'color-mix\(in srgb, var\(--oui-bg\) 96%, var\(--oui-text\) 4%\)'/,
    );
    assert.match(
        source,
        /thumbHover: 'color-mix\(in srgb, var\(--oui-bg\) 93%, var\(--oui-text\) 7%\)'/,
    );
    assert.match(
        source,
        /scrollbar: \{\s+thumb: 'color-mix\(in srgb, var\(--oui-bg\) 95%, var\(--oui-text\) 5%\)'/,
    );
    assert.match(
        source,
        /thumbHover: 'color-mix\(in srgb, var\(--oui-bg\) 92%, var\(--oui-text\) 8%\)'/,
    );
    assert.match(source, /track: 'transparent'/);
    assert.match(source, /scrollbar: \{\.\.\.baseTheme\.scrollbar, \.\.\.overrides\.scrollbar\}/);
    assert.match(
        scrollArea,
        /scrollbar-color: var\(--oui-scrollbar-thumb[\s\S]*?var\(--oui-scrollbar-track, transparent\)/,
    );
    assert.match(scrollArea, /background: var\(--oui-scrollbar-track, transparent\)/);
    assert.match(
        data,
        /scrollbar-color: var\(--oui-scrollbar-thumb[\s\S]*?var\(--oui-scrollbar-track, transparent\)/,
    );
    assert.match(
        overlays,
        /scrollbar-color: var\(--oui-scrollbar-thumb[\s\S]*?var\(--oui-scrollbar-track, transparent\)/,
    );
    assert.match(
        selection,
        /scrollbar-color: var\(--oui-scrollbar-thumb[\s\S]*?var\(--oui-scrollbar-track, transparent\)/,
    );
});

test('theme provider mirrors active CSS variables to document root for portals', () => {
    const provider = read('theme/ThemeProvider.tsx');

    assert.match(provider, /document\.documentElement/);
    assert.match(provider, /cssVariables: rootStyle/);
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
    assert.doesNotMatch(source, /chatBubbleRadius/);
    assert.doesNotMatch(source, /mediaPreviewBackground/);
});

test('theme playground exposes new token families and catalog presets', () => {
    const source = read('example/ExampleThemePlayground.tsx');
    assert.match(source, /id: 'catalog-dark'/);
    assert.match(source, /id: 'catalog-light'/);
    assert.match(source, /'radius'/);
    assert.match(source, /'text'/);
    assert.doesNotMatch(source, /'radii'|'typography'/);
    assert.match(source, /tokenSections: \{[\s\S]*?spacing: 'Отступы'/);
    assert.match(source, /tokenSections: \{[\s\S]*?breakpoints: 'Брейкпоинты'/);
    assert.match(source, /tokenSections: \{[\s\S]*?states: 'Состояния'/);
    assert.match(source, /tokenSections: \{[\s\S]*?spacing: 'Spacing'/);
    assert.match(source, /tokenSections: \{[\s\S]*?breakpoints: 'Breakpoints'/);
    assert.match(source, /tokenSections: \{[\s\S]*?scrollbar: 'Scrollbar'/);
    assert.match(source, /tokenSections: \{[\s\S]*?states: 'States'/);
    assert.match(
        source,
        /flatTokenSections = \[[\s\S]*?'toast'[\s\S]*?'scrollbar'[\s\S]*?'states'/,
    );
});
