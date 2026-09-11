'use client';

import { useCallback, useRef, useState } from 'react';

import { useFloatingPosition, type FloatingAlign, type FloatingSide } from './useFloatingPosition.js';
import { usePresence } from './usePresence.js';

type UseFloatingLayerOptions = {
    open: boolean;
    presenceDuration?: number;
    side?: FloatingSide;
    align?: FloatingAlign;
    sideOffset?: number;
    collisionPadding?: number;
    matchTriggerWidth?: boolean;
    avoidCollisions?: boolean;
    collisionBoundary?: 'clipping-ancestors' | 'viewport';
    avoidTriggerOverlap?: boolean;
    maxContentWidth?: number;
};

export function useFloatingLayer<TTrigger extends HTMLElement, TContent extends HTMLElement>({
    open,
    presenceDuration = 180,
    side = 'bottom',
    align = 'start',
    sideOffset = 8,
    collisionPadding = 8,
    matchTriggerWidth = false,
    avoidCollisions = true,
    collisionBoundary = 'clipping-ancestors',
    avoidTriggerOverlap = false,
    maxContentWidth,
}: UseFloatingLayerOptions) {
    const triggerRef = useRef<TTrigger | null>(null);
    const contentRef = useRef<TContent | null>(null);
    const [contentNode, setContentNode] = useState<TContent | null>(null);
    const mountContentRef = useCallback((node: TContent | null) => {
        contentRef.current = node;
        setContentNode(node);
    }, []);
    const { present, state } = usePresence(open, presenceDuration);
    const { style } = useFloatingPosition({
        triggerRef,
        contentRef,
        open: present && contentNode !== null,
        side,
        align,
        sideOffset,
        collisionPadding,
        matchTriggerWidth,
        avoidCollisions,
        collisionBoundary,
        avoidTriggerOverlap,
        maxContentWidth,
    });

    return {
        triggerRef,
        contentRef,
        mountContentRef,
        present,
        state,
        style,
    };
}
