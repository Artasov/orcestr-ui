'use client';

import {createContext, useContext} from 'react';

import type {OrcestrThemeContextValue} from './themeTypes';

export const OrcestrThemeContext = createContext<OrcestrThemeContextValue | null>(
    null,
);

export function useOrcestrTheme(): OrcestrThemeContextValue {
    const context = useContext(OrcestrThemeContext);
    if (!context) {
        throw new Error('useOrcestrTheme must be used within OrcestrUiProvider');
    }
    return context;
}
