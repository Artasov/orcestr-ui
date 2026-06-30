'use client';

import type {CSSProperties, ReactNode} from 'react';

import {
    OrcestrUiLocaleProvider,
    type OrcestrUiCopy,
    type OrcestrUiLocale,
} from '../locale/LocaleProvider';
import {OverlayProvider, type OverlayZIndex} from '../components/Overlay/OverlayProvider';
import {ToastProvider, type ToastPosition} from '../components/Toast/Toast';
import {OrcestrThemeProvider} from '../theme/ThemeProvider';
import type {
    OrcestrThemeMode,
    OrcestrThemeOverrides,
    OrcestrThemeSurface,
} from '../theme/themeTypes';

export type OrcestrUiProviderProps = {
    children: ReactNode;
    mode?: OrcestrThemeMode;
    defaultMode?: OrcestrThemeMode;
    defaultSurface?: OrcestrThemeSurface;
    surface?: OrcestrThemeSurface;
    onModeChange?: (mode: OrcestrThemeMode) => void;
    onSurfaceChange?: (surface: OrcestrThemeSurface) => void;
    themeOverrides?: OrcestrThemeOverrides;
    locale?: OrcestrUiLocale;
    copy?: Partial<{
        [K in keyof OrcestrUiCopy]: Partial<OrcestrUiCopy[K]>;
    }>;
    portalContainer?: HTMLElement | null;
    zIndex?: Partial<OverlayZIndex>;
    toastPosition?: ToastPosition;
    toastMaxVisible?: number;
    className?: string;
    style?: CSSProperties;
    testId?: string;
};

export function OrcestrUiProvider({
    children,
    mode,
    defaultMode,
    defaultSurface,
    surface,
    onModeChange,
    onSurfaceChange,
    themeOverrides,
    locale,
    copy,
    portalContainer,
    zIndex,
    toastPosition,
    toastMaxVisible,
    className,
    style,
    testId,
}: OrcestrUiProviderProps) {
    return (
        <OrcestrUiLocaleProvider locale={locale} copy={copy}>
            <OrcestrThemeProvider
                mode={mode}
                defaultMode={defaultMode}
                defaultSurface={defaultSurface}
                surface={surface}
                onModeChange={onModeChange}
                onSurfaceChange={onSurfaceChange}
                themeOverrides={themeOverrides}
                className={className}
                style={style}
                testId={testId}
            >
                <OverlayProvider
                    container={portalContainer}
                    zIndex={zIndex}
                    testId={testId ? `${testId}-overlay-root` : undefined}
                >
                    <ToastProvider
                        defaultPosition={toastPosition}
                        maxVisible={toastMaxVisible}
                    >
                        {children}
                    </ToastProvider>
                </OverlayProvider>
            </OrcestrThemeProvider>
        </OrcestrUiLocaleProvider>
    );
}
