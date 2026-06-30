import type {CSSProperties, ReactNode} from 'react';

export type OrcestrThemeMode = 'dark' | 'light';
export type OrcestrThemeSurface = 'orcestr' | 'operations' | 'media' | 'catalog';
export type ButtonPressAnimation = 'translate' | 'scale' | 'soft' | 'none';
export type ModalAnimation = 'zoom-blur' | 'rise' | 'fade';

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
        brand: string;
        brandStrong: string;
        brandSolid: string;
        brandSolidHover: string;
        brandSoft: string;
        brandText: string;
        danger: string;
        dangerSoft: string;
        success: string;
        successSoft: string;
        warning: string;
        warningSoft: string;
        info: string;
        infoSoft: string;
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
    radii: {
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
    typography: {
        fontFamily: string;
        monoFontFamily: string;
        titleSize: string;
        headingSize: string;
        bodySize: string;
        compactSize: string;
        labelSize: string;
        lineHeight: string;
        headingLineHeight: string;
        weightRegular: number;
        weightMedium: number;
        weightBold: number;
        letterSpacing: string;
    };
    status: {
        neutral: OrcestrThemeStatus;
        brand: OrcestrThemeStatus;
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
        borderColor: string;
        shadow: string;
        animationDuration: string;
        exitDuration: string;
        progressHeight: string;
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
        pipelineStepMinWidth: string;
    };
};

export type OrcestrThemeOverrides = Partial<
    Omit<
        OrcestrTheme,
        'colors' | 'mode' | 'surface' | 'motion' | 'radii' | 'spacing'
        | 'breakpoints' | 'shadows' | 'density' | 'zIndex' | 'toast'
        | 'typography' | 'status' | 'states' | 'components'
    >
> & {
    colors?: Partial<OrcestrTheme['colors']>;
    radii?: Partial<OrcestrTheme['radii']>;
    spacing?: Partial<OrcestrTheme['spacing']>;
    breakpoints?: Partial<OrcestrTheme['breakpoints']>;
    shadows?: Partial<OrcestrTheme['shadows']>;
    typography?: Partial<OrcestrTheme['typography']>;
    status?: PartialStatusOverrides;
    motion?: Partial<OrcestrTheme['motion']>;
    density?: Partial<OrcestrTheme['density']>;
    zIndex?: Partial<OrcestrTheme['zIndex']>;
    toast?: Partial<OrcestrTheme['toast']>;
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

export type OrcestrThemeContextValue = {
    mode: OrcestrThemeMode;
    surface: OrcestrThemeSurface;
    theme: OrcestrTheme;
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
