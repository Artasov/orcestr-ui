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
    radius: {
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
    text: {
        family:
            'var(--font-manrope, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
        mono:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        title: '22px',
        heading: '18px',
        body: '14px',
        compact: '13px',
        label: '12px',
        line: '1.45',
        headingLine: '1.18',
        regular: 450,
        medium: 650,
        bold: 760,
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
        buttonFontWeight: 500,
        tableCellPaddingY: '8px',
        tableHeaderHeight: '38px',
        fieldGap: '6px',
        modalMaxWidth: '680px',
    },
} as const satisfies Pick<
    ThemeSeed,
    | 'breakpoints'
    | 'components'
    | 'density'
    | 'motion'
    | 'radius'
    | 'spacing'
    | 'states'
    | 'text'
    | 'zIndex'
>;

const darkBase: ThemeSeed = {
    colors: {
        bg: '#09090b',
        panel: '#0c0c0f',
        panelSoft: '#222222',
        control: 'transparent',
        controlHover: '#ffffff12',
        text: '#eeeeee',
        muted: '#b4b4b4',
        border: '#ffffff1b',
        borderStrong: '#ffffff2c',
        primary: {
            base: '#0090ff',
            text: '#70b8ff',
            surface: '#0077ff3a',
            border: '#2a91fe98',
            contrast: '#ffffff',
        },
        secondary: {
            base: '#8d8d8d',
            text: '#eeeeee',
            surface: '#ffffff09',
            border: '#ffffff1b',
            contrast: '#ffffff',
        },
        neutral: {
            base: '#b4b4b4',
            text: '#eeeeee',
            surface: '#ffffff09',
            border: '#ffffff1b',
            contrast: '#ffffff',
        },
        danger: {
            base: '#e5484d',
            text: '#ff9592',
            surface: '#ff173f2d',
            border: '#ff536184',
            contrast: '#ffffff',
        },
        success: {
            base: '#30a46c',
            text: '#3dd68c',
            surface: '#22ff991e',
            border: '#50fdac5e',
            contrast: '#ffffff',
        },
        warning: {
            base: '#ffc53d',
            text: '#ffca16',
            surface: '#fa820022',
            border: '#fd9b0051',
            contrast: '#202020',
        },
        info: {
            base: '#0090ff',
            text: '#70b8ff',
            surface: '#0077ff3a',
            border: '#2a91fe98',
            contrast: '#ffffff',
        },
        selected: '#0077ff3a',
        focusRing: '0 0 0 3px #0075ff57',
        disabled: '#ffffff55',
        overlay: 'rgb(0 0 0 / 48%)',
        floating: '#0c0c0f',
        section: 'transparent',
        sectionNested: 'transparent',
        pad: '#ffffff09',
        padHover: '#ffffff12',
        skeletonShimmer: '#ffffff12',
    },
    shadows: {
        sm: 'inset 0 -1px 1px 0 #ffffff12, inset 0 0 0 1px #ffffff12, inset 0 3px 4px 0 rgb(0 0 0 / 30%), inset 0 0 0 1px #ffffff1b',
        md: '0 0 0 1px #ffffff2c, 0 2px 3px -2px rgb(0 0 0 / 15%), 0 3px 8px -2px rgb(0 0 0 / 40%), 0 4px 12px -4px rgb(0 0 0 / 50%)',
        overlay: '0 24px 70px rgb(0 0 0 / 48%)',
        section: 'none',
        focus: darkBaseFocusRing(),
    },
    status: statusTokens({
        neutral: {
            color: '#b4b4b4',
            text: '#eeeeee',
            soft: '#ffffff09',
            border: '#ffffff1b',
        },
        primary: {
            color: '#0090ff',
            text: '#70b8ff',
            soft: '#0077ff3a',
            border: '#2a91fe98',
        },
        secondary: {
            color: '#8d8d8d',
            text: '#eeeeee',
            soft: '#ffffff09',
            border: '#ffffff1b',
        },
        success: {
            color: '#30a46c',
            text: '#3dd68c',
            soft: '#22ff991e',
            border: '#50fdac5e',
        },
        warning: {
            color: '#ffc53d',
            text: '#ffca16',
            soft: '#fa820022',
            border: '#fd9b0051',
        },
        danger: {
            color: '#e5484d',
            text: '#ff9592',
            soft: '#ff173f2d',
            border: '#ff536184',
        },
        info: {
            color: '#0090ff',
            text: '#70b8ff',
            soft: '#0077ff3a',
            border: '#2a91fe98',
        },
    }),
    toast: {
        background: 'rgb(12 12 15 / 5%)',
        blur: 6,
        shadow: '0 16px 40px rgb(0 0 0 / 30%)',
        animationDuration: '420ms',
        exitDuration: '320ms',
        progressHeight: '2px',
    },
    scrollbar: {
        thumb: 'color-mix(in srgb, var(--oui-bg) 96%, var(--oui-text) 4%)',
        thumbHover: 'color-mix(in srgb, var(--oui-bg) 93%, var(--oui-text) 7%)',
        track: 'transparent',
    },
    ...sharedStructure,
};

const lightBase: ThemeSeed = {
    colors: {
        bg: '#ffffff',
        panel: '#ffffff',
        panelSoft: '#f9f9f9',
        control: 'transparent',
        controlHover: '#0000000f',
        text: '#202020',
        muted: '#646464',
        border: '#00000017',
        borderStrong: '#00000026',
        primary: {
            base: '#0090ff',
            text: '#0d74ce',
            surface: '#008ff519',
            border: '#0083eb71',
            contrast: '#ffffff',
        },
        secondary: {
            base: '#8d8d8d',
            text: '#202020',
            surface: '#00000006',
            border: '#00000017',
            contrast: '#ffffff',
        },
        neutral: {
            base: '#6b7280',
            text: '#202020',
            surface: '#00000006',
            border: '#00000017',
            contrast: '#ffffff',
        },
        danger: {
            base: '#e5484d',
            text: '#ce2c31',
            surface: '#f3000d14',
            border: '#df000356',
            contrast: '#ffffff',
        },
        success: {
            base: '#30a46c',
            text: '#218358',
            surface: '#00a43319',
            border: '#00914071',
            contrast: '#ffffff',
        },
        warning: {
            base: '#ffc53d',
            text: '#ab6400',
            surface: '#ffde003d',
            border: '#eab5008c',
            contrast: '#202020',
        },
        info: {
            base: '#0090ff',
            text: '#0d74ce',
            surface: '#008ff519',
            border: '#0083eb71',
            contrast: '#ffffff',
        },
        selected: '#008ff519',
        focusRing: '0 0 0 3px #009eff2a',
        disabled: '#00000044',
        overlay: 'rgb(15 23 42 / 36%)',
        floating: '#ffffff',
        section: 'transparent',
        sectionNested: 'transparent',
        pad: '#00000006',
        padHover: '#0000000f',
        skeletonShimmer: 'rgb(255 255 255 / 18%)',
    },
    shadows: {
        sm: 'inset 0 0 0 1px #0000001f, inset 0 1.5px 2px 0 #00000006, inset 0 1.5px 2px 0 rgb(0 0 0 / 10%)',
        md: '0 0 0 1px #0000000f, 0 2px 3px -2px #0000000f, 0 3px 12px -4px rgb(0 0 0 / 10%), 0 4px 16px -8px rgb(0 0 0 / 10%)',
        overlay: '0 24px 70px rgb(15 23 42 / 22%)',
        section: '0 8px 26px rgb(15 23 42 / 8%)',
        focus: lightBaseFocusRing(),
    },
    status: statusTokens({
        neutral: {
            color: '#6b7280',
            text: '#202020',
            soft: '#00000006',
            border: '#00000017',
        },
        primary: {
            color: '#0090ff',
            text: '#0d74ce',
            soft: '#008ff519',
            border: '#0083eb71',
        },
        secondary: {
            color: '#8d8d8d',
            text: '#202020',
            soft: '#00000006',
            border: '#00000017',
        },
        success: {
            color: '#30a46c',
            text: '#218358',
            soft: '#00a43319',
            border: '#00914071',
        },
        warning: {
            color: '#ffc53d',
            text: '#ab6400',
            soft: '#ffde003d',
            border: '#eab5008c',
        },
        danger: {
            color: '#e5484d',
            text: '#ce2c31',
            soft: '#f3000d14',
            border: '#df000356',
        },
        info: {
            color: '#0090ff',
            text: '#0d74ce',
            soft: '#008ff519',
            border: '#0083eb71',
        },
    }),
    toast: {
        background: 'rgb(255 255 255 / 5%)',
        blur: 6,
        shadow: '0 16px 40px rgb(15 23 42 / 16%)',
        animationDuration: '420ms',
        exitDuration: '320ms',
        progressHeight: '2px',
    },
    scrollbar: {
        thumb: 'color-mix(in srgb, var(--oui-bg) 95%, var(--oui-text) 5%)',
        thumbHover: 'color-mix(in srgb, var(--oui-bg) 92%, var(--oui-text) 8%)',
        track: 'transparent',
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
                bg: '#09090b',
                panel: '#0c0c0f',
                panelSoft: '#222222',
                floating: '#0c0c0f',
            },
            toast: {
                background: 'rgb(12 12 15 / 5%)',
            },
            components: {
                buttonFontWeight: 500,
                tableCellPaddingY: '8px',
                tableHeaderHeight: '38px',
            },
        },
        light: {
            colors: {
                bg: '#ffffff',
                panel: '#ffffff',
                panelSoft: '#f9f9f9',
                floating: '#ffffff',
            },
            toast: {
                background: 'rgb(255 255 255 / 5%)',
            },
            components: {
                buttonFontWeight: 500,
                tableCellPaddingY: '8px',
                tableHeaderHeight: '38px',
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
                primary: {
                    base: '#a84486',
                    text: '#ffc1e7',
                    surface: 'rgb(240 166 216 / 17%)',
                    border: 'rgb(255 193 231 / 28%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(240 166 216 / 16%)',
                focusRing: '0 0 0 3px rgb(240 166 216 / 24%)',
                warning: {
                    base: '#ffd079',
                    text: '#ffd079',
                    surface: '#49371c',
                    border: 'rgb(255 208 121 / 34%)',
                    contrast: '#202020',
                },
                info: {
                    base: '#9bd7ff',
                    text: '#9bd7ff',
                    surface: '#19394d',
                    border: 'rgb(155 215 255 / 32%)',
                    contrast: '#202020',
                },
            },
            toast: {
                background: 'rgb(29 24 32 / 5%)',
                shadow: '0 12px 32px rgb(0 0 0 / 22%)',
            },
            radius: {
                md: '8px',
                lg: '10px',
            },
        },
        light: {
            colors: {
                bg: '#fff8fc',
                panel: '#ffffff',
                panelSoft: '#fff0f8',
                primary: {
                    base: '#c0267f',
                    text: '#a21d6c',
                    surface: 'rgb(192 38 127 / 12%)',
                    border: 'rgb(192 38 127 / 24%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(192 38 127 / 10%)',
                focusRing: '0 0 0 3px rgb(192 38 127 / 16%)',
                warning: {
                    base: '#b96b00',
                    text: '#b96b00',
                    surface: '#fff1d0',
                    border: 'rgb(185 107 0 / 26%)',
                    contrast: '#ffffff',
                },
                info: {
                    base: '#0876bd',
                    text: '#0876bd',
                    surface: '#e6f5ff',
                    border: 'rgb(8 118 189 / 24%)',
                    contrast: '#ffffff',
                },
            },
            toast: {
                background: 'rgb(255 255 255 / 5%)',
            },
            radius: {
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
                primary: {
                    base: '#9b6f12',
                    text: '#f1d990',
                    surface: 'rgb(230 194 106 / 16%)',
                    border: 'rgb(241 217 144 / 28%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(230 194 106 / 14%)',
                focusRing: '0 0 0 3px rgb(230 194 106 / 22%)',
                warning: {
                    base: '#f4c95d',
                    text: '#f4c95d',
                    surface: '#493814',
                    border: 'rgb(244 201 93 / 34%)',
                    contrast: '#202020',
                },
                info: {
                    base: '#9fc5ff',
                    text: '#9fc5ff',
                    surface: '#1a314f',
                    border: 'rgb(159 197 255 / 32%)',
                    contrast: '#202020',
                },
            },
            toast: {
                background: 'rgb(25 23 18 / 5%)',
            },
            radius: {
                md: '6px',
                lg: '8px',
            },
        },
        light: {
            colors: {
                bg: '#fbfaf6',
                panel: '#ffffff',
                panelSoft: '#f3efe4',
                primary: {
                    base: '#9b6f12',
                    text: '#79570e',
                    surface: 'rgb(155 111 18 / 12%)',
                    border: 'rgb(155 111 18 / 24%)',
                    contrast: '#ffffff',
                },
                selected: 'rgb(155 111 18 / 10%)',
                focusRing: '0 0 0 3px rgb(155 111 18 / 16%)',
                warning: {
                    base: '#a16207',
                    text: '#a16207',
                    surface: '#fff4cf',
                    border: 'rgb(161 98 7 / 26%)',
                    contrast: '#ffffff',
                },
                info: {
                    base: '#2563eb',
                    text: '#2563eb',
                    surface: '#e9f1ff',
                    border: 'rgb(37 99 235 / 24%)',
                    contrast: '#ffffff',
                },
            },
            toast: {
                background: 'rgb(255 255 255 / 5%)',
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
        colors: mergeColors(baseTheme.colors, overrides.colors),
        radius: {...baseTheme.radius, ...overrides.radius},
        spacing: {...baseTheme.spacing, ...overrides.spacing},
        breakpoints: {...baseTheme.breakpoints, ...overrides.breakpoints},
        shadows: {...baseTheme.shadows, ...overrides.shadows},
        text: {...baseTheme.text, ...overrides.text},
        status: mergeStatus(baseTheme.status, overrides.status),
        motion: {...baseTheme.motion, ...overrides.motion},
        density: {...baseTheme.density, ...overrides.density},
        zIndex: {...baseTheme.zIndex, ...overrides.zIndex},
        toast: {...baseTheme.toast, ...overrides.toast},
        scrollbar: {...baseTheme.scrollbar, ...overrides.scrollbar},
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
    return '0 0 0 3px #0075ff57';
}

function lightBaseFocusRing() {
    return '0 0 0 3px #009eff2a';
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
        primary: {...baseStatus.primary, ...overrides.primary},
        secondary: {...baseStatus.secondary, ...overrides.secondary},
        success: {...baseStatus.success, ...overrides.success},
        warning: {...baseStatus.warning, ...overrides.warning},
        danger: {...baseStatus.danger, ...overrides.danger},
        info: {...baseStatus.info, ...overrides.info},
    };
}

function mergeColors(
    baseColors: OrcestrTheme['colors'],
    overrides?: OrcestrThemeOverrides['colors'],
) {
    if (!overrides) return baseColors;
    return {
        ...baseColors,
        ...overrides,
        primary: {...baseColors.primary, ...overrides.primary},
        secondary: {...baseColors.secondary, ...overrides.secondary},
        neutral: {...baseColors.neutral, ...overrides.neutral},
        danger: {...baseColors.danger, ...overrides.danger},
        success: {...baseColors.success, ...overrides.success},
        warning: {...baseColors.warning, ...overrides.warning},
        info: {...baseColors.info, ...overrides.info},
    };
}
