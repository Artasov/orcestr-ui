'use client';

import type { CSSProperties, ReactNode } from 'react';

import {
    OrcestrUiLocaleProvider,
    type OrcestrUiCopy,
    type OrcestrUiLocale,
} from '../locale/LocaleProvider.js';
import { OverlayProvider, type OverlayZIndex } from '../components/Overlay/OverlayProvider.js';
import { ToastProvider, type ToastPosition } from '../components/Toast/Toast.js';
import { OrcestrThemeProvider } from '../theme/ThemeProvider.js';
import type { OrcestrThemeMode, OrcestrThemeOverrides } from '../theme/themeTypes.js';

export type OrcestrUiProviderProps = {
    children: ReactNode;
    mode?: OrcestrThemeMode;
    defaultMode?: OrcestrThemeMode;
    onModeChange?: (mode: OrcestrThemeMode) => void;
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
    onModeChange,
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
                onModeChange={onModeChange}
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
                    <ToastProvider defaultPosition={toastPosition} maxVisible={toastMaxVisible}>
                        {children}
                    </ToastProvider>
                </OverlayProvider>
            </OrcestrThemeProvider>
        </OrcestrUiLocaleProvider>
    );
}
