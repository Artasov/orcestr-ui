'use client';

import {useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction} from 'react';
import {
    LuBell,
    LuCheck,
    LuExternalLink,
    LuRefreshCw,
    LuTrash2,
} from 'react-icons/lu';

import {
    AppShell,
    AppShellContent,
    AppShellHeader,
    AppShellNav,
    AppShellSidebar,
    OrcestrUiProvider,
    ScrollArea,
    useOrcestrTheme,
    useToast,
    type MenuItem,
    type OrcestrThemeOverrides,
    type OrcestrUiLocale,
} from '..';
import {LayoutSection, TypographySection} from './ExampleBasicsSections';
import {ActionsSection} from './ExampleActionsSection';
import {FieldsSection} from './ExampleFieldsSection';
import {SelectionSection} from './ExampleSelectionSection';
import {DataSection} from './ExampleDataSection';
import {OverlaysSection} from './ExampleOverlaysSection';
import {FoundationsSection} from './ExampleFoundationsSection';
import {IconTextSection, StateCardSection} from './ExampleStateSection';
import {
    ExampleThemePlayground,
    getThemePlaygroundPreset,
    themePlaygroundPresets,
    themePresetLabel,
    themePresetPreviewStyle,
    type ThemePresetId,
} from './ExampleThemePlayground';
import {CodePreviewModal} from './CodePreview';
import {ExampleOverlays} from './ExampleOverlays';
import {type CodeExample} from './codeSamples';
import {navGroups, navItems, type EntityOption} from './exampleData';

const ORCESTR_LOGO_SRC = '/assets/orcestr/logo.png';
const UI_EXAMPLE_SCROLL_LEAD = 50;


function scrollUiExampleSection(id: string) {
    const node = document.getElementById(id);
    const scrollRoot = document.querySelector<HTMLElement>(
        '.oui-app-shell-content-scroll .oui-scroll-area-viewport',
    );
    if (!node || !scrollRoot) {
        node?.scrollIntoView({block: 'start', behavior: 'smooth'});
        return;
    }

    scrollRoot.scrollTo({
        top: uiExampleSectionScrollTop(node, scrollRoot),
        behavior: 'smooth',
    });
}

function uiExampleSectionScrollTop(node: HTMLElement, scrollRoot?: HTMLElement) {
    const maxTop = scrollRoot
        ? Math.max(0, scrollRoot.scrollHeight - scrollRoot.clientHeight)
        : Number.POSITIVE_INFINITY;
    return Math.min(maxTop, Math.max(0, node.offsetTop - UI_EXAMPLE_SCROLL_LEAD));
}

function UiExampleContent({
    activePresetId,
    onThemePresetChange,
    onThemeOverridesChange,
    locale,
    onLocaleChange,
}: {
    activePresetId: ThemePresetId;
    onThemePresetChange: (preset: ReturnType<typeof getThemePlaygroundPreset>) => void;
    onThemeOverridesChange: Dispatch<SetStateAction<OrcestrThemeOverrides>>;
    locale: OrcestrUiLocale;
    onLocaleChange: (locale: OrcestrUiLocale) => void;
}) {
    const {theme} = useOrcestrTheme();
    const toast = useToast();
    const [segment, setSegment] = useState('active');
    const [selectValue, setSelectValue] = useState<string | null>('work');
    const [selectNoChevronValue, setSelectNoChevronValue] = useState<string | null>('ready');
    const [selectPlainValue, setSelectPlainValue] = useState<string | null>('blocked');
    const [comboValue, setComboValue] = useState<string | null>('ready');
    const [entityValue, setEntityValue] = useState<EntityOption | null>(null);
    const [ownerValues, setOwnerValues] = useState<string[]>(['anna', 'ops']);
    const [radioValue, setRadioValue] = useState('manual');
    const [tabValue, setTabValue] = useState('overview');
    const [modalOpen, setModalOpen] = useState(false);
    const [nestedOpen, setNestedOpen] = useState(false);
    const [blurModalOpen, setBlurModalOpen] = useState(false);
    const [blurNestedOpen, setBlurNestedOpen] = useState(false);
    const [blurFinalOpen, setBlurFinalOpen] = useState(false);
    const [fastModalOpen, setFastModalOpen] = useState(false);
    const [slowModalOpen, setSlowModalOpen] = useState(false);
    const [riseModalOpen, setRiseModalOpen] = useState(false);
    const [dangerModalOpen, setDangerModalOpen] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [codeExample, setCodeExample] = useState<CodeExample | null>(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [stepperValue, setStepperValue] = useState(12);
    const [dateValue, setDateValue] = useState('2026-06-26');
    const [dateRange, setDateRange] = useState({
        from: '2026-06-01',
        to: '2026-06-26',
    });

    useEffect(() => {
        document.documentElement.classList.add('oui-ui-document-lock');
        document.body.classList.add('oui-ui-document-lock');

        const hash = window.location.hash.replace('#', '');
        let hashSettleTimer: number | null = null;
        const hashFrame = hash
            ? window.requestAnimationFrame(() => {
                scrollUiExampleSection(hash);
                hashSettleTimer = window.setTimeout(() => {
                    scrollUiExampleSection(hash);
                }, 450);
            })
            : null;

        return () => {
            if (hashFrame !== null) window.cancelAnimationFrame(hashFrame);
            if (hashSettleTimer !== null) window.clearTimeout(hashSettleTimer);
            document.documentElement.classList.remove('oui-ui-document-lock');
            document.body.classList.remove('oui-ui-document-lock');
        };
    }, []);

    const menuItems = useMemo<MenuItem[]>(
        () => {
            const copy = locale === 'ru'
                ? {
                    copy: 'Скопировать ссылку',
                    notify: 'Уведомить команду',
                    notifyInfo: 'Подсказка внутри пункта меню',
                    syncing: 'Синхронизация остатков',
                    more: 'Еще действия',
                    duplicate: 'Дублировать',
                    duplicateToast: 'Дублировано',
                    archive: 'Архивировать',
                    archiveToast: 'Архивировано',
                    delete: 'Удалить',
                    deleteTitle: 'Удалить элемент?',
                    deleteMessage: 'Это действие нельзя отменить.',
                    deletedToast: 'Удалено',
                }
                : {
                    copy: 'Copy link',
                    notify: 'Notify team',
                    notifyInfo: 'Info tooltip inside a menu item',
                    syncing: 'Syncing status',
                    more: 'More actions',
                    duplicate: 'Duplicate',
                    duplicateToast: 'Duplicated',
                    archive: 'Archive',
                    archiveToast: 'Archived',
                    delete: 'Delete',
                    deleteTitle: 'Delete item?',
                    deleteMessage: 'This action cannot be undone.',
                    deletedToast: 'Deleted',
                };

            return [
                {key: 'copy', label: copy.copy, icon: <LuCheck size={15} />},
                {
                    key: 'notify',
                    label: copy.notify,
                    icon: <LuBell size={15} />,
                    info: copy.notifyInfo,
                },
                {
                    key: 'syncing',
                    label: copy.syncing,
                    icon: <LuRefreshCw size={15} />,
                    loading: true,
                },
                {
                    key: 'more',
                    label: copy.more,
                    children: [
                        {
                            key: 'duplicate',
                            label: copy.duplicate,
                            onSelect: () => toast.push(copy.duplicateToast, 'success'),
                        },
                        {
                            key: 'archive',
                            label: copy.archive,
                            onSelect: () => toast.push(copy.archiveToast, 'info'),
                        },
                    ],
                },
                {
                    key: 'sep',
                    label: copy.delete,
                    icon: <LuTrash2 size={15} />,
                    tone: 'danger',
                    separatorBefore: true,
                    confirm: {
                        title: copy.deleteTitle,
                        message: copy.deleteMessage,
                        confirmLabel: copy.delete,
                        tone: 'danger',
                    },
                    onSelect: () => toast.push(copy.deletedToast, 'warning'),
                },
            ];
        },
        [locale, toast],
    );

    return (
        <AppShell
            sidebarOpen={mobileNavOpen}
            onSidebarOpenChange={setMobileNavOpen}
            header={
                <AppShellHeader
                    visibility='mobile'
                    sidebarOpen={mobileNavOpen}
                    onSidebarOpenChange={setMobileNavOpen}
                    actions={
                        <UiExampleHeaderActions
                            compact
                            locale={locale}
                            onLocaleChange={onLocaleChange}
                        />
                    }
                >
                    <UiExampleBrand compact />
                </AppShellHeader>
            }
            sidebar={
                <AppShellSidebar
                    title={<UiExampleBrand />}
                    onClose={() => setMobileNavOpen(false)}
                >
                    <UiExampleSidebar onNavigate={() => setMobileNavOpen(false)} />
                </AppShellSidebar>
            }
        >
            <div className='oui-ui-workspace'>
                <div className='oui-ui-workspace-main'>
                    <UiExampleTopBar locale={locale} onLocaleChange={onLocaleChange} />

                    <AppShellContent>
                        <ExampleThemePlayground
                            activePresetId={activePresetId}
                            theme={theme}
                            locale={locale}
                            onPresetChange={onThemePresetChange}
                            onThemeOverridesChange={onThemeOverridesChange}
                        />

                        <FoundationsSection onOpenCode={setCodeExample} />

                        <TypographySection onOpenCode={setCodeExample} />

                        <IconTextSection onOpenCode={setCodeExample} />

                        <LayoutSection onOpenCode={setCodeExample} />
                        <ActionsSection
                            menuItems={menuItems}
                            onOpenCode={setCodeExample}
                            onOpenPalette={() => setPaletteOpen(true)}
                        />
                        <FieldsSection
                            stepperValue={stepperValue}
                            onStepperValueChange={setStepperValue}
                            dateValue={dateValue}
                            onDateValueChange={setDateValue}
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                            onOpenCode={setCodeExample}
                        />
                        <SelectionSection
                            locale={locale}
                            segment={segment}
                            onSegmentChange={setSegment}
                            selectValue={selectValue}
                            onSelectValueChange={setSelectValue}
                            selectNoChevronValue={selectNoChevronValue}
                            onSelectNoChevronValueChange={setSelectNoChevronValue}
                            selectPlainValue={selectPlainValue}
                            onSelectPlainValueChange={setSelectPlainValue}
                            comboValue={comboValue}
                            onComboValueChange={setComboValue}
                            entityValue={entityValue}
                            onEntityValueChange={setEntityValue}
                            ownerValues={ownerValues}
                            onOwnerValuesChange={setOwnerValues}
                            radioValue={radioValue}
                            onRadioValueChange={setRadioValue}
                            tabValue={tabValue}
                            onTabValueChange={setTabValue}
                            onOpenCode={setCodeExample}
                            onToast={toast.push}
                        />
                        <StateCardSection onOpenCode={setCodeExample} />
                        <DataSection onOpenCode={setCodeExample} />
                        <OverlaysSection
                            setModalOpen={setModalOpen}
                            setBlurModalOpen={setBlurModalOpen}
                            setFastModalOpen={setFastModalOpen}
                            setRiseModalOpen={setRiseModalOpen}
                            setSlowModalOpen={setSlowModalOpen}
                            setDangerModalOpen={setDangerModalOpen}
                            onOpenCode={setCodeExample}
                        />
                    </AppShellContent>
                </div>
                <UiExampleThemeRail
                    activePresetId={activePresetId}
                    locale={locale}
                    onThemePresetChange={onThemePresetChange}
                />
            </div>

            <CodePreviewModal
                example={codeExample}
                onClose={() => setCodeExample(null)}
            />

            <ExampleOverlays
                locale={locale}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                nestedOpen={nestedOpen}
                setNestedOpen={setNestedOpen}
                blurModalOpen={blurModalOpen}
                setBlurModalOpen={setBlurModalOpen}
                blurNestedOpen={blurNestedOpen}
                setBlurNestedOpen={setBlurNestedOpen}
                blurFinalOpen={blurFinalOpen}
                setBlurFinalOpen={setBlurFinalOpen}
                fastModalOpen={fastModalOpen}
                setFastModalOpen={setFastModalOpen}
                slowModalOpen={slowModalOpen}
                setSlowModalOpen={setSlowModalOpen}
                riseModalOpen={riseModalOpen}
                setRiseModalOpen={setRiseModalOpen}
                dangerModalOpen={dangerModalOpen}
                setDangerModalOpen={setDangerModalOpen}
                paletteOpen={paletteOpen}
                setPaletteOpen={setPaletteOpen}
                onToast={toast.push}
            />
        </AppShell>
    );
}

function UiExampleThemeRail({
    activePresetId,
    locale,
    onThemePresetChange,
}: {
    activePresetId: ThemePresetId;
    locale: OrcestrUiLocale;
    onThemePresetChange: (preset: ReturnType<typeof getThemePlaygroundPreset>) => void;
}) {
    const presets = useMemo(() => {
        const dark = themePlaygroundPresets.filter((preset) => preset.group === 'dark');
        const light = themePlaygroundPresets.filter((preset) => preset.group === 'light');
        const next: Array<(typeof themePlaygroundPresets)[number]> = [];
        const maxLength = Math.max(dark.length, light.length);

        for (let index = 0; index < maxLength; index += 1) {
            if (dark[index]) next.push(dark[index]);
            if (light[index]) next.push(light[index]);
        }

        return next;
    }, []);

    return (
        <aside className='oui-ui-theme-rail' aria-label='Theme presets'>
            <div className='oui-ui-theme-rail-title'>Themes</div>
            <ScrollArea
                className='oui-ui-theme-rail-scroll'
                highlights
                highlightColor='var(--oui-ui-theme-rail-highlight-bg)'
                highlightTop={{
                    start: 18,
                    fadeDistance: 90,
                    maxOpacity: 0.94,
                }}
                highlightBottom={{
                    start: 12,
                    fadeDistance: 90,
                    maxOpacity: 0.94,
                }}
            >
                <div className='oui-ui-theme-rail-list'>
                    {presets.map((preset) => (
                        <button
                            key={preset.id}
                            type='button'
                            className='oui-ui-theme-rail-item'
                            data-active={activePresetId === preset.id ? 'true' : undefined}
                            style={themePresetPreviewStyle(preset)}
                            onClick={() => onThemePresetChange(preset)}
                        >
                            <span className='oui-ui-theme-rail-preview' aria-hidden>
                                <span />
                                <span />
                            </span>
                            <span className='oui-ui-theme-rail-name'>{themePresetLabel(preset, locale)}</span>
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </aside>
    );
}

function UiExampleSidebar({onNavigate}: {onNavigate: () => void}) {
    const [activeSection, setActiveSection] = useState('theme');
    const activeSectionRef = useRef('theme');
    const scrollNavigationTargetRef = useRef<string | null>(null);
    const scrollNavigationReleaseTimerRef = useRef<number | null>(null);

    const setActiveSectionValue = useCallback((id: string) => {
        activeSectionRef.current = id;
        setActiveSection((current) => current === id ? current : id);
    }, []);

    const lockScrollNavigationTarget = useCallback((id: string) => {
        scrollNavigationTargetRef.current = id;
        if (scrollNavigationReleaseTimerRef.current !== null) {
            window.clearTimeout(scrollNavigationReleaseTimerRef.current);
        }
        scrollNavigationReleaseTimerRef.current = window.setTimeout(() => {
            if (scrollNavigationTargetRef.current === id) scrollNavigationTargetRef.current = null;
        }, 900);
    }, []);

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash) setActiveSectionValue(hash);

        const ids = navItems.map((item) => item.id);
        const nodes = ids
            .map((id) => document.getElementById(id))
            .filter((node): node is HTMLElement => Boolean(node));
        const scrollRoot = document.querySelector<HTMLElement>(
            '.oui-app-shell-content-scroll .oui-scroll-area-viewport',
        );
        if (nodes.length === 0 || !scrollRoot) return undefined;

        let frame: number | null = null;
        const updateActiveSection = () => {
            frame = null;
            const lockedTarget = scrollNavigationTargetRef.current;
            if (lockedTarget) {
                const targetNode = document.getElementById(lockedTarget);
                if (!targetNode) {
                    scrollNavigationTargetRef.current = null;
                    return;
                }

                const targetTop = uiExampleSectionScrollTop(targetNode, scrollRoot);
                if (Math.abs(scrollRoot.scrollTop - targetTop) <= 2) {
                    scrollNavigationTargetRef.current = null;
                    setActiveSectionValue(lockedTarget);
                }
                return;
            }

            const bottomDistance = scrollRoot.scrollHeight
                - scrollRoot.clientHeight
                - scrollRoot.scrollTop;
            const top = scrollRoot.scrollTop + 24;
            const next = bottomDistance <= 2
                ? nodes.at(-1)?.id
                : nodes.filter((node) => node.offsetTop <= top).at(-1)?.id ?? nodes[0]?.id;
            if (next && next !== activeSectionRef.current) setActiveSectionValue(next);
        };
        const requestUpdateActiveSection = () => {
            if (frame !== null) return;
            frame = window.requestAnimationFrame(updateActiveSection);
        };

        updateActiveSection();
        scrollRoot.addEventListener('scroll', requestUpdateActiveSection, {passive: true});
        return () => {
            if (frame !== null) window.cancelAnimationFrame(frame);
            if (scrollNavigationReleaseTimerRef.current !== null) {
                window.clearTimeout(scrollNavigationReleaseTimerRef.current);
            }
            scrollRoot.removeEventListener('scroll', requestUpdateActiveSection);
        };
    }, [setActiveSectionValue]);

    const navigateToSection = useCallback((id: string) => {
        setActiveSectionValue(id);
        lockScrollNavigationTarget(id);
        window.history.replaceState(null, '', `#${id}`);
        scrollUiExampleSection(id);
        onNavigate();
    }, [lockScrollNavigationTarget, onNavigate, setActiveSectionValue]);

    const sidebarNavGroups = useMemo(
        () =>
            navGroups.map((group) => ({
                ...group,
                items: group.items.map((item) => ({
                    key: item.id,
                    label: item.label,
                    active: activeSection === item.id,
                    onSelect: () => navigateToSection(item.id),
                })),
            })),
        [activeSection, navigateToSection],
    );

    return (
        <div className='oui-ui-sidebar-groups'>
            {sidebarNavGroups.map((group) => (
                <div key={group.key} className='oui-ui-sidebar-group'>
                    <div className='oui-ui-sidebar-group-label'>{group.label}</div>
                    <AppShellNav className='oui-ui-sidebar-nav' items={group.items} />
                </div>
            ))}
        </div>
    );
}

function UiExampleTopBar({
    locale,
    onLocaleChange,
}: {
    locale: OrcestrUiLocale;
    onLocaleChange: (locale: OrcestrUiLocale) => void;
}) {
    const title = locale === 'ru'
        ? 'Единый язык компонентов для всех модулей.'
        : 'One component language for every module.';
    const subtitle = locale === 'ru'
        ? 'Одна тема, предсказуемый интерфейс.'
        : 'One theme, predictable interface.';

    return (
        <header className='oui-ui-topbar'>
            <div className='oui-ui-topbar-slogan'>
                <strong>{title}</strong>
                <span>{subtitle}</span>
            </div>
            <UiExampleHeaderActions locale={locale} onLocaleChange={onLocaleChange} />
        </header>
    );
}

function UiExampleBrand({compact = false}: {compact?: boolean}) {
    return (
        <div className='oui-ui-brand' data-compact={compact ? 'true' : undefined}>
            <span className='oui-ui-brand-mark' aria-hidden='true'>
                <img className='oui-ui-brand-logo' src={ORCESTR_LOGO_SRC} alt='' />
            </span>
            <span className='oui-ui-brand-text'>
                <strong>Orcestr UI</strong>
            </span>
        </div>
    );
}

function UiExampleHeaderActions({
    compact = false,
    locale,
    onLocaleChange,
}: {
    compact?: boolean;
    locale: OrcestrUiLocale;
    onLocaleChange: (locale: OrcestrUiLocale) => void;
}) {
    return (
        <div className='oui-ui-topbar-actions' data-compact={compact ? 'true' : undefined}>
            <span className='oui-ui-language-switch' aria-label='UI example language'>
                <span className='oui-ui-language-label'>
                    {locale === 'ru' ? 'Язык' : 'Language'}
                </span>
                {(['ru', 'en'] as const).map((item) => (
                    <button
                        key={item}
                        type='button'
                        className='oui-ui-language-option'
                        data-active={locale === item ? 'true' : undefined}
                        aria-pressed={locale === item}
                        onClick={() => onLocaleChange(item)}
                    >
                        {item.toUpperCase()}
                    </button>
                ))}
            </span>
            <a
                className='oui-ui-topbar-link'
                href='https://github.com/Artasov/orcestr'
                target='_blank'
                rel='noreferrer'
            >
                <LuExternalLink size={14} aria-hidden />
                <span>GitHub</span>
            </a>
        </div>
    );
}

export function UiExamplePage() {
    const firstPreset = getThemePlaygroundPreset('orcestr-dark');
    const [activePresetId, setActivePresetId] = useState<ThemePresetId>(firstPreset.id as ThemePresetId);
    const [mode, setMode] = useState(firstPreset.mode);
    const [surface, setSurface] = useState(firstPreset.surface);
    const [locale, setLocale] = useState<OrcestrUiLocale>('ru');
    const [themeOverrides, setThemeOverrides] = useState<OrcestrThemeOverrides>(
        firstPreset.overrides ?? {},
    );

    const handleThemePresetChange = useCallback((preset: ReturnType<typeof getThemePlaygroundPreset>) => {
        setActivePresetId(preset.id as ThemePresetId);
        setMode(preset.mode);
        setSurface(preset.surface);
        setThemeOverrides(preset.overrides ?? {});
    }, []);

    return (
        <OrcestrUiProvider
            mode={mode}
            surface={surface}
            onModeChange={setMode}
            onSurfaceChange={setSurface}
            themeOverrides={themeOverrides}
            locale={locale}
        >
            <UiExampleContent
                activePresetId={activePresetId}
                onThemePresetChange={handleThemePresetChange}
                onThemeOverridesChange={setThemeOverrides}
                locale={locale}
                onLocaleChange={setLocale}
            />
        </OrcestrUiProvider>
    );
}
