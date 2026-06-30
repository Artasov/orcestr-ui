'use client';

import {useRef} from 'react';

import {
    useFloatingPosition,
    type FloatingAlign,
    type FloatingSide,
} from './useFloatingPosition';
import {usePresence} from './usePresence';

type UseFloatingLayerOptions = {
    open: boolean;
    presenceDuration?: number;
    side?: FloatingSide;
    align?: FloatingAlign;
    sideOffset?: number;
    collisionPadding?: number;
    matchTriggerWidth?: boolean;
};

export function useFloatingLayer<
    TTrigger extends HTMLElement,
    TContent extends HTMLElement,
>({
    open,
    presenceDuration = 180,
    side = 'bottom',
    align = 'start',
    sideOffset = 8,
    collisionPadding = 8,
    matchTriggerWidth = false,
}: UseFloatingLayerOptions) {
    const triggerRef = useRef<TTrigger | null>(null);
    const contentRef = useRef<TContent | null>(null);
    const {present, state} = usePresence(open, presenceDuration);
    const {style} = useFloatingPosition({
        triggerRef,
        contentRef,
        open: present,
        side,
        align,
        sideOffset,
        collisionPadding,
        matchTriggerWidth,
    });

    return {
        triggerRef,
        contentRef,
        present,
        state,
        style,
    };
}
