'use client';

import { useEffect, useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';

import {
    Badge,
    Button,
    CopyButton,
    Flex,
    Popover,
    ScrollArea,
    Stack,
    Text,
    type OrcestrTheme,
    type OrcestrThemeMode,
    type OrcestrThemeOverrides,
    type OrcestrThemeStatus,
    type OrcestrUiLocale,
} from '../index.js';
import {
    parseEditableThemeColor,
    serializeEditableThemeColor,
} from './themeEditorColor.js';

type LocalizedText = Record<OrcestrUiLocale, string>;

export type ThemePreset = {
    id: string;
    label: LocalizedText;
    description: LocalizedText;
    mode: OrcestrThemeMode;
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
            en: 'Dense theme for operational workflows.',
        },
        mode: 'dark',
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
                primary: {
                    base: '#059669',
                    text: '#86efac',
                    surface: 'rgb(52 211 153 / 16%)',
                    border: 'rgb(52 211 153 / 16%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(52 211 153 / 14%)',
                info: {
                    base: '#7dd3fc',
                    text: '#7dd3fc',
                    surface: '#0b3240',
                },
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
                section: 'rgb(255 255 255 / 4%)',
                pad: 'rgb(255 255 255 / 2.5%)',
                padHover: 'rgb(255 255 255 / 5%)',
                controlHover: 'rgb(255 255 255 / 6%)',
                border: 'rgb(255 255 255 / 7%)',
                borderStrong: 'rgb(255 255 255 / 12%)',
                text: '#f7f7f7',
                muted: '#9a9a9a',
                primary: {
                    base: '#2759c7',
                    text: '#b7d1ff',
                    surface: 'rgb(138 180 255 / 17%)',
                    border: 'rgb(138 180 255 / 17%)',
                    contrast: '#ffffff',
                },
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
                primary: {
                    base: '#5d6f87',
                    text: '#e4edf8',
                    surface: 'rgb(196 211 232 / 14%)',
                    border: 'rgb(196 211 232 / 14%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(196 211 232 / 12%)',
                info: {
                    base: '#8ecae6',
                    text: '#8ecae6',
                    surface: '#122f3a',
                },
            },
            radius: {
                md: '5px',
                lg: '7px',
                xl: '10px',
            },
        },
    },
    {
        id: 'rose-dark',
        label: {
            ru: 'Rose dark',
            en: 'Rose dark',
        },
        description: {
            ru: 'Мягкая темная тема для контентных интерфейсов.',
            en: 'Soft dark theme for content-heavy interfaces.',
        },
        mode: 'dark',
        accent: '#f0a6d8',
        previewBg: '#141116',
        previewPanel: '#1d1820',
        previewText: '#f7eef7',
        group: 'dark',
        overrides: {
            colors: {
                bg: '#141116',
                panel: '#1d1820',
                panelSoft: '#29212d',
                floating: '#1d1820',
                primary: {
                    base: '#a84486',
                    text: '#ffc1e7',
                    surface: 'rgb(240 166 216 / 17%)',
                    border: 'rgb(240 166 216 / 17%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(240 166 216 / 16%)',
                warning: {
                    base: '#fbbf24',
                    text: '#fbbf24',
                    surface: '#49371c',
                },
            },
        },
    },
    {
        id: 'amber-dark',
        label: {
            ru: 'Amber dark',
            en: 'Amber dark',
        },
        description: {
            ru: 'Точная темная тема для структурированных каталогов.',
            en: 'Precise dark theme for structured index surfaces.',
        },
        mode: 'dark',
        accent: '#e6c26a',
        previewBg: '#11100d',
        previewPanel: '#191712',
        previewText: '#f8f1dd',
        group: 'dark',
        overrides: {
            colors: {
                bg: '#11100d',
                panel: '#191712',
                panelSoft: '#242017',
                floating: '#191712',
                primary: {
                    base: '#ffc53d',
                    text: '#ffca16',
                    surface: '#fa820022',
                    border: '#fd9b0051',
                    contrast: '#111111',
                },
                selected: '#fa820022',
                focusRing: '0 0 0 3px #fc820032',
            },
            status: {
                primary: {
                    color: '#ffc53d',
                    text: '#ffca16',
                    soft: '#fa820022',
                    border: '#fd9b0051',
                },
            },
        },
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
        accent: '#7dd3fc',
        previewBg: '#080f1c',
        previewPanel: '#101a2b',
        previewText: '#e9f3ff',
        group: 'dark',
        overrides: {
            colors: {
                bg: '#080f1c',
                panel: '#101a2b',
                panelSoft: '#172338',
                floating: '#101a2b',
                primary: {
                    base: '#0369a1',
                    text: '#bae6fd',
                    surface: 'rgb(125 211 252 / 16%)',
                    border: 'rgb(125 211 252 / 16%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(125 211 252 / 13%)',
                info: {
                    base: '#22d3ee',
                    text: '#22d3ee',
                    surface: '#083344',
                },
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
                primary: {
                    base: '#047857',
                    text: '#065f46',
                    surface: 'rgb(4 120 87 / 12%)',
                    border: 'rgb(4 120 87 / 12%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(4 120 87 / 10%)',
            },
        },
    },
    {
        id: 'rose-light',
        label: {
            ru: 'Rose light',
            en: 'Rose light',
        },
        description: {
            ru: 'Мягкая светлая тема для контентных интерфейсов.',
            en: 'Soft light theme for content-heavy interfaces.',
        },
        mode: 'light',
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
                primary: {
                    base: '#db2777',
                    text: '#be185d',
                    surface: 'rgb(219 39 119 / 12%)',
                    border: 'rgb(219 39 119 / 12%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(219 39 119 / 10%)',
            },
        },
    },
    {
        id: 'amber-light',
        label: {
            ru: 'Amber light',
            en: 'Amber light',
        },
        description: {
            ru: 'Теплая светлая тема для структурированных каталогов.',
            en: 'Warm light theme for structured index surfaces.',
        },
        mode: 'light',
        accent: '#9b6f12',
        previewBg: '#fbfaf6',
        previewPanel: '#ffffff',
        previewText: '#211a0f',
        group: 'light',
        overrides: {
            colors: {
                bg: '#fbfaf6',
                panel: '#ffffff',
                panelSoft: '#f3efe4',
                primary: {
                    base: '#ffc53d',
                    text: '#ab6400',
                    surface: '#ffde003d',
                    border: '#eab5008c',
                    contrast: '#111111',
                },
                selected: '#ffde003d',
                focusRing: '0 0 0 3px #ffd40063',
            },
            status: {
                primary: {
                    color: '#ffc53d',
                    text: '#ab6400',
                    soft: '#ffde003d',
                    border: '#eab5008c',
                },
            },
        },
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
                primary: {
                    base: '#7c3aed',
                    text: '#5b21b6',
                    surface: 'rgb(124 58 237 / 10%)',
                    border: 'rgb(124 58 237 / 10%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(124 58 237 / 8%)',
                section: 'rgb(124 58 237 / 4%)',
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
                primary: {
                    base: '#0f9f6e',
                    text: '#087a54',
                    surface: 'rgb(15 159 110 / 11%)',
                    border: 'rgb(15 159 110 / 11%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(15 159 110 / 9%)',
            },
        },
    },
] as const satisfies ReadonlyArray<ThemePreset>;

const themePresetGroups = [
    { key: 'dark', label: { ru: 'Темные', en: 'Dark' } },
    { key: 'light', label: { ru: 'Светлые', en: 'Light' } },
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

type FlatTokenSection = Exclude<keyof OrcestrTheme, 'mode' | 'status'>;
type TokenValueRecord = Record<string, string | number | false>;

const flatTokenSectionOrder: Record<FlatTokenSection, true> = {
    colors: true,
    radius: true,
    spacing: true,
    breakpoints: true,
    shadows: true,
    text: true,
    motion: true,
    toast: true,
    scrollbar: true,
    states: true,
    density: true,
    zIndex: true,
    components: true,
};

const flatTokenSections = Object.keys(flatTokenSectionOrder) as FlatTokenSection[];

const statusKeys = [
    'neutral',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
    'info',
] as const;
const COLOR_TOKEN_COMMIT_DELAY_MS = 180;

const themePlaygroundCopy = {
    ru: {
        title: 'Песочница тем',
        description:
            'Выберите базовую тему и редактируйте токены вживую. Вся страница примеров использует текущий набор токенов.',
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
            radius: 'Радиус',
            spacing: 'Отступы',
            breakpoints: 'Брейкпоинты',
            shadows: 'Тени',
            text: 'Текст',
            motion: 'Движение',
            toast: 'Toast',
            scrollbar: 'Scrollbar',
            states: 'Состояния',
            density: 'Плотность',
            zIndex: 'Z-index',
            components: 'Компоненты',
        },
    },
    en: {
        title: 'Theme playground',
        description:
            'Choose a base theme and edit tokens live. The whole example page uses the current token set.',
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
            radius: 'Radius',
            spacing: 'Spacing',
            breakpoints: 'Breakpoints',
            shadows: 'Shadows',
            text: 'Text',
            motion: 'Motion',
            toast: 'Toast',
            scrollbar: 'Scrollbar',
            states: 'States',
            density: 'Density',
            zIndex: 'Z-index',
            components: 'Components',
        },
    },
} satisfies Record<
    OrcestrUiLocale,
    {
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
    }
>;

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
    const copyThemeLabel = locale === 'ru' ? 'Скопировать тему' : 'Copy theme';
    const copiedThemeLabel = locale === 'ru' ? 'Тема скопирована' : 'Theme copied';

    return (
        <section id="theme" className="oui-ui-section">
            <div className="oui-ui-section-head">
                <div>
                    <h2 className="oui-ui-section-title">{copy.title}</h2>
                    <p className="oui-ui-description">{copy.description}</p>
                </div>
            </div>
            <div className="oui-theme-playground">
                <Stack className="oui-theme-playground-presets" g={2}>
                    <ThemePresetSelector
                        activePresetId={activePreset.id as ThemePresetId}
                        locale={locale}
                        onPresetChange={onPresetChange}
                    />
                </Stack>
                <div className="oui-section oui-theme-preview">
                    <div className="oui-theme-preview-head">
                        <Text fw={760}>{copy.tokenEditor}</Text>
                        <Flex g={1} wrap j="e">
                            <CopyButton
                                size={1}
                                v="surface"
                                text={serializeTheme(theme)}
                                label={copyThemeLabel}
                                copiedLabel={copiedThemeLabel}
                                successMessage={copiedThemeLabel}
                            />
                            <Button
                                size={1}
                                v="surface"
                                onClick={() => onPresetChange(activePreset)}
                            >
                                {copy.resetPreset}
                            </Button>
                        </Flex>
                    </div>
                    <ScrollArea
                        className="oui-theme-preview-scroll"
                        highlights
                        highlightColor="var(--oui-section-opaque-bg)"
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
                        <div className="oui-theme-token-editor">
                            {flatTokenSections.map((section) => (
                                <TokenSection
                                    key={section}
                                    title={tokenSectionLabel(section, locale)}
                                    section={section}
                                    values={tokenSectionValues(theme, section)}
                                    onTokenChange={(key, value) =>
                                        updateFlatToken(onThemeOverridesChange, section, key, value)
                                    }
                                />
                            ))}
                            {statusKeys.map((statusKey) => (
                                <TokenSection
                                    key={`status-${statusKey}`}
                                    title={`${copy.statuses} / ${statusKey}`}
                                    section="status"
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
                            <Button size={1} v="surface">
                                {copy.surface}
                            </Button>
                            <Button size={1} v="ghost">
                                {copy.secondary}
                            </Button>
                            <Badge tone="success">{copy.ready}</Badge>
                            <Badge tone="warning">{copy.warning}</Badge>
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
        <div className="oui-theme-preset-grid">
            {themePresetGroups.map((group) => (
                <div key={group.key} className="oui-theme-preset-group">
                    <div className="oui-theme-preset-group-label">{group.label[locale]}</div>
                    <ScrollArea
                        className="oui-theme-preset-scroll"
                        highlights
                        highlightColor="var(--oui-section-opaque-bg)"
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
                        <div className="oui-theme-preset-list">
                            {themePlaygroundPresets
                                .filter((preset) => preset.group === group.key)
                                .map((preset) => (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        className="oui-theme-preset-card"
                                        data-active={
                                            activePresetId === preset.id ? 'true' : undefined
                                        }
                                        style={themePresetPreviewStyle(preset)}
                                        onClick={() => onPresetChange(preset)}
                                    >
                                        <span className="oui-theme-preset-preview">
                                            <span />
                                            <span />
                                            <span />
                                        </span>
                                        <span className="oui-theme-preset-body">
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
    values: TokenValueRecord;
    onTokenChange: (key: string, value: string | number | false) => void;
}) {
    return (
        <div className="oui-theme-token-section">
            <Text fs="12px" fw={760} tone="muted">
                {title}
            </Text>
            <div className="oui-theme-token-grid">
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
    const editableColor = parseEditableThemeColor(valueText);
    const colorInputValue = editableColor?.hex ?? null;
    const colorInputOpacity = editableColor?.opacity ?? null;
    const [colorDraft, setColorDraft] = useState(colorInputValue);
    const [opacityDraft, setOpacityDraft] = useState(colorInputOpacity);
    const selectOptions = selectOptionsForToken(path);
    const visibleColorValue = colorDraft ?? colorInputValue;
    const visibleOpacity = opacityDraft ?? colorInputOpacity;
    const visibleCssColor =
        visibleColorValue && visibleOpacity !== null
            ? serializeEditableThemeColor(visibleColorValue, visibleOpacity)
            : valueText;
    const changeOpacity = (nextOpacity: number) => {
        setOpacityDraft(nextOpacity);
        if (visibleColorValue) onChange(serializeEditableThemeColor(visibleColorValue, nextOpacity));
    };

    useEffect(() => {
        setColorDraft(colorInputValue);
        setOpacityDraft(colorInputOpacity);
    }, [colorInputOpacity, colorInputValue]);

    useEffect(() => {
        if (!colorDraft || opacityDraft === null) return;
        if (colorDraft === colorInputValue && opacityDraft === colorInputOpacity) return;
        const nextColor = serializeEditableThemeColor(colorDraft, opacityDraft);
        const timer = window.setTimeout(() => onChange(nextColor), COLOR_TOKEN_COMMIT_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, [colorDraft, colorInputOpacity, colorInputValue, onChange, opacityDraft]);

    const commitColorDraft = () => {
        if (!colorDraft || opacityDraft === null) return;
        if (colorDraft === colorInputValue && opacityDraft === colorInputOpacity) return;
        onChange(serializeEditableThemeColor(colorDraft, opacityDraft));
    };

    return (
        <div className="oui-theme-token oui-theme-token-control">
            <span
                className="oui-theme-token-swatch"
            >
                <span
                    className="oui-theme-token-swatch-preview"
                    style={{
                        background:
                            section === 'colors' || section === 'status'
                                ? visibleCssColor
                                : 'var(--oui-primary-surface)',
                    }}
                />
                {colorInputValue ? (
                    <input
                        className="oui-theme-token-swatch-input"
                        type="color"
                        value={visibleColorValue ?? colorInputValue}
                        aria-label={`${label} color`}
                        onChange={(event) => setColorDraft(event.target.value)}
                        onBlur={commitColorDraft}
                    />
                ) : null}
            </span>
            <span className="oui-theme-token-text">
                <Text fs="12px" fw={700}>
                    {label}
                </Text>
                <Text fs="11px" tone="muted">
                    {path}
                </Text>
            </span>
            <span className="oui-theme-token-control-field">
                {selectOptions ? (
                    <select
                        value={valueText}
                        aria-label={label}
                        onChange={(event) => onChange(event.target.value)}
                    >
                        {selectOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ) : (
                    <>
                        <span className="oui-theme-token-value-row">
                            <input
                                type={typeof value === 'number' ? 'number' : 'text'}
                                value={valueText}
                                aria-label={label}
                                onChange={(event) =>
                                    onChange(
                                        typeof value === 'number'
                                            ? Number(event.target.value)
                                            : event.target.value,
                                    )
                                }
                            />
                            {colorInputValue && visibleOpacity !== null ? (
                                <Popover
                                    side="bottom"
                                    align="end"
                                    sideOffset={6}
                                    collisionPadding={12}
                                    className="oui-theme-token-opacity-popover"
                                    trigger={
                                        <button
                                            type="button"
                                            className="oui-theme-token-opacity-trigger"
                                            aria-label={`${label} opacity settings`}
                                        >
                                            α
                                        </button>
                                    }
                                >
                                    <label className="oui-theme-token-opacity">
                                        <span>Opacity</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={Math.round(visibleOpacity * 100)}
                                            aria-label={`${label} opacity`}
                                            onInput={(event) =>
                                                changeOpacity(
                                                    Number(event.currentTarget.value) / 100,
                                                )
                                            }
                                            onBlur={commitColorDraft}
                                        />
                                        <output>{Math.round(visibleOpacity * 100)}%</output>
                                    </label>
                                </Popover>
                            ) : null}
                        </span>
                    </>
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
    if (section === 'colors' && key.includes('.')) {
        const [roleKey, slotKey] = key.split('.', 2);
        updateOverrides((current) => ({
            ...current,
            colors: {
                ...current.colors,
                [roleKey]: {
                    ...(current.colors?.[
                        roleKey as keyof NonNullable<OrcestrThemeOverrides['colors']>
                    ] as Record<string, string> | undefined),
                    [slotKey]: value,
                },
            },
        }));
        return;
    }

    updateOverrides((current) => ({
        ...current,
        [section]: {
            ...((current[section] ?? {}) as Record<string, string | number | false>),
            [key]: value,
        },
    }));
}

function tokenSectionValues(theme: OrcestrTheme, section: FlatTokenSection): TokenValueRecord {
    const values = theme[section];
    if (section !== 'colors') return values as TokenValueRecord;
    return flattenTokenValues(values as Record<string, unknown>);
}

function flattenTokenValues(values: Record<string, unknown>, prefix = ''): TokenValueRecord {
    return Object.entries(values).reduce<TokenValueRecord>((result, [key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'string' || typeof value === 'number' || value === false) {
            result[path] = value;
            return result;
        }
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, flattenTokenValues(value as Record<string, unknown>, path));
        }
        return result;
    }, {});
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

function serializeTheme(theme: OrcestrTheme) {
    return JSON.stringify(theme, null, 2);
}

function selectOptionsForToken(path: string) {
    if (path === 'modalAnimation') return ['zoom-blur', 'rise', 'fade'];
    if (path === 'pressAnimation') return ['translate', 'scale', 'soft', 'none'];
    return null;
}
