import type {
    OrcestrTheme,
    OrcestrThemeMode,
    OrcestrThemeOverrides,
    OrcestrThemeSurface,
} from './themeTypes';

type ThemeSeed = Omit<OrcestrTheme, 'mode' | 'surface'>;

export type OrcestrThemeSurfaceDefinition = {
    value: OrcestrThemeSurface;
    label: string;
    description: string;
};

export const orcestrThemeSurfaceRegistry: Record<
    OrcestrThemeSurface,
    OrcestrThemeSurfaceDefinition
> = {
    orcestr: {
        value: 'orcestr',
        label: 'Orcestr',
        description: 'Neutral platform base for shared entity surfaces.',
    },
    operations: {
        value: 'operations',
        label: 'Operations',
        description: 'Dense theme for repeated operational work.',
    },
    media: {
        value: 'media',
        label: 'Media',
        description: 'Softer visual theme for content-heavy flows.',
    },
    catalog: {
        value: 'catalog',
        label: 'Catalog',
        description: 'Precise catalog theme for structured index surfaces.',
    },
};

export const orcestrThemeSurfaces: OrcestrThemeSurfaceDefinition[] = [
    orcestrThemeSurfaceRegistry.orcestr,
    orcestrThemeSurfaceRegistry.operations,
    orcestrThemeSurfaceRegistry.media,
    orcestrThemeSurfaceRegistry.catalog,
];

const sharedStructure = {
    radii: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '999px',
    },
    spacing: {
        px: '1px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
        section: '18px',
        page: '28px',
    },
    breakpoints: {
        compact: '560px',
        tablet: '720px',
        desktop: '1024px',
        wide: '1440px',
    },
    typography: {
        fontFamily:
            'var(--font-manrope, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
        monoFontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        titleSize: '22px',
        headingSize: '18px',
        bodySize: '14px',
        compactSize: '13px',
        labelSize: '12px',
        lineHeight: '1.45',
        headingLineHeight: '1.18',
        weightRegular: 450,
        weightMedium: 650,
        weightBold: 760,
        letterSpacing: '0',
    },
    motion: {
        fast: '120ms',
        normal: '180ms',
        slow: '260ms',
        modalDuration: '380ms',
        modalAnimation: 'zoom-blur',
        modalOverlayColor: 'transparent',
        modalOverlayOpacity: 0,
        modalOverlayBlur: 10,
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
        pressAnimation: 'soft',
    },
    density: {
        compactControl: '30px',
        regularControl: '36px',
        spaciousControl: '42px',
        pagePadding: '28px',
        sectionGap: '18px',
    },
    states: {
        hoverOpacity: 0.065,
        activeOpacity: 0.1,
        disabledOpacity: 0.56,
        loadingOpacity: 0.78,
        selectedOpacity: 0.15,
        focusRingWidth: '3px',
    },
    zIndex: {
        sticky: 20,
        dropdown: 50,
        overlay: 70,
        modal: 90,
        toast: 120,
    },
    components: {
        buttonRadius: '6px',
        buttonFontWeight: 650,
        tableCellPaddingY: '10px',
        tableHeaderHeight: '42px',
        fieldGap: '6px',
        modalMaxWidth: '680px',
        pipelineStepMinWidth: '130px',
    },
} as const satisfies Pick<
    ThemeSeed,
    | 'breakpoints'
    | 'components'
    | 'density'
    | 'motion'
    | 'radii'
    | 'spacing'
    | 'states'
    | 'typography'
    | 'zIndex'
>;

const darkBase: ThemeSeed = {
    colors: {
        bg: '#111318',
        panel: '#171a21',
        panelSoft: '#20242d',
        control: 'transparent',
        controlHover: 'rgb(255 255 255 / 6%)',
        text: '#f4f6f8',
        muted: '#9aa4b2',
        border: 'rgb(255 255 255 / 10%)',
        borderStrong: 'rgb(255 255 255 / 20%)',
        brand: '#6ea0ff',
        brandStrong: '#93b8ff',
        brandSolid: '#315fbe',
        brandSolidHover: '#3b70d8',
        brandSoft: 'rgb(110 160 255 / 16%)',
        brandText: '#ffffff',
        danger: '#ff7b72',
        dangerSoft: 'rgb(255 123 114 / 14%)',
        success: '#5fd3a1',
        successSoft: '#173a31',
        warning: '#f3c969',
        warningSoft: '#443516',
        info: '#71c7ff',
        infoSoft: '#173852',
        selected: 'rgb(110 160 255 / 15%)',
        focusRing: '0 0 0 3px rgb(106 160 255 / 22%)',
        disabled: 'rgb(154 164 178 / 42%)',
        overlay: 'rgb(0 0 0 / 48%)',
        floating: '#161a22',
        section: 'rgb(255 255 255 / 2%)',
        sectionNested: 'rgb(255 255 255 / 2%)',
        pad: 'rgb(255 255 255 / 2%)',
        padHover: 'rgb(255 255 255 / 4.5%)',
        skeletonShimmer: 'rgb(255 255 255 / 8%)',
    },
    shadows: {
        sm: '0 2px 10px rgb(0 0 0 / 22%)',
        md: '0 16px 48px rgb(0 0 0 / 42%)',
        overlay: '0 24px 70px rgb(0 0 0 / 48%)',
        section: 'none',
        focus: darkBaseFocusRing(),
    },
    status: statusTokens({
        neutral: {
            color: '#9aa4b2',
            text: '#f4f6f8',
            soft: 'rgb(255 255 255 / 2%)',
            border: 'rgb(255 255 255 / 10%)',
        },
        brand: {
            color: '#6ea0ff',
            text: '#93b8ff',
            soft: 'rgb(110 160 255 / 16%)',
            border: 'rgb(110 160 255 / 34%)',
        },
        success: {
            color: '#5fd3a1',
            text: '#5fd3a1',
            soft: '#173a31',
            border: 'rgb(95 211 161 / 30%)',
        },
        warning: {
            color: '#f3c969',
            text: '#f3c969',
            soft: '#443516',
            border: 'rgb(243 201 105 / 32%)',
        },
        danger: {
            color: '#ff7b72',
            text: '#ff7b72',
            soft: 'rgb(255 123 114 / 14%)',
            border: 'rgb(255 123 114 / 34%)',
        },
        info: {
            color: '#71c7ff',
            text: '#71c7ff',
            soft: '#173852',
            border: 'rgb(113 199 255 / 30%)',
        },
    }),
    toast: {
        background: 'rgb(22 26 34 / 86%)',
        blur: 14,
        borderColor: 'rgb(255 255 255 / 14%)',
        shadow: '0 12px 32px rgb(0 0 0 / 24%)',
        animationDuration: '520ms',
        exitDuration: '260ms',
        progressHeight: '1px',
    },
    ...sharedStructure,
};

const lightBase: ThemeSeed = {
    colors: {
        bg: '#f8fafc',
        panel: '#ffffff',
        panelSoft: '#f3f6fa',
        control: 'transparent',
        controlHover: 'rgb(15 23 42 / 6%)',
        text: '#111827',
        muted: '#6b7280',
        border: 'rgb(15 23 42 / 12%)',
        borderStrong: 'rgb(15 23 42 / 24%)',
        brand: '#2563eb',
        brandStrong: '#1d4ed8',
        brandSolid: '#2563eb',
        brandSolidHover: '#1d4ed8',
        brandSoft: 'rgb(37 99 235 / 12%)',
        brandText: '#ffffff',
        danger: '#dc2626',
        dangerSoft: 'rgb(220 38 38 / 12%)',
        success: '#0f9f6e',
        successSoft: '#e8f8f2',
        warning: '#bd7a00',
        warningSoft: '#fff6db',
        info: '#0876bd',
        infoSoft: '#e7f4ff',
        selected: 'rgb(37 99 235 / 10%)',
        focusRing: '0 0 0 3px rgb(37 99 235 / 16%)',
        disabled: 'rgb(107 114 128 / 46%)',
        overlay: 'rgb(15 23 42 / 36%)',
        floating: '#ffffff',
        section: 'transparent',
        sectionNested: 'transparent',
        pad: 'rgb(15 23 42 / 3.5%)',
        padHover: 'rgb(15 23 42 / 5.5%)',
        skeletonShimmer: 'rgb(255 255 255 / 18%)',
    },
    shadows: {
        sm: '0 2px 8px rgb(17 24 39 / 8%)',
        md: '0 16px 48px rgb(15 23 42 / 18%)',
        overlay: '0 24px 70px rgb(15 23 42 / 22%)',
        section: '0 8px 26px rgb(15 23 42 / 8%)',
        focus: lightBaseFocusRing(),
    },
    status: statusTokens({
        neutral: {
            color: '#6b7280',
            text: '#111827',
            soft: 'rgb(15 23 42 / 3.5%)',
            border: 'rgb(15 23 42 / 12%)',
        },
        brand: {
            color: '#2563eb',
            text: '#1d4ed8',
            soft: 'rgb(37 99 235 / 12%)',
            border: 'rgb(37 99 235 / 28%)',
        },
        success: {
            color: '#0f9f6e',
            text: '#0f9f6e',
            soft: '#e8f8f2',
            border: 'rgb(15 159 110 / 26%)',
        },
        warning: {
            color: '#bd7a00',
            text: '#bd7a00',
            soft: '#fff6db',
            border: 'rgb(189 122 0 / 28%)',
        },
        danger: {
            color: '#dc2626',
            text: '#dc2626',
            soft: 'rgb(220 38 38 / 12%)',
            border: 'rgb(220 38 38 / 28%)',
        },
        info: {
            color: '#0876bd',
            text: '#0876bd',
            soft: '#e7f4ff',
            border: 'rgb(8 118 189 / 26%)',
        },
    }),
    toast: {
        background: 'rgb(255 255 255 / 86%)',
        blur: 14,
        borderColor: 'rgb(15 23 42 / 12%)',
        shadow: '0 12px 30px rgb(15 23 42 / 12%)',
        animationDuration: '520ms',
        exitDuration: '260ms',
        progressHeight: '1px',
    },
    ...sharedStructure,
};

const surfaceOverrides: Record<
    OrcestrThemeSurface,
    Record<OrcestrThemeMode, OrcestrThemeOverrides>
> = {
    orcestr: {
        dark: {},
        light: {},
    },
    operations: {
        dark: {
            colors: {
                bg: '#0f1216',
                panel: '#151a20',
                panelSoft: '#1d252e',
                floating: '#151a20',
                brand: '#5dd4a4',
                brandStrong: '#7ee6ba',
                brandSolid: '#16885d',
                brandSolidHover: '#1fa06f',
                brandSoft: 'rgb(93 212 164 / 16%)',
                selected: 'rgb(93 212 164 / 15%)',
                focusRing: '0 0 0 3px rgb(93 212 164 / 22%)',
                info: '#82cfff',
                infoSoft: '#15364b',
            },
            toast: {
                background: 'rgb(21 26 32 / 88%)',
            },
            components: {
                tableCellPaddingY: '8px',
                tableHeaderHeight: '38px',
                pipelineStepMinWidth: '148px',
            },
        },
        light: {
            colors: {
                bg: '#f6faf8',
                panel: '#ffffff',
                panelSoft: '#edf5f1',
                brand: '#12815c',
                brandStrong: '#0f6f4f',
                brandSolid: '#12815c',
                brandSolidHover: '#0f6f4f',
                brandSoft: 'rgb(18 129 92 / 12%)',
                selected: 'rgb(18 129 92 / 10%)',
                focusRing: '0 0 0 3px rgb(18 129 92 / 16%)',
                info: '#0969a8',
                infoSoft: '#e4f2fb',
            },
            toast: {
                background: 'rgb(255 255 255 / 88%)',
            },
            components: {
                tableCellPaddingY: '8px',
                tableHeaderHeight: '38px',
                pipelineStepMinWidth: '148px',
            },
        },
    },
    media: {
        dark: {
            colors: {
                bg: '#141116',
                panel: '#1d1820',
                panelSoft: '#29212d',
                floating: '#1d1820',
                brand: '#f0a6d8',
                brandStrong: '#ffc1e7',
                brandSolid: '#a84486',
                brandSolidHover: '#bc5399',
                brandSoft: 'rgb(240 166 216 / 17%)',
                selected: 'rgb(240 166 216 / 16%)',
                focusRing: '0 0 0 3px rgb(240 166 216 / 24%)',
                warning: '#ffd079',
                warningSoft: '#49371c',
                info: '#9bd7ff',
                infoSoft: '#19394d',
            },
            toast: {
                background: 'rgb(29 24 32 / 88%)',
                borderColor: 'rgb(255 193 231 / 16%)',
                shadow: '0 12px 32px rgb(0 0 0 / 22%)',
            },
            radii: {
                md: '8px',
                lg: '10px',
            },
        },
        light: {
            colors: {
                bg: '#fff8fc',
                panel: '#ffffff',
                panelSoft: '#fff0f8',
                brand: '#c0267f',
                brandStrong: '#a21d6c',
                brandSolid: '#c0267f',
                brandSolidHover: '#a21d6c',
                brandSoft: 'rgb(192 38 127 / 12%)',
                selected: 'rgb(192 38 127 / 10%)',
                focusRing: '0 0 0 3px rgb(192 38 127 / 16%)',
                warning: '#b96b00',
                warningSoft: '#fff1d0',
                info: '#0876bd',
                infoSoft: '#e6f5ff',
            },
            toast: {
                background: 'rgb(255 255 255 / 88%)',
                borderColor: 'rgb(192 38 127 / 13%)',
            },
            radii: {
                md: '8px',
                lg: '10px',
            },
        },
    },
    catalog: {
        dark: {
            colors: {
                bg: '#11100d',
                panel: '#191712',
                panelSoft: '#242017',
                floating: '#191712',
                brand: '#e6c26a',
                brandStrong: '#f1d990',
                brandSolid: '#9b6f12',
                brandSolidHover: '#b98219',
                brandSoft: 'rgb(230 194 106 / 16%)',
                selected: 'rgb(230 194 106 / 14%)',
                focusRing: '0 0 0 3px rgb(230 194 106 / 22%)',
                warning: '#f4c95d',
                warningSoft: '#493814',
                info: '#9fc5ff',
                infoSoft: '#1a314f',
            },
            toast: {
                background: 'rgb(25 23 18 / 88%)',
                borderColor: 'rgb(241 217 144 / 15%)',
            },
            radii: {
                md: '6px',
                lg: '8px',
            },
        },
        light: {
            colors: {
                bg: '#fbfaf6',
                panel: '#ffffff',
                panelSoft: '#f3efe4',
                brand: '#9b6f12',
                brandStrong: '#79570e',
                brandSolid: '#9b6f12',
                brandSolidHover: '#79570e',
                brandSoft: 'rgb(155 111 18 / 12%)',
                selected: 'rgb(155 111 18 / 10%)',
                focusRing: '0 0 0 3px rgb(155 111 18 / 16%)',
                warning: '#a16207',
                warningSoft: '#fff4cf',
                info: '#2563eb',
                infoSoft: '#e9f1ff',
            },
            toast: {
                background: 'rgb(255 255 255 / 88%)',
                borderColor: 'rgb(155 111 18 / 13%)',
            },
        },
    },
};

function mergeTheme(
    baseTheme: OrcestrTheme,
    overrides?: OrcestrThemeOverrides,
): OrcestrTheme {
    if (!overrides) return baseTheme;
    return {
        ...baseTheme,
        ...overrides,
        mode: baseTheme.mode,
        surface: baseTheme.surface,
        colors: {...baseTheme.colors, ...overrides.colors},
        radii: {...baseTheme.radii, ...overrides.radii},
        spacing: {...baseTheme.spacing, ...overrides.spacing},
        breakpoints: {...baseTheme.breakpoints, ...overrides.breakpoints},
        shadows: {...baseTheme.shadows, ...overrides.shadows},
        typography: {...baseTheme.typography, ...overrides.typography},
        status: mergeStatus(baseTheme.status, overrides.status),
        motion: {...baseTheme.motion, ...overrides.motion},
        density: {...baseTheme.density, ...overrides.density},
        zIndex: {...baseTheme.zIndex, ...overrides.zIndex},
        toast: {...baseTheme.toast, ...overrides.toast},
        states: {...baseTheme.states, ...overrides.states},
        components: {...baseTheme.components, ...overrides.components},
    };
}

export function themeByMode(
    mode: OrcestrThemeMode,
    surface: OrcestrThemeSurface = 'orcestr',
    themeOverrides?: OrcestrThemeOverrides,
): OrcestrTheme {
    const seed = mode === 'light' ? lightBase : darkBase;
    const baseTheme: OrcestrTheme = {
        mode,
        surface,
        ...seed,
    };
    const surfaceTheme = mergeTheme(baseTheme, surfaceOverrides[surface][mode]);
    return mergeTheme(surfaceTheme, themeOverrides);
}

export const darkTheme: OrcestrTheme = themeByMode('dark');
export const lightTheme: OrcestrTheme = themeByMode('light');

function darkBaseFocusRing() {
    return '0 0 0 3px rgb(106 160 255 / 22%)';
}

function lightBaseFocusRing() {
    return '0 0 0 3px rgb(37 99 235 / 16%)';
}

function statusTokens(tokens: OrcestrTheme['status']) {
    return tokens;
}

function mergeStatus(
    baseStatus: OrcestrTheme['status'],
    overrides?: OrcestrThemeOverrides['status'],
) {
    if (!overrides) return baseStatus;
    return {
        neutral: {...baseStatus.neutral, ...overrides.neutral},
        brand: {...baseStatus.brand, ...overrides.brand},
        success: {...baseStatus.success, ...overrides.success},
        warning: {...baseStatus.warning, ...overrides.warning},
        danger: {...baseStatus.danger, ...overrides.danger},
        info: {...baseStatus.info, ...overrides.info},
    };
}
