'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import type {CSSProperties} from 'react';

import {themeByMode} from './defaultTheme';
import {OrcestrThemeContext} from './useTheme';
import {cn} from '../utils/cn';
import type {
    OrcestrTheme,
    OrcestrThemeMode,
    OrcestrThemeProviderProps,
    OrcestrThemeSurface,
} from './themeTypes';

export function OrcestrThemeProvider({
    children,
    mode: controlledMode,
    defaultMode = 'dark',
    defaultSurface = 'orcestr',
    surface,
    onModeChange,
    onSurfaceChange,
    themeOverrides,
    className,
    style,
    testId,
}: OrcestrThemeProviderProps) {
    const [mode, setModeState] = useState<OrcestrThemeMode>(defaultMode);
    const [surfaceState, setSurfaceState] =
        useState<OrcestrThemeSurface>(defaultSurface);
    const resolvedMode = controlledMode ?? mode;
    const resolvedSurface = surface ?? surfaceState;
    const theme = useMemo<OrcestrTheme>(
        () => themeByMode(resolvedMode, resolvedSurface, themeOverrides),
        [resolvedMode, resolvedSurface, themeOverrides],
    );
    const setMode = useCallback(
        (next: OrcestrThemeMode) => {
            if (controlledMode === undefined) setModeState(next);
            onModeChange?.(next);
        },
        [controlledMode, onModeChange],
    );
    const setSurface = useCallback(
        (next: OrcestrThemeSurface) => {
            if (surface === undefined) setSurfaceState(next);
            onSurfaceChange?.(next);
        },
        [onSurfaceChange, surface],
    );
    const toggleMode = useCallback(() => {
        setMode(resolvedMode === 'dark' ? 'light' : 'dark');
    }, [resolvedMode, setMode]);
    const value = useMemo(
        () => ({
            mode: resolvedMode,
            surface: resolvedSurface,
            theme,
            setMode,
            setSurface,
            toggleMode,
        }),
        [resolvedMode, resolvedSurface, theme, setMode, setSurface, toggleMode],
    );
    const rootStyle = useMemo<CSSProperties>(
        () => ({
            '--oui-bg': theme.colors.bg,
            '--oui-panel': theme.colors.panel,
            '--oui-panel-2': theme.colors.panelSoft,
            '--oui-control-bg': theme.colors.control,
            '--oui-control-hover-bg': theme.colors.controlHover,
            '--oui-border': theme.colors.border,
            '--oui-border-strong': theme.colors.borderStrong,
            '--oui-text': theme.colors.text,
            '--oui-muted': theme.colors.muted,
            '--oui-soft': theme.colors.brandSoft,
            '--oui-soft-hover': theme.colors.selected,
            '--oui-brand': theme.colors.brand,
            '--oui-brand-strong': theme.colors.brandStrong,
            '--oui-brand-solid': theme.colors.brandSolid,
            '--oui-brand-solid-hover': theme.colors.brandSolidHover,
            '--oui-brand-soft': theme.colors.brandSoft,
            '--oui-success': theme.colors.success,
            '--oui-success-soft': theme.colors.successSoft,
            '--oui-warning': theme.colors.warning,
            '--oui-warning-soft': theme.colors.warningSoft,
            '--oui-danger': theme.colors.danger,
            '--oui-danger-soft': theme.colors.dangerSoft,
            '--oui-info': theme.colors.info,
            '--oui-info-soft': theme.colors.infoSoft,
            '--oui-selected-bg': theme.colors.selected,
            '--oui-disabled': theme.colors.disabled,
            '--oui-overlay-bg': theme.colors.overlay,
            '--oui-section-surface-bg': theme.colors.section,
            '--oui-section-solid-bg': compositeColor(theme.colors.section, theme.colors.bg),
            '--oui-section-nested-surface-bg': theme.colors.sectionNested,
            '--oui-section-nested-solid-bg': compositeColor(
                theme.colors.sectionNested,
                compositeColor(theme.colors.section, theme.colors.bg),
            ),
            '--oui-surface-bg': theme.colors.section || theme.colors.bg,
            '--oui-floating-bg': theme.colors.floating,
            '--oui-pad-bg': theme.colors.pad,
            '--oui-pad-hover-bg': theme.colors.padHover,
            '--oui-skeleton-shimmer': theme.colors.skeletonShimmer,
            '--oui-shadow-sm': theme.shadows.sm,
            '--oui-shadow-md': theme.shadows.md,
            '--oui-shadow-overlay': theme.shadows.overlay,
            '--oui-section-shadow': theme.shadows.section,
            '--oui-shadow-focus': theme.shadows.focus,
            '--oui-ring': theme.colors.focusRing,
            '--oui-radius': theme.radii.lg,
            '--oui-radius-sm': theme.radii.md,
            '--oui-radius-xl': theme.radii.xl,
            '--oui-space-px': theme.spacing.px,
            '--oui-space-xs': theme.spacing.xs,
            '--oui-space-sm': theme.spacing.sm,
            '--oui-space-md': theme.spacing.md,
            '--oui-space-lg': theme.spacing.lg,
            '--oui-space-xl': theme.spacing.xl,
            '--oui-space-xxl': theme.spacing.xxl,
            '--oui-space-section': theme.spacing.section,
            '--oui-space-page': theme.spacing.page,
            '--oui-breakpoint-compact': theme.breakpoints.compact,
            '--oui-breakpoint-tablet': theme.breakpoints.tablet,
            '--oui-breakpoint-desktop': theme.breakpoints.desktop,
            '--oui-breakpoint-wide': theme.breakpoints.wide,
            '--oui-font-family': theme.typography.fontFamily,
            '--oui-font-family-mono': theme.typography.monoFontFamily,
            '--oui-title-size': theme.typography.titleSize,
            '--oui-heading-size': theme.typography.headingSize,
            '--oui-body-size': theme.typography.bodySize,
            '--oui-compact-size': theme.typography.compactSize,
            '--oui-label-size': theme.typography.labelSize,
            '--oui-line-height': theme.typography.lineHeight,
            '--oui-heading-line-height': theme.typography.headingLineHeight,
            '--oui-weight-regular': theme.typography.weightRegular,
            '--oui-weight-medium': theme.typography.weightMedium,
            '--oui-weight-bold': theme.typography.weightBold,
            '--oui-letter-spacing': theme.typography.letterSpacing,
            '--oui-status-neutral': theme.status.neutral.color,
            '--oui-status-neutral-text': theme.status.neutral.text,
            '--oui-status-neutral-soft': theme.status.neutral.soft,
            '--oui-status-neutral-border': theme.status.neutral.border,
            '--oui-status-brand': theme.status.brand.color,
            '--oui-status-brand-text': theme.status.brand.text,
            '--oui-status-brand-soft': theme.status.brand.soft,
            '--oui-status-brand-border': theme.status.brand.border,
            '--oui-status-success': theme.status.success.color,
            '--oui-status-success-text': theme.status.success.text,
            '--oui-status-success-soft': theme.status.success.soft,
            '--oui-status-success-border': theme.status.success.border,
            '--oui-status-warning': theme.status.warning.color,
            '--oui-status-warning-text': theme.status.warning.text,
            '--oui-status-warning-soft': theme.status.warning.soft,
            '--oui-status-warning-border': theme.status.warning.border,
            '--oui-status-danger': theme.status.danger.color,
            '--oui-status-danger-text': theme.status.danger.text,
            '--oui-status-danger-soft': theme.status.danger.soft,
            '--oui-status-danger-border': theme.status.danger.border,
            '--oui-status-info': theme.status.info.color,
            '--oui-status-info-text': theme.status.info.text,
            '--oui-status-info-soft': theme.status.info.soft,
            '--oui-status-info-border': theme.status.info.border,
            '--oui-motion-fast': theme.motion.fast,
            '--oui-motion-duration': theme.motion.normal,
            '--oui-motion-slow': theme.motion.slow,
            '--oui-motion-ease': theme.motion.ease,
            '--oui-z-sticky': theme.zIndex.sticky,
            '--oui-z-dropdown': theme.zIndex.dropdown,
            '--oui-z-overlay': theme.zIndex.overlay,
            '--oui-z-modal': theme.zIndex.modal,
            '--oui-z-toast': theme.zIndex.toast,
            '--oui-toast-bg': theme.toast.background,
            '--oui-toast-blur': cssBlur(theme.toast.blur),
            '--oui-toast-border-color': theme.toast.borderColor,
            '--oui-toast-shadow': theme.toast.shadow,
            '--oui-toast-animation-duration': theme.toast.animationDuration,
            '--oui-toast-exit-duration': theme.toast.exitDuration,
            '--oui-toast-progress-height': theme.toast.progressHeight,
            '--oui-state-hover-opacity': theme.states.hoverOpacity,
            '--oui-state-active-opacity': theme.states.activeOpacity,
            '--oui-state-disabled-opacity': theme.states.disabledOpacity,
            '--oui-state-loading-opacity': theme.states.loadingOpacity,
            '--oui-state-selected-opacity': theme.states.selectedOpacity,
            '--oui-state-focus-ring-width': theme.states.focusRingWidth,
            '--oui-density-compact-control': theme.density.compactControl,
            '--oui-density-regular-control': theme.density.regularControl,
            '--oui-density-spacious-control': theme.density.spaciousControl,
            '--oui-page-padding': theme.density.pagePadding,
            '--oui-section-gap': theme.density.sectionGap,
            '--oui-button-radius': theme.components.buttonRadius,
            '--oui-button-font-weight': theme.components.buttonFontWeight,
            '--oui-table-cell-padding-y': theme.components.tableCellPaddingY,
            '--oui-table-header-height': theme.components.tableHeaderHeight,
            '--oui-field-gap': theme.components.fieldGap,
            '--oui-modal-max-width': theme.components.modalMaxWidth,
            '--oui-pipeline-step-min-width': theme.components.pipelineStepMinWidth,
        }) as CSSProperties,
        [theme],
    );
    const themeStyle = useMemo<CSSProperties>(
        () => ({...rootStyle, ...style}),
        [rootStyle, style],
    );

    useEffect(() => {
        const root = document.documentElement;
        const previousTheme = root.getAttribute('data-oui-theme');
        const previousSurface = root.getAttribute('data-oui-surface');
        const previousVariables = new Map<string, string>();

        for (const [name, value] of Object.entries(themeStyle)) {
            if (!name.startsWith('--oui-') || value === undefined || value === null) continue;
            previousVariables.set(name, root.style.getPropertyValue(name));
            root.style.setProperty(name, String(value));
        }

        root.setAttribute('data-oui-theme', resolvedMode);
        root.setAttribute('data-oui-surface', resolvedSurface);
        return () => {
            for (const [name, value] of previousVariables) {
                if (value) root.style.setProperty(name, value);
                else root.style.removeProperty(name);
            }
            if (previousTheme) root.setAttribute('data-oui-theme', previousTheme);
            else root.removeAttribute('data-oui-theme');
            if (previousSurface) root.setAttribute('data-oui-surface', previousSurface);
            else root.removeAttribute('data-oui-surface');
        };
    }, [resolvedMode, resolvedSurface, themeStyle]);

    return (
        <OrcestrThemeContext.Provider value={value}>
            <div
                className={cn('oui-root', className)}
                data-oui-theme={resolvedMode}
                data-oui-surface={resolvedSurface}
                data-testid={testId}
                style={themeStyle}
            >
                {children}
            </div>
        </OrcestrThemeContext.Provider>
    );
}

type RgbColor = {
    r: number;
    g: number;
    b: number;
    a: number;
};

function compositeColor(foreground: string, background: string) {
    const fg = parseCssColor(foreground);
    const bg = parseCssColor(background);
    if (!fg || !bg) return foreground;
    if (fg.a <= 0) return rgbColor(bg);
    if (fg.a >= 1) return rgbColor(fg);
    return rgbColor({
        r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
        g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
        b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
        a: 1,
    });
}

function rgbColor(color: RgbColor) {
    return `rgb(${color.r} ${color.g} ${color.b})`;
}

function parseCssColor(value: string): RgbColor | null {
    const color = value.trim().toLowerCase();
    if (color === 'transparent') return {r: 0, g: 0, b: 0, a: 0};

    const hex = parseHexColor(color);
    if (hex) return hex;

    const rgb = color.match(/^rgba?\((.+)\)$/);
    if (!rgb) return null;

    const normalized = rgb[1].replace(/\s*\/\s*/, ' / ').replace(/,/g, ' ');
    const parts = normalized.split(/\s+/).filter(Boolean);
    const slashIndex = parts.indexOf('/');
    const channels = (slashIndex === -1 ? parts : parts.slice(0, slashIndex))
        .slice(0, 3)
        .map(Number);
    if (channels.length !== 3 || channels.some((channel) => !Number.isFinite(channel))) {
        return null;
    }

    const alphaPart = slashIndex === -1 ? parts[3] : parts[slashIndex + 1];
    return {
        r: clampChannel(channels[0]),
        g: clampChannel(channels[1]),
        b: clampChannel(channels[2]),
        a: parseAlpha(alphaPart),
    };
}

function parseHexColor(color: string): RgbColor | null {
    if (/^#[0-9a-f]{3}$/i.test(color)) {
        return {
            r: Number.parseInt(color[1] + color[1], 16),
            g: Number.parseInt(color[2] + color[2], 16),
            b: Number.parseInt(color[3] + color[3], 16),
            a: 1,
        };
    }

    if (/^#[0-9a-f]{6}$/i.test(color)) {
        return {
            r: Number.parseInt(color.slice(1, 3), 16),
            g: Number.parseInt(color.slice(3, 5), 16),
            b: Number.parseInt(color.slice(5, 7), 16),
            a: 1,
        };
    }

    return null;
}

function parseAlpha(value?: string) {
    if (!value) return 1;
    const alpha = value.endsWith('%')
        ? Number.parseFloat(value) / 100
        : Number.parseFloat(value);
    if (!Number.isFinite(alpha)) return 1;
    return Math.max(0, Math.min(1, alpha));
}

function clampChannel(value: number) {
    return Math.max(0, Math.min(255, Math.round(value)));
}

function cssBlur(value: number | string | false) {
    if (value === false) return '0px';
    return typeof value === 'number' ? `${value}px` : value;
}
