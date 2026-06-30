'use client';

import {useEffect, useState, type CSSProperties, type Dispatch, type SetStateAction} from 'react';

import {
    Badge,
    Button,
    Flex,
    ScrollArea,
    Stack,
    Text,
    type OrcestrTheme,
    type OrcestrThemeMode,
    type OrcestrThemeOverrides,
    type OrcestrThemeSurface,
    type OrcestrThemeStatus,
    type OrcestrUiLocale,
} from '..';

type LocalizedText = Record<OrcestrUiLocale, string>;

export type ThemePreset = {
    id: string;
    label: LocalizedText;
    description: LocalizedText;
    mode: OrcestrThemeMode;
    surface: OrcestrThemeSurface;
    accent: string;
    previewBg: string;
    previewPanel: string;
    previewText: string;
    group: 'dark' | 'light';
    overrides?: OrcestrThemeOverrides;
};

export const themePlaygroundPresets = [
    {
        id: 'orcestr-dark',
        label: {
            ru: 'Orcestr темная',
            en: 'Orcestr dark',
        },
        description: {
            ru: 'Нейтральная темная база платформы.',
            en: 'Neutral dark platform base.',
        },
        mode: 'dark',
        surface: 'orcestr',
        accent: '#6ea0ff',
        previewBg: '#111318',
        previewPanel: '#171a21',
        previewText: '#f4f6f8',
        group: 'dark',
    },
    {
        id: 'operations-dark',
        label: {
            ru: 'Operations',
            en: 'Operations',
        },
        description: {
            ru: 'Плотная тема для повторяющейся операционной работы.',
            en: 'Dense theme for repeated operational work.',
        },
        mode: 'dark',
        surface: 'operations',
        accent: '#34d399',
        previewBg: '#07140f',
        previewPanel: '#0d2119',
        previewText: '#e8fff5',
        group: 'dark',
        overrides: {
            colors: {
                bg: '#07140f',
                panel: '#0d2119',
                panelSoft: '#133126',
                floating: '#0d2119',
                brand: '#34d399',
                brandStrong: '#86efac',
                brandSolid: '#059669',
                brandSolidHover: '#10b981',
                brandSoft: 'rgb(52 211 153 / 16%)',
                selected: 'rgb(52 211 153 / 14%)',
                info: '#7dd3fc',
                infoSoft: '#0b3240',
            },
        },
    },
    {
        id: 'deep-black',
        label: {
            ru: 'Глубокий черный',
            en: 'Deep black',
        },
        description: {
            ru: 'Абсолютно черная база для OLED-интерфейсов.',
            en: 'Absolute black base for OLED interfaces.',
        },
        mode: 'dark',
        surface: 'orcestr',
        accent: '#8ab4ff',
        previewBg: '#000000',
        previewPanel: '#050505',
        previewText: '#f7f7f7',
        group: 'dark',
        overrides: {
            colors: {
                bg: '#000000',
                panel: '#050505',
                panelSoft: '#0a0a0a',
                floating: '#050505',
                section: 'rgb(255 255 255 / 1.5%)',
                sectionNested: 'rgb(255 255 255 / 1%)',
                pad: 'rgb(255 255 255 / 2.5%)',
                padHover: 'rgb(255 255 255 / 5%)',
                controlHover: 'rgb(255 255 255 / 6%)',
                border: 'rgb(255 255 255 / 7%)',
                borderStrong: 'rgb(255 255 255 / 12%)',
                text: '#f7f7f7',
                muted: '#9a9a9a',
                brand: '#8ab4ff',
                brandStrong: '#b7d1ff',
                brandSolid: '#2759c7',
                brandSolidHover: '#3369e6',
                brandSoft: 'rgb(138 180 255 / 17%)',
                selected: 'rgb(138 180 255 / 14%)',
                focusRing: '0 0 0 3px rgb(138 180 255 / 20%)',
                skeletonShimmer: 'rgb(255 255 255 / 7%)',
            },
            shadows: {
                sm: 'none',
                md: '0 18px 58px rgb(0 0 0 / 72%)',
                overlay: '0 28px 90px rgb(0 0 0 / 82%)',
                section: 'none',
            },
            components: {
                buttonRadius: '5px',
            },
        },
    },
    {
        id: 'graphite',
        label: {
            ru: 'Графит',
            en: 'Graphite',
        },
        description: {
            ru: 'Сдержанная аналитика и административные экраны.',
            en: 'Restrained analytics and admin screens.',
        },
        mode: 'dark',
        surface: 'orcestr',
        accent: '#c4d3e8',
        previewBg: '#111111',
        previewPanel: '#1a1a1a',
        previewText: '#eeeeee',
        group: 'dark',
        overrides: {
            colors: {
                bg: '#111111',
                panel: '#1a1a1a',
                panelSoft: '#242424',
                floating: '#1b1b1b',
                brand: '#c4d3e8',
                brandStrong: '#e4edf8',
                brandSolid: '#5d6f87',
                brandSolidHover: '#71839b',
                brandSoft: 'rgb(196 211 232 / 14%)',
                selected: 'rgb(196 211 232 / 12%)',
                info: '#8ecae6',
                infoSoft: '#122f3a',
            },
            radii: {
                md: '5px',
                lg: '7px',
                xl: '10px',
            },
        },
    },
    {
        id: 'media-dark',
        label: {
            ru: 'Media dark',
            en: 'Media dark',
        },
        description: {
            ru: 'Мягкая темная тема для контентных интерфейсов.',
            en: 'Soft dark theme for content-heavy interfaces.',
        },
        mode: 'dark',
        surface: 'media',
        accent: '#fb7185',
        previewBg: '#120d0e',
        previewPanel: '#2a1222',
        previewText: '#fff0f6',
        group: 'dark',
        overrides: {
            colors: {
                bg: '#120d0e',
                panel: '#2a1222',
                panelSoft: '#3a1830',
                floating: '#2a1222',
                brand: '#fb7185',
                brandStrong: '#fda4af',
                brandSolid: '#be123c',
                brandSolidHover: '#e11d48',
                brandSoft: 'rgb(251 113 133 / 18%)',
                selected: 'rgb(251 113 133 / 15%)',
                warning: '#fbbf24',
                warningSoft: '#4a2f0b',
            },
        },
    },
    {
        id: 'catalog-dark',
        label: {
            ru: 'Catalog dark',
            en: 'Catalog dark',
        },
        description: {
            ru: 'Точная темная тема для структурированных каталогов.',
            en: 'Precise dark theme for structured index surfaces.',
        },
        mode: 'dark',
        surface: 'catalog',
        accent: '#e6c26a',
        previewBg: '#11100d',
        previewPanel: '#191712',
        previewText: '#f8f1dd',
        group: 'dark',
    },
    {
        id: 'midnight',
        label: {
            ru: 'Полночь',
            en: 'Midnight',
        },
        description: {
            ru: 'Сине-черная диспетчерская тема.',
            en: 'Blue-black dispatcher theme.',
        },
        mode: 'dark',
        surface: 'orcestr',
        accent: '#a78bfa',
        previewBg: '#09091f',
        previewPanel: '#121234',
        previewText: '#edf5ff',
        group: 'dark',
        overrides: {
            colors: {
                bg: '#09091f',
                panel: '#121234',
                panelSoft: '#1b1b4a',
                floating: '#121234',
                brand: '#a78bfa',
                brandStrong: '#c4b5fd',
                brandSolid: '#7c3aed',
                brandSolidHover: '#8b5cf6',
                brandSoft: 'rgb(167 139 250 / 17%)',
                selected: 'rgb(167 139 250 / 14%)',
                info: '#22d3ee',
                infoSoft: '#083344',
            },
        },
    },
    {
        id: 'orcestr-light',
        label: {
            ru: 'Orcestr светлая',
            en: 'Orcestr light',
        },
        description: {
            ru: 'Чистая светлая база продукта.',
            en: 'Clean light product base.',
        },
        mode: 'light',
        surface: 'orcestr',
        accent: '#2563eb',
        previewBg: '#f8fafc',
        previewPanel: '#ffffff',
        previewText: '#111827',
        group: 'light',
    },
    {
        id: 'operations-light',
        label: {
            ru: 'Operations light',
            en: 'Operations light',
        },
        description: {
            ru: 'Плотная светлая тема для повторяющейся операционной работы.',
            en: 'Dense light theme for repeated operational work.',
        },
        mode: 'light',
        surface: 'operations',
        accent: '#047857',
        previewBg: '#eefbf4',
        previewPanel: '#ffffff',
        previewText: '#092016',
        group: 'light',
        overrides: {
            colors: {
                bg: '#eefbf4',
                panel: '#ffffff',
                panelSoft: '#ddf4e8',
                brand: '#047857',
                brandStrong: '#065f46',
                brandSolid: '#047857',
                brandSolidHover: '#065f46',
                brandSoft: 'rgb(4 120 87 / 12%)',
                selected: 'rgb(4 120 87 / 10%)',
            },
        },
    },
    {
        id: 'media-light',
        label: {
            ru: 'Media light',
            en: 'Media light',
        },
        description: {
            ru: 'Мягкая светлая тема для контентных интерфейсов.',
            en: 'Soft light theme for content-heavy interfaces.',
        },
        mode: 'light',
        surface: 'media',
        accent: '#db2777',
        previewBg: '#fff1f8',
        previewPanel: '#ffffff',
        previewText: '#181018',
        group: 'light',
        overrides: {
            colors: {
                bg: '#fff1f8',
                panel: '#ffffff',
                panelSoft: '#ffe4f2',
                brand: '#db2777',
                brandStrong: '#be185d',
                brandSolid: '#db2777',
                brandSolidHover: '#be185d',
                brandSoft: 'rgb(219 39 119 / 12%)',
                selected: 'rgb(219 39 119 / 10%)',
            },
        },
    },
    {
        id: 'catalog-light',
        label: {
            ru: 'Catalog light',
            en: 'Catalog light',
        },
        description: {
            ru: 'Теплая светлая тема для структурированных каталогов.',
            en: 'Warm light theme for structured index surfaces.',
        },
        mode: 'light',
        surface: 'catalog',
        accent: '#9b6f12',
        previewBg: '#fbfaf6',
        previewPanel: '#ffffff',
        previewText: '#211a0f',
        group: 'light',
    },
    {
        id: 'porcelain',
        label: {
            ru: 'Фарфор',
            en: 'Porcelain',
        },
        description: {
            ru: 'Спокойная белая редакционная среда.',
            en: 'Calm white editorial workspace.',
        },
        mode: 'light',
        surface: 'orcestr',
        accent: '#7c3aed',
        previewBg: '#f8f5ff',
        previewPanel: '#ffffff',
        previewText: '#1d1435',
        group: 'light',
        overrides: {
            colors: {
                bg: '#f8f5ff',
                panel: '#ffffff',
                panelSoft: '#ede9fe',
                brand: '#7c3aed',
                brandStrong: '#5b21b6',
                brandSolid: '#7c3aed',
                brandSolidHover: '#6d28d9',
                brandSoft: 'rgb(124 58 237 / 10%)',
                selected: 'rgb(124 58 237 / 8%)',
                section: 'rgb(124 58 237 / 3%)',
                sectionNested: 'rgb(124 58 237 / 2%)',
            },
            shadows: {
                section: 'none',
            },
        },
    },
    {
        id: 'mint-light',
        label: {
            ru: 'Мята светлая',
            en: 'Mint light',
        },
        description: {
            ru: 'Свежая светлая тема для плотных рабочих экранов.',
            en: 'Fresh light theme for dense work screens.',
        },
        mode: 'light',
        surface: 'orcestr',
        accent: '#0f9f6e',
        previewBg: '#f4fbf8',
        previewPanel: '#ffffff',
        previewText: '#0f1f19',
        group: 'light',
        overrides: {
            colors: {
                bg: '#f4fbf8',
                panel: '#ffffff',
                panelSoft: '#eaf7f1',
                brand: '#0f9f6e',
                brandStrong: '#087a54',
                brandSolid: '#0f9f6e',
                brandSolidHover: '#0b8a5e',
                brandSoft: 'rgb(15 159 110 / 11%)',
                selected: 'rgb(15 159 110 / 9%)',
            },
        },
    },
] as const satisfies ReadonlyArray<ThemePreset>;

const themePresetGroups = [
    {key: 'dark', label: {ru: 'Темные', en: 'Dark'}},
    {key: 'light', label: {ru: 'Светлые', en: 'Light'}},
] as const;

export type ThemePresetId = (typeof themePlaygroundPresets)[number]['id'];

export function getThemePlaygroundPreset(id: ThemePresetId): ThemePreset {
    return themePlaygroundPresets.find((preset) => preset.id === id) ?? themePlaygroundPresets[0];
}

export function themePresetLabel(preset: ThemePreset, locale: OrcestrUiLocale) {
    return preset.label[locale];
}

export function themePresetDescription(preset: ThemePreset, locale: OrcestrUiLocale) {
    return preset.description[locale];
}

type FlatTokenSection = Exclude<keyof OrcestrThemeOverrides, 'status'>;

const flatTokenSections = [
    'colors',
    'radii',
    'spacing',
    'breakpoints',
    'shadows',
    'typography',
    'motion',
    'toast',
    'states',
    'density',
    'zIndex',
    'components',
] as const satisfies ReadonlyArray<FlatTokenSection>;

const statusKeys = ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const;
const COLOR_TOKEN_COMMIT_DELAY_MS = 180;

const themePlaygroundCopy = {
    ru: {
        title: 'Песочница тем',
        description: 'Выберите базовую тему и редактируйте токены вживую. Вся страница примеров использует текущий набор токенов.',
        tokenEditor: 'Редактор токенов',
        resetPreset: 'Сбросить пресет',
        primaryAction: 'Основное действие',
        surface: 'Поверхность',
        secondary: 'Вторичное',
        ready: 'готово',
        warning: 'внимание',
        statuses: 'Статусы',
        tokenSections: {
            colors: 'Цвета',
            radii: 'Радиусы',
            spacing: 'Отступы',
            breakpoints: 'Брейкпоинты',
            shadows: 'Тени',
            typography: 'Типографика',
            motion: 'Движение',
            toast: 'Toast',
            states: 'Состояния',
            density: 'Плотность',
            zIndex: 'Z-index',
            components: 'Компоненты',
        },
    },
    en: {
        title: 'Theme playground',
        description: 'Choose a base theme and edit tokens live. The whole example page uses the current token set.',
        tokenEditor: 'Token editor',
        resetPreset: 'Reset preset',
        primaryAction: 'Primary action',
        surface: 'Surface',
        secondary: 'Secondary',
        ready: 'ready',
        warning: 'warning',
        statuses: 'Statuses',
        tokenSections: {
            colors: 'Colors',
            radii: 'Radii',
            spacing: 'Spacing',
            breakpoints: 'Breakpoints',
            shadows: 'Shadows',
            typography: 'Typography',
            motion: 'Motion',
            toast: 'Toast',
            states: 'States',
            density: 'Density',
            zIndex: 'Z-index',
            components: 'Components',
        },
    },
} satisfies Record<OrcestrUiLocale, {
    title: string;
    description: string;
    tokenEditor: string;
    resetPreset: string;
    primaryAction: string;
    surface: string;
    secondary: string;
    ready: string;
    warning: string;
    statuses: string;
    tokenSections: Record<FlatTokenSection, string>;
}>;

export function ExampleThemePlayground({
    activePresetId,
    theme,
    locale,
    onPresetChange,
    onThemeOverridesChange,
}: {
    activePresetId: ThemePresetId;
    theme: OrcestrTheme;
    locale: OrcestrUiLocale;
    onPresetChange: (preset: ThemePreset) => void;
    onThemeOverridesChange: Dispatch<SetStateAction<OrcestrThemeOverrides>>;
}) {
    const activePreset = getThemePlaygroundPreset(activePresetId);
    const copy = themePlaygroundCopy[locale];

    return (
        <section id='theme' className='oui-section oui-ui-section'>
            <div className='oui-ui-section-head'>
                <div>
                    <h2 className='oui-ui-section-title'>{copy.title}</h2>
                    <p className='oui-ui-description'>{copy.description}</p>
                </div>
            </div>
            <div className='oui-theme-playground'>
                <Stack className='oui-theme-playground-presets' g={2}>
                    <ThemePresetSelector
                        activePresetId={activePreset.id as ThemePresetId}
                        locale={locale}
                        onPresetChange={onPresetChange}
                    />
                </Stack>
                <div className='oui-section oui-theme-preview'>
                    <div className='oui-theme-preview-head'>
                        <Text fw={760}>{copy.tokenEditor}</Text>
                        <Button
                            size={1}
                            v='surface'
                            onClick={() => onPresetChange(activePreset)}
                        >
                            {copy.resetPreset}
                        </Button>
                    </div>
                    <ScrollArea
                        className='oui-theme-preview-scroll'
                        highlights
                        highlightColor='var(--oui-section-nested-solid-bg)'
                        highlightTop={{
                            start: 2,
                            fadeDistance: 28,
                            maxOpacity: 0.94,
                        }}
                        highlightBottom={{
                            start: 2,
                            fadeDistance: 28,
                            maxOpacity: 0.94,
                        }}
                    >
                        <div className='oui-theme-token-editor'>
                            {flatTokenSections.map((section) => (
                                <TokenSection
                                    key={section}
                                    title={tokenSectionLabel(section, locale)}
                                    section={section}
                                    values={theme[section]}
                                    onTokenChange={(key, value) =>
                                        updateFlatToken(onThemeOverridesChange, section, key, value)
                                    }
                                />
                            ))}
                            {statusKeys.map((statusKey) => (
                                <TokenSection
                                    key={`status-${statusKey}`}
                                    title={`${copy.statuses} / ${statusKey}`}
                                    section='status'
                                    statusKey={statusKey}
                                    values={theme.status[statusKey]}
                                    onTokenChange={(key, value) =>
                                        updateStatusToken(
                                            onThemeOverridesChange,
                                            statusKey,
                                            key,
                                            String(value),
                                        )
                                    }
                                />
                            ))}
                        </div>
                        <Flex g={2} wrap>
                            <Button size={1}>{copy.primaryAction}</Button>
                            <Button size={1} v='surface'>{copy.surface}</Button>
                            <Button size={1} v='ghost'>{copy.secondary}</Button>
                            <Badge tone='success'>{copy.ready}</Badge>
                            <Badge tone='warning'>{copy.warning}</Badge>
                        </Flex>
                    </ScrollArea>
                </div>
            </div>
        </section>
    );
}

export function ThemePresetSelector({
    activePresetId,
    locale,
    onPresetChange,
}: {
    activePresetId: ThemePresetId;
    locale: OrcestrUiLocale;
    onPresetChange: (preset: ThemePreset) => void;
}) {
    return (
        <div className='oui-theme-preset-grid'>
            {themePresetGroups.map((group) => (
                <div key={group.key} className='oui-theme-preset-group'>
                    <div className='oui-theme-preset-group-label'>{group.label[locale]}</div>
                    <ScrollArea
                        className='oui-theme-preset-scroll'
                        highlights
                        highlightColor='var(--oui-section-solid-bg)'
                        highlightTop={{
                            start: 1,
                            fadeDistance: 18,
                            maxOpacity: 0.94,
                        }}
                        highlightBottom={{
                            start: 1,
                            fadeDistance: 18,
                            maxOpacity: 0.94,
                        }}
                    >
                        <div className='oui-theme-preset-list'>
                            {themePlaygroundPresets
                                .filter((preset) => preset.group === group.key)
                                .map((preset) => (
                                    <button
                                        key={preset.id}
                                        type='button'
                                        className='oui-theme-preset-card'
                                        data-active={activePresetId === preset.id ? 'true' : undefined}
                                        style={themePresetPreviewStyle(preset)}
                                        onClick={() => onPresetChange(preset)}
                                    >
                                        <span className='oui-theme-preset-preview'>
                                            <span />
                                            <span />
                                            <span />
                                        </span>
                                        <span className='oui-theme-preset-body'>
                                            <strong>{themePresetLabel(preset, locale)}</strong>
                                            <span>{themePresetDescription(preset, locale)}</span>
                                        </span>
                                    </button>
                                ))}
                        </div>
                    </ScrollArea>
                </div>
            ))}
        </div>
    );
}

export function themePresetPreviewStyle(preset: ThemePreset) {
    return {
        '--oui-theme-preset-bg': preset.previewBg,
        '--oui-theme-preset-panel': preset.previewPanel,
        '--oui-theme-preset-text': preset.previewText,
        '--oui-theme-preset-accent': preset.accent,
    } as CSSProperties;
}

function TokenSection({
    title,
    section,
    statusKey,
    values,
    onTokenChange,
}: {
    title: string;
    section: FlatTokenSection | 'status';
    statusKey?: keyof OrcestrTheme['status'];
    values: Record<string, string | number | false>;
    onTokenChange: (key: string, value: string | number | false) => void;
}) {
    return (
        <div className='oui-theme-token-section'>
            <Text fs='12px' fw={760} tone='muted'>{title}</Text>
            <div className='oui-theme-token-grid'>
                {Object.entries(values).map(([key, value]) => (
                    <ThemeTokenControl
                        key={`${title}-${key}`}
                        label={readableTokenName(key)}
                        path={statusKey ? `${statusKey}.${key}` : key}
                        section={section}
                        value={value}
                        onChange={(next) => onTokenChange(key, next)}
                    />
                ))}
            </div>
        </div>
    );
}

function ThemeTokenControl({
    label,
    path,
    section,
    value,
    onChange,
}: {
    label: string;
    path: string;
    section: FlatTokenSection | 'status';
    value: string | number | false;
    onChange: (value: string | number | false) => void;
}) {
    const valueText = String(value);
    const colorInputValue = colorInputHex(valueText);
    const [colorDraft, setColorDraft] = useState(colorInputValue);
    const selectOptions = selectOptionsForToken(path);
    const visibleColorValue = colorDraft ?? colorInputValue;

    useEffect(() => {
        setColorDraft(colorInputValue);
    }, [colorInputValue]);

    useEffect(() => {
        if (!colorDraft || colorDraft === colorInputValue) return;
        const timer = window.setTimeout(() => onChange(colorDraft), COLOR_TOKEN_COMMIT_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, [colorDraft, colorInputValue, onChange]);

    const commitColorDraft = () => {
        if (!colorDraft || colorDraft === colorInputValue) return;
        onChange(colorDraft);
    };

    return (
        <div className='oui-theme-token oui-theme-token-control'>
            <span
                className='oui-theme-token-swatch'
                style={{
                    background: visibleColorValue ?? (
                        section === 'colors' || section === 'status'
                            ? valueText
                        : 'var(--oui-brand-soft)'
                    ),
                }}
            >
                {colorInputValue ? (
                    <input
                        className='oui-theme-token-swatch-input'
                        type='color'
                        value={visibleColorValue ?? colorInputValue}
                        aria-label={`${label} color`}
                        onChange={(event) => setColorDraft(event.target.value)}
                        onBlur={commitColorDraft}
                    />
                ) : null}
            </span>
            <span className='oui-theme-token-text'>
                <Text fs='12px' fw={700}>{label}</Text>
                <Text fs='11px' tone='muted'>{path}</Text>
            </span>
            <span className='oui-theme-token-control-field'>
                {selectOptions ? (
                    <select
                        value={valueText}
                        aria-label={label}
                        onChange={(event) => onChange(event.target.value)}
                    >
                        {selectOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={typeof value === 'number' ? 'number' : 'text'}
                        value={valueText}
                        aria-label={label}
                        onChange={(event) =>
                            onChange(typeof value === 'number' ? Number(event.target.value) : event.target.value)
                        }
                    />
                )}
            </span>
        </div>
    );
}

function updateFlatToken(
    updateOverrides: Dispatch<SetStateAction<OrcestrThemeOverrides>>,
    section: FlatTokenSection,
    key: string,
    value: string | number | false,
) {
    updateOverrides((current) => ({
        ...current,
        [section]: {
            ...((current[section] ?? {}) as Record<string, string | number | false>),
            [key]: value,
        },
    }));
}

function updateStatusToken(
    updateOverrides: Dispatch<SetStateAction<OrcestrThemeOverrides>>,
    statusKey: keyof OrcestrTheme['status'],
    key: string,
    value: string,
) {
    updateOverrides((current) => ({
        ...current,
        status: {
            ...current.status,
            [statusKey]: {
                ...(current.status?.[statusKey] ?? {}),
                [key]: value,
            } as Partial<OrcestrThemeStatus>,
        },
    }));
}

function tokenSectionLabel(section: FlatTokenSection, locale: OrcestrUiLocale) {
    return themePlaygroundCopy[locale].tokenSections[section];
}

function readableTokenName(value: string) {
    return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
}

function colorInputHex(value: string) {
    const hex = value.trim();
    if (/^#[0-9a-f]{6}$/i.test(hex)) return hex;
    if (/^#[0-9a-f]{3}$/i.test(hex)) {
        const [, r, g, b] = hex;
        return `#${r}${r}${g}${g}${b}${b}`;
    }
    const rgb = hex.match(/^rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (!rgb) return null;
    return `#${toHex(Number(rgb[1]))}${toHex(Number(rgb[2]))}${toHex(Number(rgb[3]))}`;
}

function toHex(value: number) {
    return Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0');
}

function selectOptionsForToken(path: string) {
    if (path === 'modalAnimation') return ['zoom-blur', 'rise', 'fade'];
    if (path === 'pressAnimation') return ['translate', 'scale', 'soft', 'none'];
    return null;
}
