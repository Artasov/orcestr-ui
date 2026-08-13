import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));

function read(path: string): string {
    return readFileSync(`${root}/${path}`, 'utf8');
}

test('UI example sidebar follows the rendered section order', () => {
    const data = read('example/exampleData.ts');
    const page = read('example/UiExamplePage.tsx');

    assert.match(data, /export const navGroups: ExampleNavGroup\[] = \[/);
    assert.match(data, /label: 'Base["']/);
    assert.match(data, /label: 'Layout["']/);
    assert.match(data, /label: 'Actions["']/);
    assert.match(data, /label: 'Fields["']/);
    assert.match(data, /label: 'Selection["']/);
    assert.match(data, /label: 'Data["']/);
    assert.match(data, /label: 'Overlays["']/);
    assert.match(data, /label: 'Application["']/);
    assert.match(data, /id: 'theme', label: 'Themes["']/);
    assert.match(data, /id: 'foundations', label: 'Foundations["']/);
    assert.match(data, /id: 'text', label: 'Text["']/);
    assert.doesNotMatch(data, /typography|Typography/);
    assert.match(data, /id: 'skeleton-example', label: 'Skeleton["']/);
    assert.match(data, /id: 'surfaces-example', label: 'Surfaces["']/);
    assert.match(data, /id: 'scroll-area-example', label: 'ScrollArea["']/);
    assert.match(data, /id: 'icon-text-buttons-example', label: 'Icon text buttons["']/);
    assert.match(data, /id: 'context-menu-example', label: 'Context menu["']/);
    assert.match(data, /id: 'text-fields-example', label: 'Text fields["']/);
    assert.match(data, /id: 'inline-edit-example', label: 'Inline edit["']/);
    assert.match(data, /id: 'selects-example', label: 'Selects["']/);
    assert.match(data, /id: 'choice-controls-example', label: 'Checkbox, switch, radio["']/);
    assert.match(data, /id: 'tabs-example', label: 'Tabs["']/);
    assert.match(data, /id: 'state-card-example', label: 'StateCard["']/);
    assert.match(data, /id: 'badges-example', label: 'Badge["']/);
    assert.match(
        data,
        /id: 'context-menu-example', label: 'Context menu'[\s\S]*?id: 'state-card-example', label: 'StateCard'[\s\S]*?id: 'badges-example', label: 'Badge'[\s\S]*?key: 'fields["']/,
    );
    assert.match(data, /id: 'icon-text-example', label: 'IconText["']/);
    assert.match(data, /id: 'data-table-example', label: 'DataTable["']/);
    assert.match(data, /id: 'table-primitives-example', label: 'Table and pagination["']/);
    assert.match(data, /id: 'toast-example', label: 'Toast["']/);
    assert.match(data, /id: 'app-shell-example', label: 'AppShell["']/);
    assert.match(data, /id: 'app-sidebar-example', label: 'AppSidebar["']/);
    assert.match(data, /id: 'special-modal-example', label: 'SpecialModal["']/);
    assert.doesNotMatch(
        data,
        /key: 'forms'|filterbar-example|standard-table-example|inline-state-example|InlineState|workflow-example|Workflow|scroll-highlights-example|Scroll highlights|id: 'data', label: 'Tables["']/,
    );
    assert.doesNotMatch(
        data,
        /Темы|Контракты|Типографика|Раскладка|Действия|Кнопки|Иконки|Состояния|Оверлеи/,
    );

    assert.match(
        page,
        /<ExampleThemePlayground[\s\S]*?<MemoFoundationsSection[\s\S]*?<MemoTextSection[\s\S]*?<MemoIconTextSection[\s\S]*?<MemoLayoutSection[\s\S]*?<MemoActionsSection[\s\S]*?<MemoFieldsSection[\s\S]*?<MemoSelectionSection[\s\S]*?<MemoStateCardSection[\s\S]*?<MemoBadgeSection[\s\S]*?<MemoDataSection[\s\S]*?<MemoOverlaysSection[\s\S]*?<MemoApplicationSection/,
    );
    assert.doesNotMatch(page, /TypographySection|MemoTypographySection/);
    assert.match(page, /function UiExampleSidebar/);
    assert.match(page, /navGroups\.map/);
    assert.doesNotMatch(page, /uiExampleNavIcon/);
    assert.doesNotMatch(page, /icon: uiExampleNavIcon/);
    assert.doesNotMatch(page, /oui-ui-sidebar-footer-action/);
    assert.match(page, /<AppSidebar[\s\S]*?className=["']oui-ui-main-sidebar["']/);
    assert.match(
        page,
        /<AppShellHeader[\s\S]*?navigationVisibility=["']mobile["'][\s\S]*?title=\{<UiExampleBrand compact \/>\}[\s\S]*?actions=\{/,
    );
    assert.match(
        page,
        /<Menu[\s\S]*?items=\{languageItems\}[\s\S]*?<IconButton[\s\S]*?className=["']oui-ui-language-button["'][\s\S]*?icon=\{<LuLanguages size=\{16\} \/>\}/,
    );
    assert.doesNotMatch(page, /oui-ui-language-switch|oui-ui-language-option|UiExampleHeaderTitle/);
    assert.doesNotMatch(page, /className=["']oui-ui-main-sidebar["'][\s\S]*?footer=\{\(/);
    assert.match(page, /<UiExampleSidebar onNavigate=\{\(\) => setMobileNavOpen\(false\)\} \/>/);
    assert.doesNotMatch(page, /sidebarNavItems/);
    assert.doesNotMatch(page, /AppShellNav|AppShellSidebar|oui-ui-sidebar-group-label/);
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
    const applicationSection = read('example/ExampleApplicationSection.tsx');
    const samples = read('example/codeSamples.ts');

    assert.match(actionsSection, /id=["']buttons-example["']/);
    assert.match(actionsSection, /id=["']icon-buttons-example["']/);
    assert.match(actionsSection, /badge=\{64\}/);
    assert.match(actionsSection, /badge=\{99\}/);
    assert.match(actionsSection, /badgeTone=["']warning["']/);
    assert.match(actionsSection, /LuMessageSquare/);
    assert.match(actionsSection, /LuSearch/);
    assert.match(actionsSection, /LuUpload/);
    assert.match(actionsSection, /id=["']icon-text-buttons-example["']/);
    assert.match(actionsSection, /id=["']context-menu-example["']/);
    assert.match(actionsSection, /IconTextButton/);
    assert.match(actionsSection, /ContextMenu/);
    assert.doesNotMatch(actionsSection, /id=["']actions["']/);
    assert.match(dataSection, /id=["']data-table-example["']/);
    assert.match(dataSection, /id=["']table-primitives-example["']/);
    assert.match(dataSection, /<Table[\s\S]*?<Pagination/);
    assert.doesNotMatch(dataSection, /id=["']data["']/);
    assert.match(foundationsSection, /id=["']foundations["']/);
    assert.match(stateSection, /id=["']state-card-example["']/);
    assert.match(stateSection, /id=["']badges-example["']/);
    assert.match(stateSection, /<Badge/);
    assert.match(stateSection, /icon=\{<LuClock3 \/>}/);
    assert.match(stateSection, /icon=\{<LuPackageCheck \/>}/);
    assert.match(stateSection, /v=["']surface["'][\s\S]*v=["']outline["'][\s\S]*v=["']ghost["']/);
    assert.match(stateSection, /titleTone=["']primary["']/);
    assert.match(stateSection, /id=["']icon-text-example["']/);
    assert.match(stateSection, /IconText/);
    assert.doesNotMatch(stateSection, /InlineState|oui-ui-inline-state-list/);
    assert.match(fieldsSection, /id=["']text-fields-example["']/);
    assert.match(fieldsSection, /<TextField size=\{1\} floatingLabel="Compact" \/>/);
    assert.match(fieldsSection, /<TextField[\s\S]*?size=\{4\}[\s\S]*?invalid/);
    assert.match(fieldsSection, /floatingColor="oklch\(78% 0\.18 330\)"/);
    assert.match(
        fieldsSection,
        /sectionColor="var\(--oui-primary-surface\)"[\s\S]*?<TextField[\s\S]*?floatingLabel="Workspace name"/,
    );
    assert.match(samples, /textFields:[\s\S]*?floatingLabel='Project title'/);
    assert.match(fieldsSection, /id=["']grouped-fields-example["']/);
    assert.match(fieldsSection, /<Section g=\{3\} p=\{4\}>/);
    assert.match(samples, /groupedFields:[\s\S]*?<Section g=\{3\} p=\{4\}>/);
    assert.match(fieldsSection, /id=["']inline-edit-example["']/);
    assert.match(fieldsSection, /InlineEditField/);
    assert.match(fieldsSection, /InlineEditMultiField/);
    assert.match(fieldsSection, /Single value without meta/);
    assert.match(fieldsSection, /selectedPaymentTerm/);
    assert.match(fieldsSection, /id=["']number-date-fields-example["']/);
    assert.match(fieldsSection, /id=["']date-range-example["']/);
    assert.doesNotMatch(fieldsSection, /id=["']fields["']/);
    assert.match(selectionSection, /id=["']selects-example["']/);
    assert.match(selectionSection, /EntityPicker wrapper, lower-level PaginatedCombobox/);
    assert.match(selectionSection, /PaginatedCombobox/);
    assert.match(selectionSection, /id=["']choice-controls-example["']/);
    assert.match(selectionSection, /id=["']tabs-example["']/);
    assert.doesNotMatch(selectionSection, /id=["']selection["']/);
    assert.match(overlaysSection, /id=["']overlay-primitives-example["']/);
    assert.match(overlaysSection, /Dialog\.Root/);
    assert.match(overlaysSection, /<Drawer/);
    assert.match(overlaysSection, /id=["']toast-example["']/);
    assert.match(overlaysSection, /id=["']overlay-settings-example["']/);
    assert.doesNotMatch(overlaysSection, /id=["']overlays["']/);
    assert.doesNotMatch(basicsSection, /id=["']app-shell-example["']/);
    assert.match(basicsSection, /id=["']flex-example["']/);
    assert.match(basicsSection, /id=["']stack-example["']/);
    assert.match(basicsSection, /id=["']collapse-example["']/);
    assert.match(basicsSection, /id=["']surfaces-example["']/);
    assert.match(basicsSection, /<Card/);
    assert.match(basicsSection, /<Alert/);
    assert.match(basicsSection, /id=["']grid-example["']/);
    assert.match(basicsSection, /id=["']scroll-area-example["']/);
    assert.doesNotMatch(basicsSection, /id=["']scroll-highlights-example["']/);
    assert.doesNotMatch(basicsSection, /id=["']layout["']/);
    assert.equal(
        (basicsSection.match(/className=["']oui-highlight-demo-surface["']/g) ?? []).length,
        1,
    );
    assert.equal((samples.match(/className=["']oui-highlight-demo-surface["']/g) ?? []).length, 1);
    assert.match(basicsSection, /Top and bottom highlights/);
    assert.doesNotMatch(basicsSection, /Top only<\/Text>|Useful when only the header edge/);
    assert.match(basicsSection, /title=["']ScrollArea["']/);
    assert.match(basicsSection, /Themed scroll container with optional edge highlights/);
    assert.match(basicsSection, /mode: 'static["']/);
    assert.match(basicsSection, /mode: 'scroll["']/);
    assert.doesNotMatch(
        basicsSection,
        /title=["']Scroll highlights'|Static scroll highlights|Scroll reveal highlights/,
    );
    assert.doesNotMatch(
        samples,
        /scrollAreaHighlights|scrollAreaRevealHighlights|Static scroll highlights|Scroll reveal highlights/,
    );
    assert.match(applicationSection, /id=["']app-shell-example["']/);
    assert.match(applicationSection, /id=["']app-sidebar-example["']/);
    assert.match(applicationSection, /id=["']special-modal-example["']/);
    assert.match(
        applicationSection,
        /<AppShell[\s\S]*?<AppShellHeader[\s\S]*?<AppSidebar[\s\S]*?<AppShellContent/,
    );
    assert.match(applicationSection, /onSidebarOpenChange=\{onMobileOpenChange\}/);
    assert.match(applicationSection, /navigationVisibility=["']mobile["']/);
    assert.match(applicationSection, /const \[appShellSidebarSide, setAppShellSidebarSide\]/);
    assert.match(applicationSection, /sidebarSide=\{appShellSidebarSide\}/);
    assert.match(applicationSection, /onToggleSidebarSide=\{\(\) =>/);
    assert.doesNotMatch(
        applicationSection,
        /<AppShellHeader[\s\S]*?<DemoShellBrand \/>[\s\S]*?<\/AppShellHeader>/,
    );
    assert.doesNotMatch(
        applicationSection,
        /<AppShellHeader[\s\S]*?LuArrowLeftRight[\s\S]*?<\/AppShellHeader>/,
    );
    assert.match(
        applicationSection,
        /<AppSidebar[\s\S]*?side=\{sidebarSide\}[\s\S]*?LuArrowLeftRight[\s\S]*?onClick=\{onToggleSidebarSide\}/,
    );
    assert.doesNotMatch(applicationSection, /onSidebarSideChange|setShellSidebarSide/);
    assert.doesNotMatch(applicationSection, /desktopOpen|onDesktopOpenChange|setShellSidebarOpen/);
    assert.match(applicationSection, /<AppSidebar/);
    assert.match(applicationSection, /header=\{/);
    assert.match(applicationSection, /onNavigate=\{\(item\) => setSidebarActiveKey\(item\.key\)\}/);
    assert.match(applicationSection, /onNavigate=\{\(item\) => setShellActiveKey\(item\.key\)\}/);
    assert.match(applicationSection, /<SpecialModal/);
    assert.doesNotMatch(
        applicationSection,
        /WorkflowSummaryBar|<Pipeline|<Timeline|LifecycleActionPanel/,
    );
    assert.match(samples, /iconTextButton:/);
    assert.match(samples, /iconButtons:/);
    assert.match(samples, /badge=\{64\}/);
    assert.match(samples, /badge=["']new["']/);
    assert.match(samples, /LuMessageSquare/);
    assert.match(samples, /contextMenu:/);
    assert.match(samples, /inlineEdit:/);
    assert.match(samples, /tablePagination:/);
    assert.match(samples, /appSidebar:/);
    assert.match(
        samples,
        /appShell: `import \{useState\} from 'react';[\s\S]*?AppShellHeader[\s\S]*?AppSidebar[\s\S]*?AppShellContent/,
    );
    assert.match(samples, /onSidebarOpenChange=\{setMobileOpen\}/);
    assert.match(samples, /navigationVisibility=["']mobile["']/);
    assert.doesNotMatch(
        samples,
        /<AppShellHeader[\s\S]*?LuArrowLeftRight[\s\S]*?<\/AppShellHeader>/,
    );
    assert.match(samples, /type AppShellSide/);
    assert.match(
        samples,
        /const \[sidebarSide, setSidebarSide\] = useState<AppShellSide>\('left'\)/,
    );
    assert.match(samples, /sidebarSide=\{sidebarSide\}/);
    assert.match(
        samples,
        /<AppSidebar[\s\S]*?side=\{sidebarSide\}[\s\S]*?LuArrowLeftRight[\s\S]*?onClick=\{toggleSidebarSide\}/,
    );
    assert.doesNotMatch(samples, /desktopOpen|setShellSidebarOpen/);
    assert.match(samples, /header=\{/);
    assert.doesNotMatch(samples, /AppShellNav|AppShellSidebar/);
    assert.match(samples, /specialModal:/);
    assert.doesNotMatch(
        samples,
        /workflow:|WorkflowSummaryBar|<Pipeline|<Timeline|LifecycleActionPanel/,
    );
});

test('AppSidebar exposes composable header and footer slots', () => {
    const appSidebar = read('components/AppSidebar/AppSidebar.tsx');
    const appSidebarStyles = read('styles/_app-sidebar.sass');
    const applicationSection = read('example/ExampleApplicationSection.tsx');
    const samples = read('example/codeSamples.ts');

    assert.match(appSidebar, /header\?: ReactNode/);
    assert.match(appSidebar, /footer\?: ReactNode/);
    assert.doesNotMatch(appSidebar, /title\?: ReactNode/);
    assert.doesNotMatch(appSidebar, /logo\?: ReactNode/);
    assert.doesNotMatch(appSidebar, /actions\?: ReactNode/);
    assert.match(appSidebar, /const indicatorPlacedRef = useRef\(false\)/);
    assert.match(appSidebar, /const updateActiveIndicator = useCallback\(\(animate = true\)/);
    assert.match(appSidebar, /new ResizeObserver\(scheduleUpdate\)/);
    assert.match(appSidebar, /activeItem\.offsetHeight/);
    assert.match(appSidebar, /sidebarItemOffsetTop\(root, activeItem\)/);
    assert.match(appSidebar, /function sidebarItemOffsetTop/);
    assert.match(appSidebar, /node = node\.offsetParent as HTMLElement \| null/);
    assert.match(appSidebar, /indicator\.dataset\.ready = 'false'/);
    assert.match(appSidebar, /indicator\.dataset\.ready = 'true'/);
    assert.match(appSidebar, /else \{\s+indicator\.dataset\.ready = 'true';\s+\}/);
    assert.doesNotMatch(appSidebar, /style\.transition/);
    assert.match(appSidebar, /updateActiveIndicator\(false\)/);
    assert.match(appSidebar, /requestAnimationFrame\(\(\) => updateActiveIndicator\(\)\)/);
    assert.match(
        appSidebarStyles,
        /\.oui-app-sidebar-indicator\s+[\s\S]*transition: transform 600ms/,
    );
    assert.match(
        appSidebarStyles,
        /\.oui-app-sidebar-head\s+display: flex[\s\S]*?flex: 0 0 var\(--oui-app-shell-header-h, 61px\)[\s\S]*?min-height: var\(--oui-app-shell-header-h, 61px\)/,
    );
    assert.match(applicationSection, /className=["']oui-app-sidebar-brand["']/);
    assert.match(samples, /className=["']oui-app-sidebar-brand["']/);
    assert.match(samples, /oui-app-sidebar-title["']>Workspace</);
});

test('UI example keeps forms out of the foundation demo', () => {
    const fields = read('example/ExampleFieldsSection.tsx');
    const samples = read('example/codeSamples.ts');

    assert.doesNotMatch(
        fields,
        /react-hook-form|<Form|FormSection|FormActions|FormSubmitButton|FormTextField|FormSelect/,
    );
    assert.doesNotMatch(samples, /react-hook-form|FormSubmitButton|FormSection/);
    assert.match(fields, /Layout primitives group fields without owning state/);
});

test('UI example selection data follows current locale', () => {
    const page = read('example/UiExamplePage.tsx');
    const selection = read('example/ExampleSelectionSection.tsx');
    const overlays = read('example/ExampleOverlays.tsx');
    const data = read('example/exampleData.ts');

    assert.match(page, /<MemoSelectionSection[\s\S]*?locale=\{locale\}/);
    assert.match(page, /<ExampleOverlays[\s\S]*?locale=\{locale\}/);
    assert.match(selection, /getOptionItems\(locale\)/);
    assert.match(selection, /getOwnerItems\(locale\)/);
    assert.match(selection, /loadEntityPage\(locale, page, search\)/);
    assert.match(overlays, /const commandItems = getCommandItems\(locale\)/);
    assert.match(data, /const enOptionItems: ListboxItem\[\] = \[[\s\S]*?label: 'In progress["']/);
    assert.match(data, /const enOwnerItems = \[[\s\S]*?label: 'Operations team["']/);
    assert.match(
        data,
        /const enEntityOptions: EntityOption\[\] = Array\.from[\s\S]*?name: `Entity \$\{index \+ 1\}`/,
    );
    assert.match(data, /export function getCommandItems\(locale: OrcestrUiLocale\)/);
});

test('UI example DataTable demo keeps controls compact', () => {
    const dataSection = read('example/ExampleDataSection.tsx');
    const styles = read('styles/_example.sass');
    const dataStyles = read('styles/_data.sass');
    const samples = read('example/codeSamples.ts');

    assert.match(dataSection, /className=["']oui-ui-table-tile["']/);
    assert.match(dataSection, /className=["']oui-ui-table-demo["']/);
    assert.match(
        dataSection,
        /<DataTable[\s\S]*?toolbar=\{[\s\S]*?<TextField[\s\S]*?<Button[\s\S]*?size=\{3\}[\s\S]*?v=["']surface["'][\s\S]*?Reset\s*<\/Button>/,
    );
    assert.match(dataSection, /Plain table/);
    assert.match(
        dataSection,
        /const \[plainSort, setPlainSort\] = useState<DataTableSort \| null>/,
    );
    assert.match(dataSection, /rows=\{sortRows\(rows\.slice\(0, 4\), plainSort\)\}/);
    assert.match(dataSection, /sort=\{plainSort\}/);
    assert.match(dataSection, /onSortChange=\{\(nextSort\) =>[\s\S]*?setPlainSort\(/);
    assert.doesNotMatch(dataSection, /Reset table|oui-ui-table-demo-toolbar|pinned: 'left["']/);
    assert.match(
        samples,
        /toolbar=\{[\s\S]*?<TextField[\s\S]*?<Button onClick=\{resetTable\}>Reset<\/Button>/,
    );
    assert.match(samples, /rows=\{rows\.slice\(0, 4\)\}/);
    assert.match(
        styles,
        /\.oui-ui-table-demo\s+display: flex[\s\S]*?flex-direction: column[\s\S]*?gap: 12px/,
    );
    assert.match(
        styles,
        /\.oui-ui-table-variants\s+display: grid[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/,
    );
    assert.match(styles, /\.oui-ui-table-variant\s+display: flex[\s\S]*?flex-direction: column/);
    assert.match(
        dataStyles,
        /\.oui-data-table-toolbar\s+display: flex[\s\S]*?align-items: stretch[\s\S]*?gap: 8px/,
    );
    assert.match(
        dataStyles,
        /\.oui-data-table-toolbar-content\s+display: flex[\s\S]*?flex: 1 1 auto/,
    );
    assert.match(
        dataStyles,
        /\.oui-data-table-toolbar-content > \.oui-text-field\s+flex: 1 1 240px/,
    );
    assert.match(styles, /\.oui-ui-table-tile\s+align-items: flex-start/);
    assert.match(
        styles,
        /\.oui-ui-table-tile \.oui-ui-table-demo,[\s\S]*?\.oui-ui-table-tile \.oui-data-table-wrap\s+flex: 1 1 auto/,
    );
    assert.match(styles, /\.oui-ui-table-tile \.oui-code-inline-panel\s+align-self: flex-start/);
});

test('UI example cards show one title and keep imports only in code preview', () => {
    const page = read('example/UiExamplePage.tsx');
    const preview = read('example/CodePreview.tsx');
    const styles = read('styles/_example.sass');

    assert.match(page, /import \{[\s\S]*?memo,[\s\S]*?useCallback/);
    assert.match(page, /const MemoSelectionSection = memo\(SelectionSection\)/);
    assert.match(page, /const MemoApplicationSection = memo\(ApplicationSection\)/);
    assert.match(page, /const openPalette = useCallback\(\(\) => setPaletteOpen\(true\), \[\]\)/);
    assert.match(page, /<MemoSelectionSection[\s\S]*?tabValue=\{tabValue\}/);
    assert.doesNotMatch(preview, /ORCESTR_UI_IMPORT_PATTERN|importedComponentNames/);
    assert.doesNotMatch(preview, /className=["']oui-ui-import-line["']|function importStatement/);
    assert.doesNotMatch(
        preview,
        /oui-ui-component-list|oui-ui-component-name|oui-ui-tile-title-block|oui-ui-tile-title/,
    );
    assert.match(preview, /export function InlineCodeBlock/);
    assert.match(preview, /data-collapsible=\{collapsible \? 'true' : 'false'\}/);
    assert.doesNotMatch(
        preview,
        /onWheelCapture|handleWheelCapture|normalizedWheelDeltaY|scrollRoot\.scrollTop/,
    );
    assert.doesNotMatch(preview, /ResizeObserver|useLayoutEffect|scrollHeight/);
    assert.match(preview, /'--oui-code-lines': lineCount/);
    assert.match(preview, /Show code/);
    assert.match(preview, /Hide code/);
    assert.match(
        styles,
        /\.oui-ui-tile-head\s+display: none[\s\S]*?min-width: 0[\s\S]*?flex-wrap: wrap/,
    );
    assert.match(
        styles,
        /\.oui-code-inline-panel\s+position: relative[\s\S]*?--oui-code-collapsed-height: 180px[\s\S]*?--oui-code-expanded-height: calc/,
    );
    assert.match(
        styles,
        /\.oui-ui-section\s+container-type: inline-size[\s\S]*?content-visibility: auto[\s\S]*?contain-intrinsic-size: auto 560px/,
    );
    assert.match(
        styles,
        /\.oui-code-inline-panel\s+position: relative[\s\S]*?align-self: flex-start[\s\S]*?height: var\(--oui-code-collapsed-height\)[\s\S]*?contain: layout paint style[\s\S]*?transition: height 460ms/,
    );
    assert.doesNotMatch(styles, /will-change: height/);
    assert.match(
        styles,
        /\.oui-code-inline-panel\[data-expanded="true"\]\s+height: var\(--oui-code-expanded-height\)/,
    );
    assert.match(
        styles,
        /\.oui-code-inline-fade\s+position: absolute[\s\S]*?height: 92px[\s\S]*?transition: opacity 180ms/,
    );
    assert.match(preview, /<CodeBlock code=\{code\} mode=["']inline["'] \/>/);
    assert.match(
        preview,
        /<ScrollArea[\s\S]*?className=["']oui-code-preview-scroll oui-code-preview-scroll-inline["'][\s\S]*?scrollbars=["']horizontal["']/,
    );
    assert.match(
        styles,
        /\.oui-code-preview-scroll-inline \.oui-scroll-area-viewport\s+max-height: none[\s\S]*?overflow-x: auto[\s\S]*?overflow-y: hidden[\s\S]*?overscroll-behavior-x: contain[\s\S]*?overscroll-behavior-y: auto/,
    );
    assert.match(styles, /\.oui-code-inline-panel \.oui-code-preview\s+padding-bottom: 42px/);
    assert.match(
        styles,
        /\.oui-ui-app-shell-preview-stage\[data-mode="phone"\]\s+width: min\(100%, 410px\)[\s\S]*?border-radius: 14px/,
    );
    assert.match(
        styles,
        /\.oui-ui-app-shell-preview-stage \.oui-app-shell\[data-has-header="true"\] \.oui-app-shell-frame\s+height: 100%/,
    );
    assert.match(
        styles,
        /\.oui-ui-app-shell-preview-stage \.oui-app-shell\[data-sidebar-mode="mobile"\] \.oui-app-shell-frame,[\s\S]*?\.oui-ui-app-shell-preview-stage \.oui-app-shell\[data-sidebar-mode="mobile"\]\[data-has-header="true"\] \.oui-app-shell-frame\s+height: 100%/,
    );
    assert.match(
        styles,
        /\.oui-ui-app-shell-preview-stage\[data-mode="phone"\] \.oui-app-shell-header\s+padding: 8px 18px 8px 10px/,
    );
    assert.doesNotMatch(
        styles,
        /\.oui-code-inline-panel[\s\S]*?\.oui-scroll-area-viewport\s+overflow-y: auto/,
    );
    assert.match(styles, /@media \(max-width: 860px\)[\s\S]*?\.oui-ui-tile-head\s+display: flex/);
    assert.doesNotMatch(
        styles,
        /\.oui-ui-import-line|\.oui-ui-tile-title-block|\.oui-ui-tile-title/,
    );
});

test('UI example starts with editable theme playground presets', () => {
    const page = read('example/UiExamplePage.tsx');
    const playground = read('example/ExampleThemePlayground.tsx');

    assert.match(page, /ExampleThemePlayground/);
    assert.match(page, /<ExampleThemePlayground[\s\S]*?locale=\{locale\}/);
    assert.match(page, /<UiExampleThemeRail[\s\S]*?locale=\{locale\}/);
    assert.match(page, /themePresetLabel\(preset, locale\)/);
    assert.match(page, /themeOverrides={themeOverrides}/);
    assert.match(playground, /id: 'deep-black["']/);
    assert.match(playground, /id: 'midnight["']/);
    assert.match(playground, /id: 'porcelain["']/);
    assert.match(playground, /label: \{[\s\S]*?en: 'Porcelain["']/);
    assert.match(playground, /function themePresetLabel/);
    assert.match(playground, /themePresetLabel\(preset, locale\)/);
    assert.match(playground, /themePlaygroundCopy/);
    assert.match(playground, /en: \{[\s\S]*?title: 'Theme playground["']/);
    assert.match(playground, /oui-theme-preset-scroll/);
    assert.match(playground, /type=["']color["']/);
    assert.match(playground, /type=["']range["']/);
    assert.match(playground, /CopyButton/);
    assert.match(playground, /serializeTheme\(theme\)/);
    assert.match(playground, /Record<FlatTokenSection, true>/);
    assert.match(playground, /parseEditableThemeColor/);
    assert.match(playground, /flatTokenSections/);
    assert.match(playground, /statusKeys/);
});

test('theme opacity editor uses the shared dismissible Popover', () => {
    const source = read('example/ExampleThemePlayground.tsx');

    assert.match(source, /<Popover[\s\S]*?className="oui-theme-token-opacity-popover"/);
    assert.match(source, /className="oui-theme-token-opacity-trigger"/);
    assert.doesNotMatch(source, /<details className="oui-theme-token-opacity-menu"/);
});

test('UI example shell uses Drawer-backed mobile sidebar and stable hash navigation', () => {
    const page = read('example/UiExamplePage.tsx');
    const shell = read('components/AppShell/AppShell.tsx');
    const drawer = read('components/Drawer/Drawer.tsx');
    const shellStyles = read('styles/_shell.sass');
    const drawerStyles = read('styles/_drawer.sass');

    assert.match(
        drawer,
        /onPointerDown=\{\(event\) => \{[\s\S]*?event\.preventDefault\(\);[\s\S]*?setOpen\(false\);/,
    );
    assert.match(page, /header=\{<UiExampleBrand \/>/);
    assert.match(page, /title=\{<UiExampleBrand compact \/>\}/);
    assert.match(page, /function UiExampleSidebar/);
    assert.match(page, /<AppSidebar[\s\S]*?className=["']oui-ui-main-sidebar["']/);
    assert.match(page, /const \[activeSection, setActiveSection\] = useState\('theme'\)/);
    assert.match(page, /function scrollUiExampleSection/);
    assert.match(page, /const UI_EXAMPLE_SCROLL_LEAD = 50/);
    assert.match(page, /const UI_EXAMPLE_ACTIVE_PROBE_OFFSET = UI_EXAMPLE_SCROLL_LEAD \+ 220/);
    assert.match(page, /const UI_EXAMPLE_CLICK_TARGET_TOP_TOLERANCE = 180/);
    assert.match(page, /const UI_EXAMPLE_SCROLL_LOCK_TIMEOUT_MS = 1600/);
    assert.match(page, /function uiExampleSectionScrollTop/);
    assert.match(page, /behavior: ScrollBehavior = 'auto["']/);
    assert.match(page, /function uiExampleSectionAbsoluteTop/);
    assert.match(page, /node\.getBoundingClientRect\(\)\.top/);
    assert.match(page, /scrollRoot\.getBoundingClientRect\(\)\.top/);
    assert.match(page, /targetTop - UI_EXAMPLE_SCROLL_LEAD/);
    assert.match(page, /top: uiExampleSectionScrollTop\(node, scrollRoot\)/);
    assert.match(page, /scrollNavigationTargetRef/);
    assert.match(page, /const setActiveSectionValue = useCallback/);
    assert.match(page, /if \(lockedTarget\)/);
    assert.match(page, /const targetTop = uiExampleSectionScrollTop\(targetNode, scrollRoot\)/);
    assert.match(page, /UI_EXAMPLE_CLICK_TARGET_TOP_TOLERANCE/);
    assert.match(
        page,
        /const bottomDistance =[\s\S]*?scrollRoot\.scrollHeight - scrollRoot\.clientHeight - scrollRoot\.scrollTop/,
    );
    assert.match(page, /const top = scrollRoot\.scrollTop \+ UI_EXAMPLE_ACTIVE_PROBE_OFFSET/);
    assert.match(page, /uiExampleSectionAbsoluteTop\(node, scrollRoot\) <= top/);
    assert.match(page, /bottomDistance <= 2[\s\S]*?nodes\.at\(-1\)\?\.id/);
    assert.match(
        page,
        /if \(next && next !== activeSectionRef\.current\) setActiveSectionValue\(next\)/,
    );
    assert.match(page, /requestAnimationFrame\(updateActiveSection\)/);
    assert.doesNotMatch(page, /uiExampleNavCopy/);
    assert.match(page, /scrollUiExampleSection\(id, 'smooth'\)/);
    assert.doesNotMatch(
        page,
        /addEventListener\('wheel'|preventDefault\(\)|SMOOTH_WHEEL|normalizedUiExampleWheelDelta|clampUiExampleScrollTop/,
    );
    assert.match(
        page,
        /scrollRoot\.addEventListener\('scroll', requestUpdateActiveSection, \{\s*passive: true\s*\}\)/,
    );
    assert.match(shell, /<Drawer/);
    assert.match(shell, /export type AppShellSide = 'left' \| 'right["']/);
    assert.match(shell, /sidebarSide\?: AppShellSide/);
    assert.match(shell, /desktopSidebarOpen\?: boolean/);
    assert.match(shell, /headerHeight\?: number \| string/);
    assert.match(shell, /navigationVisibility\?: 'always' \| 'mobile["']/);
    assert.match(shell, /data-navigation-visibility=\{navigationVisibility\}/);
    assert.match(shell, /mobileBreakpoint\?: number/);
    assert.match(shell, /mobileBreakpoint = 860/);
    assert.match(shell, /window\.matchMedia\(`\(max-width: \$\{mobileBreakpoint\}px\)`\)/);
    assert.match(shell, /\}, \[mobileBreakpoint, sidebarMode\]\)/);
    assert.match(shell, /data-sidebar-side=\{sidebarSide\}/);
    assert.match(shell, /data-sidebar-mode=\{drawerMode \? 'mobile' : 'desktop'\}/);
    assert.match(shell, /data-desktop-sidebar-open=\{desktopSidebarOpen \? 'true' : 'false'\}/);
    assert.match(shell, /data-has-header=\{header \? 'true' : undefined\}/);
    assert.match(
        shell,
        /<main className=["']oui-app-shell-main["']>\s*\{header\}\s*\{children\}\s*<\/main>/,
    );
    assert.doesNotMatch(
        shell,
        /data-testid=\{testId\}[\s\S]*?>\s*\{header\}\s*<div className=["']oui-app-shell-frame["']/,
    );
    assert.match(shell, /const \[drawerPortalContainer, setDrawerPortalContainer\]/);
    assert.match(shell, /drawerMode && drawerPortalContainer \? \(/);
    assert.match(shell, /lockScroll=\{false\}/);
    assert.match(shell, /portalContainer=\{drawerPortalContainer\}/);
    assert.match(shell, /backdropClassName=["']oui-app-shell-sidebar-drawer-overlay["']/);
    assert.match(shell, /side=\{sidebarSide\}/);
    assert.match(shell, /oui-app-shell-sidebar-drawer-panel/);
    assert.match(shell, /className=["']oui-app-shell-drawer-root["']/);
    assert.match(shell, /className=["']oui-app-shell-sidebar-head-main["']/);
    assert.match(shell, /<div className=["']oui-app-shell-sidebar-body["']>\{children\}<\/div>/);
    assert.match(drawer, /portalContainer\?: HTMLElement \| null/);
    assert.match(drawer, /<Portal container=\{portalContainer\}>/);
    assert.match(shellStyles, /\.oui-app-shell\s+position: relative[\s\S]*?isolation: isolate/);
    assert.match(
        shellStyles,
        /\.oui-app-shell-drawer-root\s+position: absolute[\s\S]*?inset: 0[\s\S]*?overflow: hidden/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell-drawer-root \.oui-drawer-layer\s+position: absolute[\s\S]*?inset: 0/,
    );
    assert.match(shellStyles, /\.oui-app-shell-sidebar-desktop/);
    assert.match(
        shellStyles,
        /\.oui-app-shell-main\s+display: flex[\s\S]*?grid-column: 2[\s\S]*?grid-row: 1/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell-header\s+position: relative[\s\S]*?min-height: var\(--oui-app-shell-header-h, 56px\)/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell-header-nav-button\[data-navigation-visibility="mobile"\]\s+display: none/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell\[data-sidebar-mode="mobile"\] \.oui-app-shell-header-nav-button\[data-navigation-visibility="mobile"\]\s+display: inline-flex/,
    );
    assert.doesNotMatch(
        shellStyles,
        /\.oui-app-shell\[data-has-header="true"\] \.oui-app-shell-frame\s+height: calc/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell-sidebar-desktop\s+grid-column: 1[\s\S]*?grid-row: 1/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell-frame\s+display: grid[\s\S]*?width: 100%[\s\S]*?transition: grid-template-columns 340ms ease/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell-sidebar-desktop\s+grid-column: 1[\s\S]*?width: 100%[\s\S]*?overflow: hidden[\s\S]*?transition: transform 340ms ease, opacity 220ms ease/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell\[data-desktop-sidebar-open="false"\] \.oui-app-shell-frame\s+grid-template-columns: 0 minmax\(0, 1fr\)/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell\[data-desktop-sidebar-open="false"\] \.oui-app-shell-sidebar-desktop\s+opacity: 0[\s\S]*?pointer-events: none[\s\S]*?transform: translateX\(calc\(var\(--oui-app-shell-sidebar-width, 260px\) \* -1\)\)/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell\[data-sidebar-side="right"\] \.oui-app-shell-frame\s+grid-template-columns: minmax\(0, 1fr\) minmax\(220px, var\(--oui-app-shell-sidebar-width, 260px\)\)/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell\[data-sidebar-side="right"\]\[data-desktop-sidebar-open="false"\] \.oui-app-shell-frame\s+grid-template-columns: minmax\(0, 1fr\) 0/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell\[data-sidebar-side="right"\] \.oui-app-shell-sidebar-desktop\s+grid-column: 2/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell\[data-sidebar-side="right"\]\[data-desktop-sidebar-open="false"\] \.oui-app-shell-sidebar-desktop\s+transform: translateX\(var\(--oui-app-shell-sidebar-width, 260px\)\)/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell\[data-sidebar-side="right"\] \.oui-app-shell-main\s+grid-column: 1/,
    );
    assert.match(shellStyles, /\.oui-app-shell\[data-sidebar-mode="mobile"\]\s+padding: 0/);
    assert.match(
        shellStyles,
        /\.oui-app-shell\[data-sidebar-mode="mobile"\] \.oui-app-shell-frame\s+width: 100%[\s\S]*?height: 100dvh[\s\S]*?grid-template-columns: 1fr/,
    );
    assert.doesNotMatch(
        shellStyles,
        /\.oui-app-shell\[data-sidebar-mode="mobile"\]\[data-has-header="true"\] \.oui-app-shell-frame\s+height: calc/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell\[data-sidebar-mode="mobile"\] \.oui-app-shell-main\s+grid-column: 1[\s\S]*?grid-row: 1/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell\[data-sidebar-mode="mobile"\] \.oui-drawer-panel\.oui-app-shell-sidebar-drawer-panel\[data-side="left"\],[\s\S]*?\.oui-app-shell\[data-sidebar-mode="mobile"\] \.oui-drawer-panel\.oui-app-shell-sidebar-drawer-panel\[data-side="right"\]\s+width: min\(88vw, max\(var\(--oui-drawer-size, 300px\), 300px\)\)[\s\S]*?background: transparent[\s\S]*?border: 0[\s\S]*?box-shadow: none/,
    );
    assert.match(shellStyles, /\.oui-app-shell-sidebar\s+position: relative[\s\S]*?padding: 0/);
    assert.match(shellStyles, /--oui-app-shell-sidebar-body-pad: 12px 8px 18px 18px/);
    assert.match(
        shellStyles,
        /\.oui-app-shell-sidebar-head\s+display: flex[\s\S]*?padding: var\(--oui-app-shell-sidebar-head-pad\)/,
    );
    assert.match(shellStyles, /\.oui-app-shell-sidebar-scroll\s+display: flex[\s\S]*?width: 100%/);
    assert.match(
        shellStyles,
        /\.oui-app-shell-sidebar-body\s+min-width: 0[\s\S]*?padding: var\(--oui-app-shell-sidebar-body-pad\)/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-app-shell-header[\s\S]*?min-height: 48px/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-app-shell-header > \.oui-icon-button\s+width: 32px[\s\S]*?height: 32px[\s\S]*?min-height: 32px/,
    );
    assert.match(shellStyles, /@media \(max-width: 860px\)[\s\S]*?height: 100dvh/);
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-drawer-backdrop\.oui-app-shell-sidebar-drawer-overlay\s+background: transparent/,
    );
    assert.doesNotMatch(
        shellStyles,
        /calc\(100vh - \(var\(--oui-app-shell-inset, 28px\) \* 2\) - var\(--oui-app-shell-header-h, 56px\)\)/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-drawer-panel\.oui-app-shell-sidebar-drawer-panel\[data-side="left"\],[\s\S]*?\.oui-drawer-panel\.oui-app-shell-sidebar-drawer-panel\[data-side="right"\]\s+width: min\(88vw, max\(var\(--oui-drawer-size, 300px\), 300px\)\)[\s\S]*?background: transparent[\s\S]*?border: 0[\s\S]*?box-shadow: none/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-drawer-panel\.oui-app-shell-sidebar-drawer-panel\[data-side="left"\]\s+border-radius: 0 14px 14px 0/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-drawer-panel\.oui-app-shell-sidebar-drawer-panel\[data-side="right"\]\s+border-radius: 14px 0 0 14px/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-app-shell-sidebar-drawer-body\s+display: flex[\s\S]*?overflow: hidden[\s\S]*?background: transparent[\s\S]*?padding: 0/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-app-shell-sidebar-drawer-body > \.oui-app-sidebar\s+width: 100%[\s\S]*?height: 100%[\s\S]*?border-radius: 0 14px 14px 0[\s\S]*?box-shadow: 8px 0 24px rgb\(0 0 0 \/ 8%\)/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-drawer-panel\[data-side="right"\] \.oui-app-shell-sidebar-drawer-body > \.oui-app-sidebar\s+border-radius: 14px 0 0 14px[\s\S]*?box-shadow: -8px 0 24px rgb\(0 0 0 \/ 8%\)/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-app-shell-sidebar-drawer-body \.oui-app-sidebar-head\s+flex: 0 0 48px[\s\S]*?min-height: 48px[\s\S]*?border-bottom: 0[\s\S]*?padding: 0 8px/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-app-shell-sidebar-drawer-body \.oui-app-sidebar-content\s+padding: 6px 8px 12px/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?--oui-app-shell-sidebar-body-pad: 6px 8px 12px[\s\S]*?background: var\(--oui-bg\)/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-app-shell-sidebar::before\s+display: none/,
    );
    assert.doesNotMatch(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?backdrop-filter: blur\(24px\)/,
    );
    assert.match(shellStyles, /\.oui-app-shell-content-scroll\s+flex: 1 1 auto[\s\S]*?padding: 0/);
    assert.match(shell, /className="oui-app-shell-content-scroll"[\s\S]*?scrollbars="vertical"/);
    assert.match(
        shellStyles,
        /\.oui-app-shell-content-scroll > \.oui-scroll-area-viewport\s+height: 100%[\s\S]*?scroll-padding: 8px 28px 24px 22px/,
    );
    assert.match(
        shellStyles,
        /\.oui-app-shell-content\s+display: flex[\s\S]*?padding: 0 28px 24px 22px/,
    );
    assert.match(
        shellStyles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-app-shell-content\s+padding: 12px 10px 18px/,
    );
    assert.match(drawerStyles, /\.oui-drawer-panel\[data-side="left"\]/);
    assert.match(
        drawerStyles,
        /\.oui-drawer-panel\[data-side="left"\]\[data-state="opening"\]\s+animation: ouiDrawerLeftIn/,
    );
    assert.match(
        drawerStyles,
        /@keyframes ouiDrawerLeftIn[\s\S]*?transform: translateX\(-105%\)[\s\S]*?transform: translate\(0, 0\)/,
    );
    assert.doesNotMatch(shellStyles, /oui-app-shell-sidebar-backdrop/);
});

test('UI example can use host-controlled locale', () => {
    const page = read('example/UiExamplePage.tsx');

    assert.match(page, /export type UiExamplePageProps = \{/);
    assert.match(page, /locale\?: OrcestrUiLocale/);
    assert.match(page, /onLocaleChange\?: \(locale: OrcestrUiLocale\) => void/);
    assert.match(page, /locale: controlledLocale/);
    assert.match(page, /const locale = controlledLocale \?\? internalLocale/);
    assert.match(page, /if \(onLocaleChange\) \{/);
    assert.match(page, /onLocaleChange\(nextLocale\)/);
    assert.match(page, /setInternalLocale\(nextLocale\)/);
});

test('UI example and state components use container-safe layouts', () => {
    const styles = read('styles/_example.sass');
    const stateStyles = read('styles/_state.sass');
    const badgeSource = read('components/Badge/Badge.tsx');
    const badgeStyles = read('styles/_badge.sass');
    const iconTextStyles = read('styles/_icon-text.sass');
    const scrollAreaStyles = read('styles/_scroll-area.sass');
    const stateSource = read('components/State/State.tsx');
    const stateSection = read('example/ExampleStateSection.tsx');

    assert.match(styles, /\.oui-ui-section\s+container-type: inline-size/);
    assert.doesNotMatch(styles, /scroll-behavior: smooth/);
    assert.match(
        styles,
        /@container \(max-width: 980px\)[\s\S]*?\.oui-ui-tile-body\s+flex-basis: auto/,
    );
    assert.match(
        styles,
        /@media \(max-width: 860px\)[\s\S]*?\.oui-ui-tile-body\s+flex-basis: auto/,
    );
    assert.match(styles, /\.oui-theme-preview\s+display: flex[\s\S]*?overflow: hidden/);
    assert.match(
        styles,
        /\.oui-theme-token-grid\s+display: grid[\s\S]*?repeat\(auto-fit, minmax\(min\(100%, 250px\), 1fr\)\)/,
    );
    assert.match(
        scrollAreaStyles,
        /\.oui-scroll-area-highlight-overlay\s+position: absolute[\s\S]*?z-index: calc\(var\(--oui-z-sticky, 20\) \+ 10\)/,
    );
    assert.doesNotMatch(styles, /oui-ui-dashboard-grid|oui-ui-media-compare-demo|oui-chat-shell/);
    assert.match(
        stateStyles,
        /\.oui-state-card\s+display: grid[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto[\s\S]*?container-type: inline-size/,
    );
    assert.match(
        stateStyles,
        /\.oui-state-card\s+display: grid[\s\S]*?border: 1px solid transparent/,
    );
    assert.match(
        stateStyles,
        /\.oui-state-card-main\s+display: flex[\s\S]*?flex-direction: column/,
    );
    assert.match(
        iconTextStyles,
        /\.oui-icon-text\s+display: inline[\s\S]*?overflow-wrap: anywhere/,
    );
    assert.match(
        iconTextStyles,
        /\.oui-icon-text-icon\s+display: inline-flex[\s\S]*?width: 1em[\s\S]*?height: 1em/,
    );
    assert.match(
        iconTextStyles,
        /\.oui-icon-text-icon svg\s+display: block[\s\S]*?width: 100%[\s\S]*?height: 100%/,
    );
    assert.match(stateStyles, /\.oui-state-card\s+display: grid[\s\S]*?font-size: 14px/);
    assert.match(stateStyles, /\.oui-state-card-body\s+display: flex[\s\S]*?gap: 4px/);
    assert.match(stateSource, /titleFs\?: SystemProps\['fs'\]/);
    assert.match(stateSource, /descriptionFs\?: SystemProps\['fs'\]/);
    assert.match(stateSource, /v\?: StateCardVariant/);
    assert.match(stateSource, /titleTone\?: TextProps\['tone'\]/);
    assert.match(stateSource, /descriptionTone\?: TextProps\['tone'\]/);
    assert.match(badgeSource, /icon\?: ReactNode/);
    assert.match(badgeSource, /className=["']oui-badge-icon["']/);
    assert.match(
        badgeStyles,
        /\.oui-badge-icon\s+display: inline-flex[\s\S]*?width: 1em[\s\S]*?height: 1em/,
    );
    assert.match(stateSource, /const actualTitleFs = titleFs \?\? \(compact \? '14px' : '15px'\)/);
    assert.match(
        stateSource,
        /<IconText[\s\S]*?textProps=\{\{ fw: 760, fs: actualTitleFs, tone: titleTone \}\}/,
    );
    assert.match(stateSource, /tone=\{descriptionTone\}/);
    assert.match(stateStyles, /\.oui-state-card\[data-variant="surface"\]/);
    assert.match(stateStyles, /\.oui-state-card\[data-variant="outline"\]/);
    assert.match(stateStyles, /\.oui-state-card\[data-variant="ghost"\]/);
    assert.match(
        stateStyles,
        /\.oui-state-card-description\s+display: block[\s\S]*?overflow-wrap: anywhere/,
    );
    assert.doesNotMatch(
        stateStyles,
        /oui-state-card-title|line-height: 1\.25|line-height: 1\.45|line-height: 1\.4/,
    );
    assert.match(
        stateSection,
        /<Stack g=\{1\}>[\s\S]*?<Text key=\{item\.key\} fs='13px' lh=\{1\.3\}>/,
    );
    assert.doesNotMatch(
        stateStyles,
        /oui-inline-state|oui-state-card-icon|oui-state-card-heading|oui-icon-text|oui-alert|oui-badge/,
    );
    assert.doesNotMatch(stateStyles, /\.oui-state-card-body\n(?:    .+\n)*    grid-column:/);
    assert.match(
        stateStyles,
        /\.oui-state-card\[data-variant="soft"\]\[data-tone="danger"\][\s\S]*?background: var\(--oui-danger-surface\)/,
    );
    assert.doesNotMatch(
        stateStyles,
        /\.oui-state-card\[data-variant="soft"\]\[data-tone="danger"\]\n\s+border-color:/,
    );
});
