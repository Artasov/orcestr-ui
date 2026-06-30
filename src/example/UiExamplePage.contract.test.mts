import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('UI example sidebar follows the rendered section order', () => {
    const data = read('example/exampleData.ts');
    const page = read('example/UiExamplePage.tsx');

    assert.match(data, /export const navGroups: ExampleNavGroup\[] = \[/);
    assert.match(data, /label: 'Base'/);
    assert.match(data, /label: 'Layout'/);
    assert.match(data, /label: 'Actions'/);
    assert.match(data, /label: 'Fields'/);
    assert.match(data, /label: 'Selection'/);
    assert.match(data, /label: 'States'/);
    assert.match(data, /label: 'Data'/);
    assert.match(data, /label: 'Overlays'/);
    assert.match(data, /id: 'theme', label: 'Themes'/);
    assert.match(data, /id: 'foundations', label: 'Foundations'/);
    assert.match(data, /id: 'typography', label: 'Typography'/);
    assert.match(data, /id: 'skeleton-example', label: 'Skeleton'/);
    assert.match(data, /id: 'app-shell-example', label: 'AppShell'/);
    assert.match(data, /id: 'scroll-area-example', label: 'ScrollArea'/);
    assert.match(data, /id: 'text-fields-example', label: 'Text fields'/);
    assert.match(data, /id: 'selects-example', label: 'Selects'/);
    assert.match(data, /id: 'choice-controls-example', label: 'Checkbox, switch, radio'/);
    assert.match(data, /id: 'tabs-example', label: 'Tabs'/);
    assert.match(data, /id: 'state-card-example', label: 'StateCard'/);
    assert.match(data, /id: 'icon-text-example', label: 'IconText'/);
    assert.match(data, /id: 'data-table-example', label: 'DataTable'/);
    assert.match(data, /id: 'toast-example', label: 'Toast'/);
    assert.doesNotMatch(data, /key: 'forms'|filterbar-example|standard-table-example|inline-state-example|InlineState|scroll-highlights-example|Scroll highlights|id: 'data', label: 'Tables'/);
    assert.doesNotMatch(data, /Темы|Контракты|Типографика|Раскладка|Действия|Кнопки|Иконки|Состояния|Оверлеи/);

    assert.match(page, /<ExampleThemePlayground[\s\S]*?<FoundationsSection[\s\S]*?<TypographySection[\s\S]*?<IconTextSection[\s\S]*?<LayoutSection[\s\S]*?<ActionsSection[\s\S]*?<FieldsSection[\s\S]*?<SelectionSection[\s\S]*?<StateCardSection[\s\S]*?<DataSection[\s\S]*?<OverlaysSection/);
    assert.match(page, /function UiExampleSidebar/);
    assert.match(page, /navGroups\.map/);
    assert.match(page, /oui-ui-sidebar-group-label/);
    assert.match(page, /<UiExampleSidebar onNavigate=\{\(\) => setMobileNavOpen\(false\)\} \/>/);
    assert.doesNotMatch(page, /sidebarNavItems/);
    assert.doesNotMatch(page, /IntersectionObserver/);
});

test('UI example exposes deep anchors for public demo sections', () => {
    const actionsSection = read('example/ExampleActionsSection.tsx');
    const dataSection = read('example/ExampleDataSection.tsx');
    const foundationsSection = read('example/ExampleFoundationsSection.tsx');
    const stateSection = read('example/ExampleStateSection.tsx');
    const basicsSection = read('example/ExampleBasicsSections.tsx');
    const fieldsSection = read('example/ExampleFieldsSection.tsx');
    const selectionSection = read('example/ExampleSelectionSection.tsx');
    const overlaysSection = read('example/ExampleOverlaysSection.tsx');
    const samples = read('example/codeSamples.ts');

    assert.match(actionsSection, /id='buttons-example'/);
    assert.match(actionsSection, /id='icon-buttons-example'/);
    assert.doesNotMatch(actionsSection, /id='actions'/);
    assert.match(dataSection, /id='data-table-example'/);
    assert.doesNotMatch(dataSection, /id='data'/);
    assert.match(foundationsSection, /id='foundations'/);
    assert.match(stateSection, /id='state-card-example'/);
    assert.match(stateSection, /id='icon-text-example'/);
    assert.match(stateSection, /IconText/);
    assert.doesNotMatch(stateSection, /InlineState|oui-ui-inline-state-list/);
    assert.match(fieldsSection, /id='text-fields-example'/);
    assert.match(fieldsSection, /id='grouped-fields-example'/);
    assert.match(fieldsSection, /id='number-date-fields-example'/);
    assert.match(fieldsSection, /id='date-range-example'/);
    assert.doesNotMatch(fieldsSection, /id='fields'/);
    assert.match(selectionSection, /id='selects-example'/);
    assert.match(selectionSection, /id='choice-controls-example'/);
    assert.match(selectionSection, /id='tabs-example'/);
    assert.doesNotMatch(selectionSection, /id='selection'/);
    assert.match(overlaysSection, /id='overlay-primitives-example'/);
    assert.match(overlaysSection, /id='toast-example'/);
    assert.match(overlaysSection, /id='overlay-settings-example'/);
    assert.doesNotMatch(overlaysSection, /id='overlays'/);
    assert.match(basicsSection, /id='app-shell-example'/);
    assert.match(basicsSection, /id='flex-example'/);
    assert.match(basicsSection, /id='stack-example'/);
    assert.match(basicsSection, /id='collapse-example'/);
    assert.match(basicsSection, /id='grid-example'/);
    assert.match(basicsSection, /id='scroll-area-example'/);
    assert.doesNotMatch(basicsSection, /id='scroll-highlights-example'/);
    assert.doesNotMatch(basicsSection, /id='layout'/);
    assert.equal((basicsSection.match(/className='oui-highlight-demo-surface'/g) ?? []).length, 1);
    assert.equal((samples.match(/className='oui-highlight-demo-surface'/g) ?? []).length, 1);
    assert.match(basicsSection, /Top and bottom highlights/);
    assert.doesNotMatch(basicsSection, /Top only<\/Text>|Useful when only the header edge/);
    assert.match(basicsSection, /title='ScrollArea'/);
    assert.match(basicsSection, /Themed scroll container with optional edge highlights/);
    assert.match(basicsSection, /mode: 'static'/);
    assert.match(basicsSection, /mode: 'scroll'/);
    assert.doesNotMatch(basicsSection, /title='Scroll highlights'|Static scroll highlights|Scroll reveal highlights/);
    assert.doesNotMatch(samples, /scrollAreaHighlights|scrollAreaRevealHighlights|Static scroll highlights|Scroll reveal highlights/);
});

test('UI example keeps forms out of the foundation demo', () => {
    const fields = read('example/ExampleFieldsSection.tsx');
    const samples = read('example/codeSamples.ts');

    assert.doesNotMatch(fields, /react-hook-form|<Form|FormSection|FormActions|FormSubmitButton|FormTextField|FormSelect/);
    assert.doesNotMatch(samples, /react-hook-form|FormSubmitButton|FormSection/);
    assert.match(fields, /Layout primitives group fields without owning state/);
});

test('UI example selection data follows current locale', () => {
    const page = read('example/UiExamplePage.tsx');
    const selection = read('example/ExampleSelectionSection.tsx');
    const overlays = read('example/ExampleOverlays.tsx');
    const data = read('example/exampleData.ts');

    assert.match(page, /<SelectionSection[\s\S]*?locale=\{locale\}/);
    assert.match(page, /<ExampleOverlays[\s\S]*?locale=\{locale\}/);
    assert.match(selection, /getOptionItems\(locale\)/);
    assert.match(selection, /getOwnerItems\(locale\)/);
    assert.match(selection, /loadEntityPage\(locale, page, search\)/);
    assert.match(overlays, /const commandItems = getCommandItems\(locale\)/);
    assert.match(data, /const enOptionItems: ListboxItem\[\] = \[[\s\S]*?label: 'In progress'/);
    assert.match(data, /const enOwnerItems = \[[\s\S]*?label: 'Operations team'/);
    assert.match(data, /const enEntityOptions: EntityOption\[\] = Array\.from[\s\S]*?name: `Entity \$\{index \+ 1\}`/);
    assert.match(data, /export function getCommandItems\(locale: OrcestrUiLocale\)/);
});

test('UI example DataTable demo keeps controls compact', () => {
    const dataSection = read('example/ExampleDataSection.tsx');
    const styles = read('styles/_example.sass');
    const dataStyles = read('styles/_data.sass');
    const samples = read('example/codeSamples.ts');

    assert.match(dataSection, /className='oui-ui-table-tile'/);
    assert.match(dataSection, /className='oui-ui-table-demo'/);
    assert.match(dataSection, /<DataTable[\s\S]*?toolbar=\{\([\s\S]*?<TextField[\s\S]*?<Button[\s\S]*?size=\{3\}[\s\S]*?v='surface'[\s\S]*?>\s*Reset\s*<\/Button>/);
    assert.match(dataSection, /Plain table/);
    assert.match(dataSection, /rows=\{rows\.slice\(0, 4\)\}/);
    assert.doesNotMatch(dataSection, /Reset table|<Stack|oui-ui-table-demo-toolbar|pinned: 'left'/);
    assert.match(samples, /toolbar=\{[\s\S]*?<TextField[\s\S]*?<Button onClick=\{resetTable\}>Reset<\/Button>/);
    assert.match(samples, /rows=\{rows\.slice\(0, 4\)\}/);
    assert.match(styles, /\.oui-ui-table-demo\s+display: flex[\s\S]*?flex-direction: column[\s\S]*?gap: 12px/);
    assert.match(styles, /\.oui-ui-table-variants\s+display: grid[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/);
    assert.match(styles, /\.oui-ui-table-variant\s+display: flex[\s\S]*?flex-direction: column/);
    assert.match(dataStyles, /\.oui-data-table-toolbar\s+display: flex[\s\S]*?align-items: stretch[\s\S]*?gap: 8px/);
    assert.match(dataStyles, /\.oui-data-table-toolbar-content\s+display: flex[\s\S]*?flex: 1 1 auto/);
    assert.match(dataStyles, /\.oui-data-table-toolbar-content > \.oui-text-field\s+flex: 1 1 240px/);
    assert.match(styles, /\.oui-ui-table-tile\s+align-items: flex-start/);
    assert.match(styles, /\.oui-ui-table-tile \.oui-ui-table-demo,[\s\S]*?\.oui-ui-table-tile \.oui-data-table-wrap\s+flex: 1 1 auto/);
    assert.match(styles, /\.oui-ui-table-tile \.oui-code-inline-panel\s+align-self: flex-start/);
});

test('UI example cards show one title and keep imports only in code preview', () => {
    const preview = read('example/CodePreview.tsx');
    const styles = read('styles/_example.sass');

    assert.doesNotMatch(preview, /ORCESTR_UI_IMPORT_PATTERN|importedComponentNames/);
    assert.doesNotMatch(preview, /className='oui-ui-import-line'|function importStatement/);
    assert.doesNotMatch(preview, /oui-ui-component-list|oui-ui-component-name|oui-ui-tile-title-block|oui-ui-tile-title/);
    assert.match(preview, /export function InlineCodeBlock/);
    assert.match(preview, /data-collapsible=\{collapsible \? 'true' : 'false'\}/);
    assert.match(preview, /onWheelCapture=\{handleWheelCapture\}/);
    assert.match(preview, /scrollRoot\.scrollTop \+= normalizedWheelDeltaY\(event\)/);
    assert.match(preview, /Show code/);
    assert.match(preview, /Hide code/);
    assert.match(preview, /<CodeBlock code=\{code\} \/>/);
    assert.match(styles, /\.oui-ui-tile-head\s+display: none[\s\S]*?min-width: 0[\s\S]*?flex-wrap: wrap/);
    assert.match(styles, /\.oui-code-inline-panel\s+position: relative[\s\S]*?align-self: flex-start[\s\S]*?transition: height 260ms/);
    assert.match(styles, /\.oui-code-inline-fade\s+position: absolute[\s\S]*?height: 92px/);
    assert.match(styles, /\.oui-code-inline-panel\[data-expanded="false"\]\[data-collapsible="true"\] \.oui-code-preview-scroll \.oui-scroll-area-viewport\s+overflow: hidden/);
    assert.doesNotMatch(styles, /\.oui-code-inline-panel\[data-expanded="false"\]\[data-collapsible="true"\] \.oui-code-preview-scroll \.oui-scroll-area-viewport\s+\n    overflow: hidden\n    pointer-events: none/);
    assert.match(styles, /@media \(max-width: 860px\)[\s\S]*?\.oui-ui-tile-head\s+display: flex/);
    assert.doesNotMatch(styles, /\.oui-ui-import-line|\.oui-ui-tile-title-block|\.oui-ui-tile-title/);
});

test('UI example starts with editable theme playground presets', () => {
    const page = read('example/UiExamplePage.tsx');
    const playground = read('example/ExampleThemePlayground.tsx');

    assert.match(page, /ExampleThemePlayground/);
    assert.match(page, /<ExampleThemePlayground[\s\S]*?locale=\{locale\}/);
    assert.match(page, /<UiExampleThemeRail[\s\S]*?locale=\{locale\}/);
    assert.match(page, /themePresetLabel\(preset, locale\)/);
    assert.match(page, /themeOverrides={themeOverrides}/);
    assert.match(playground, /id: 'deep-black'/);
    assert.match(playground, /id: 'midnight'/);
    assert.match(playground, /id: 'porcelain'/);
    assert.match(playground, /label: \{[\s\S]*?ru: 'Фарфор'[\s\S]*?en: 'Porcelain'/);
    assert.match(playground, /function themePresetLabel/);
    assert.match(playground, /themePresetLabel\(preset, locale\)/);
    assert.match(playground, /themePlaygroundCopy/);
    assert.match(playground, /en: \{[\s\S]*?title: 'Theme playground'/);
    assert.match(playground, /oui-theme-preset-scroll/);
    assert.match(playground, /type='color'/);
    assert.match(playground, /flatTokenSections/);
    assert.match(playground, /statusKeys/);
});

test('UI example shell uses Drawer-backed mobile sidebar and stable hash navigation', () => {
    const page = read('example/UiExamplePage.tsx');
    const shell = read('components/AppShell/AppShell.tsx');
    const shellStyles = read('styles/_shell.sass');
    const drawerStyles = read('styles/_drawer.sass');

    assert.match(page, /UiExampleTopBar/);
    assert.match(page, /function UiExampleSidebar/);
    assert.match(page, /const \[activeSection, setActiveSection\] = useState\('theme'\)/);
    assert.match(page, /function scrollUiExampleSection/);
    assert.match(page, /const UI_EXAMPLE_SCROLL_LEAD = 50/);
    assert.match(page, /function uiExampleSectionScrollTop/);
    assert.match(page, /behavior: 'smooth'/);
    assert.match(page, /node\.offsetTop - UI_EXAMPLE_SCROLL_LEAD/);
    assert.match(page, /top: uiExampleSectionScrollTop\(node, scrollRoot\)/);
    assert.match(page, /scrollNavigationTargetRef/);
    assert.match(page, /const setActiveSectionValue = useCallback/);
    assert.match(page, /if \(lockedTarget\)/);
    assert.match(page, /const targetTop = uiExampleSectionScrollTop\(targetNode, scrollRoot\)/);
    assert.match(page, /const bottomDistance = scrollRoot\.scrollHeight[\s\S]*?- scrollRoot\.clientHeight[\s\S]*?- scrollRoot\.scrollTop/);
    assert.match(page, /bottomDistance <= 2[\s\S]*?nodes\.at\(-1\)\?\.id/);
    assert.match(page, /if \(next && next !== activeSectionRef\.current\) setActiveSectionValue\(next\)/);
    assert.match(page, /requestAnimationFrame\(updateActiveSection\)/);
    assert.doesNotMatch(page, /uiExampleNavCopy/);
    assert.match(page, /scrollRoot\.addEventListener\('scroll', requestUpdateActiveSection, \{passive: true\}\)/);
    assert.match(shell, /<Drawer/);
    assert.match(shell, /oui-app-shell-sidebar-drawer-panel/);
    assert.match(shell, /className='oui-app-shell-sidebar-head-main'/);
    assert.match(shell, /<div className='oui-app-shell-sidebar-body'>\{children\}<\/div>/);
    assert.match(shellStyles, /\.oui-app-shell-sidebar-desktop/);
    assert.match(shellStyles, /\.oui-app-shell-sidebar\s+position: relative[\s\S]*?padding: 0/);
    assert.match(shellStyles, /--oui-app-shell-sidebar-body-pad: 12px 8px 18px 18px/);
    assert.match(shellStyles, /\.oui-app-shell-sidebar-head\s+display: flex[\s\S]*?padding: var\(--oui-app-shell-sidebar-head-pad\)/);
    assert.match(shellStyles, /\.oui-app-shell-sidebar-scroll\s+display: flex[\s\S]*?width: 100%/);
    assert.match(shellStyles, /\.oui-app-shell-sidebar-body\s+min-width: 0[\s\S]*?padding: var\(--oui-app-shell-sidebar-body-pad\)/);
    assert.match(shellStyles, /@media \(max-width: 860px\)[\s\S]*?--oui-app-shell-sidebar-body-pad: 12px 16px 18px/);
    assert.match(shellStyles, /\.oui-app-shell-content-scroll\s+flex: 1 1 auto[\s\S]*?padding: 0/);
    assert.match(shellStyles, /\.oui-app-shell-content-scroll > \.oui-scroll-area-viewport\s+height: 100%[\s\S]*?scroll-padding: 8px 28px 24px 22px/);
    assert.match(shellStyles, /\.oui-app-shell-content\s+display: flex[\s\S]*?padding: 0 28px 24px 22px/);
    assert.match(shellStyles, /@media \(max-width: 860px\)[\s\S]*?\.oui-app-shell-content\s+padding: 12px 10px 18px/);
    assert.match(drawerStyles, /\.oui-drawer-panel\[data-side="left"\]/);
    assert.doesNotMatch(shellStyles, /oui-app-shell-sidebar-backdrop/);
});

test('UI example and state components use container-safe layouts', () => {
    const styles = read('styles/_example.sass');
    const stateStyles = read('styles/_state.sass');
    const iconTextStyles = read('styles/_icon-text.sass');
    const scrollAreaStyles = read('styles/_scroll-area.sass');
    const stateSource = read('components/State/State.tsx');
    const stateSection = read('example/ExampleStateSection.tsx');

    assert.match(styles, /\.oui-ui-section\s+container-type: inline-size/);
    assert.match(styles, /@container \(max-width: 980px\)[\s\S]*?\.oui-ui-tile-body\s+flex-basis: auto/);
    assert.match(styles, /@media \(max-width: 860px\)[\s\S]*?\.oui-ui-tile-body\s+flex-basis: auto/);
    assert.match(styles, /\.oui-theme-preview\s+display: flex[\s\S]*?overflow: hidden/);
    assert.match(styles, /\.oui-theme-token-grid\s+display: grid[\s\S]*?repeat\(auto-fit, minmax\(min\(100%, 250px\), 1fr\)\)/);
    assert.match(scrollAreaStyles, /\.oui-scroll-area-highlight-overlay\s+position: absolute[\s\S]*?z-index: calc\(var\(--oui-z-sticky, 20\) \+ 10\)/);
    assert.doesNotMatch(styles, /oui-ui-dashboard-grid|oui-ui-media-compare-demo|oui-chat-shell/);
    assert.match(stateStyles, /\.oui-state-card\s+display: grid[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto[\s\S]*?container-type: inline-size/);
    assert.match(stateStyles, /\.oui-state-card\s+display: grid[\s\S]*?border: 1px solid transparent/);
    assert.match(stateStyles, /\.oui-state-card-main\s+display: flex[\s\S]*?flex-direction: column/);
    assert.match(iconTextStyles, /\.oui-icon-text\s+display: inline[\s\S]*?overflow-wrap: anywhere/);
    assert.match(iconTextStyles, /\.oui-icon-text-icon\s+display: inline-flex[\s\S]*?width: 1em[\s\S]*?height: 1em/);
    assert.match(iconTextStyles, /\.oui-icon-text-icon svg\s+display: block[\s\S]*?width: 100%[\s\S]*?height: 100%/);
    assert.match(stateStyles, /\.oui-state-card\s+display: grid[\s\S]*?font-size: 14px/);
    assert.match(stateStyles, /\.oui-state-card-body\s+display: flex[\s\S]*?gap: 4px/);
    assert.match(stateSource, /titleFs\?: SystemProps\['fs'\]/);
    assert.match(stateSource, /descriptionFs\?: SystemProps\['fs'\]/);
    assert.match(stateSource, /const actualTitleFs = titleFs \?\? \(compact \? '14px' : '15px'\)/);
    assert.match(stateSource, /<IconText[\s\S]*?fw=\{760\}[\s\S]*?fs=\{actualTitleFs\}/);
    assert.match(stateSource, /<Text className='oui-state-card-description' fs=\{descriptionFs\}>/);
    assert.match(stateStyles, /\.oui-state-card-description\s+display: block[\s\S]*?overflow-wrap: anywhere[\s\S]*?color: var\(--oui-text\)/);
    assert.doesNotMatch(stateStyles, /oui-state-card-title|line-height: 1\.25|line-height: 1\.45|line-height: 1\.4/);
    assert.match(stateSection, /<Stack g=\{1\}>[\s\S]*?<Text key=\{item\.key\} fs='13px' lh=\{1\.3\}>/);
    assert.doesNotMatch(stateStyles, /oui-inline-state|oui-state-card-icon|oui-state-card-heading|oui-icon-text|oui-alert|oui-badge/);
    assert.doesNotMatch(stateStyles, /\.oui-state-card-body\n(?:    .+\n)*    grid-column:/);
    assert.match(stateStyles, /\.oui-state-card\[data-tone="danger"\][\s\S]*?background: var\(--oui-danger-soft\)/);
    assert.doesNotMatch(stateStyles, /\.oui-state-card\[data-tone="danger"\]\n\s+border-color:/);
});
