import type {CSSProperties, ReactNode} from 'react';

export type OrcestrThemeMode = 'dark' | 'light';
export type OrcestrThemeSurface = 'orcestr' | 'operations' | 'media' | 'catalog';
export type ButtonPressAnimation = 'translate' | 'scale' | 'soft' | 'none';
export type ModalAnimation = 'zoom-blur' | 'rise' | 'fade';
export type OrcestrThemeColorRole = {
    base: string;
    text: string;
    surface: string;
    border: string;
    contrast: string;
};

export type OrcestrTheme = {
    mode: OrcestrThemeMode;
    surface: OrcestrThemeSurface;
    colors: {
        bg: string;
        panel: string;
        panelSoft: string;
        control: string;
        controlHover: string;
        text: string;
        muted: string;
        border: string;
        borderStrong: string;
        primary: OrcestrThemeColorRole;
        secondary: OrcestrThemeColorRole;
        neutral: OrcestrThemeColorRole;
        danger: OrcestrThemeColorRole;
        success: OrcestrThemeColorRole;
        warning: OrcestrThemeColorRole;
        info: OrcestrThemeColorRole;
        selected: string;
        focusRing: string;
        disabled: string;
        overlay: string;
        floating: string;
        section: string;
        sectionNested: string;
        pad: string;
        padHover: string;
        skeletonShimmer: string;
    };
    radius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        full: string;
    };
    spacing: {
        px: string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
        section: string;
        page: string;
    };
    breakpoints: {
        compact: string;
        tablet: string;
        desktop: string;
        wide: string;
    };
    shadows: {
        sm: string;
        md: string;
        overlay: string;
        section: string;
        focus: string;
    };
    text: {
        family: string;
        mono: string;
        title: string;
        heading: string;
        body: string;
        compact: string;
        label: string;
        line: string;
        headingLine: string;
        regular: number;
        medium: number;
        bold: number;
        letterSpacing: string;
    };
    status: {
        neutral: OrcestrThemeStatus;
        primary: OrcestrThemeStatus;
        secondary: OrcestrThemeStatus;
        success: OrcestrThemeStatus;
        warning: OrcestrThemeStatus;
        danger: OrcestrThemeStatus;
        info: OrcestrThemeStatus;
    };
    motion: {
        fast: string;
        normal: string;
        slow: string;
        modalDuration: string;
        modalAnimation: ModalAnimation;
        modalOverlayColor: string;
        modalOverlayOpacity: number;
        modalOverlayBlur: number | string;
        ease: string;
        pressAnimation: ButtonPressAnimation;
    };
    toast: {
        background: string;
        blur: number | string | false;
        shadow: string;
        animationDuration: string;
        exitDuration: string;
        progressHeight: string;
    };
    scrollbar: {
        thumb: string;
        thumbHover: string;
        track: string;
    };
    states: {
        hoverOpacity: number;
        activeOpacity: number;
        disabledOpacity: number;
        loadingOpacity: number;
        selectedOpacity: number;
        focusRingWidth: string;
    };
    density: {
        compactControl: string;
        regularControl: string;
        spaciousControl: string;
        pagePadding: string;
        sectionGap: string;
    };
    zIndex: {
        sticky: number;
        dropdown: number;
        overlay: number;
        modal: number;
        toast: number;
    };
    components: {
        buttonRadius: string;
        buttonFontWeight: number;
        tableCellPaddingY: string;
        tableHeaderHeight: string;
        fieldGap: string;
        modalMaxWidth: string;
    };
};

export type OrcestrThemeOverrides = Partial<
    Omit<
        OrcestrTheme,
        'colors' | 'mode' | 'surface' | 'motion' | 'radius' | 'spacing'
        | 'breakpoints' | 'shadows' | 'density' | 'zIndex' | 'toast'
        | 'scrollbar' | 'text' | 'status' | 'states' | 'components'
    >
> & {
    colors?: PartialColorOverrides;
    radius?: Partial<OrcestrTheme['radius']>;
    spacing?: Partial<OrcestrTheme['spacing']>;
    breakpoints?: Partial<OrcestrTheme['breakpoints']>;
    shadows?: Partial<OrcestrTheme['shadows']>;
    text?: Partial<OrcestrTheme['text']>;
    status?: PartialStatusOverrides;
    motion?: Partial<OrcestrTheme['motion']>;
    density?: Partial<OrcestrTheme['density']>;
    zIndex?: Partial<OrcestrTheme['zIndex']>;
    toast?: Partial<OrcestrTheme['toast']>;
    scrollbar?: Partial<OrcestrTheme['scrollbar']>;
    states?: Partial<OrcestrTheme['states']>;
    components?: Partial<OrcestrTheme['components']>;
};

export type OrcestrThemeStatus = {
    color: string;
    text: string;
    soft: string;
    border: string;
};

type PartialStatusOverrides = Partial<{
    [K in keyof OrcestrTheme['status']]: Partial<OrcestrThemeStatus>;
}>;

type PartialColorOverrides = Partial<
    Omit<
        OrcestrTheme['colors'],
        | 'primary'
        | 'secondary'
        | 'neutral'
        | 'danger'
        | 'success'
        | 'warning'
        | 'info'
    >
> & {
    [K in
        | 'primary'
        | 'secondary'
        | 'neutral'
        | 'danger'
        | 'success'
        | 'warning'
        | 'info']?: Partial<OrcestrThemeColorRole>;
};

export type OrcestrThemeContextValue = {
    mode: OrcestrThemeMode;
    surface: OrcestrThemeSurface;
    theme: OrcestrTheme;
    cssVariables: CSSProperties;
    setMode: (mode: OrcestrThemeMode) => void;
    setSurface: (surface: OrcestrThemeSurface) => void;
    toggleMode: () => void;
};

export type OrcestrThemeProviderProps = {
    children: ReactNode;
    mode?: OrcestrThemeMode;
    defaultMode?: OrcestrThemeMode;
    defaultSurface?: OrcestrThemeSurface;
    surface?: OrcestrThemeSurface;
    onModeChange?: (mode: OrcestrThemeMode) => void;
    onSurfaceChange?: (surface: OrcestrThemeSurface) => void;
    themeOverrides?: OrcestrThemeOverrides;
    className?: string;
    style?: CSSProperties;
    testId?: string;
};
