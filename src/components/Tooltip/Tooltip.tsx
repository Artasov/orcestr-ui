'use client';

import {useState, type ReactNode} from 'react';

import {type FloatingSide} from '../../hooks/useFloatingPosition';
import {useFloatingLayer} from '../../hooks/useFloatingLayer';
import {cn} from '../../utils/cn';
import {useOverlayContext, useOverlayLayerIndex} from '../Overlay/OverlayProvider';
import {Portal} from '../Portal/Portal';

export function Tooltip({
    content,
    children,
    side = 'top',
    className,
    testId,
}: {
    content: ReactNode;
    children: ReactNode;
    side?: FloatingSide;
    className?: string;
    testId?: string;
}) {
    const overlay = useOverlayContext();
    const [open, setOpen] = useState(false);
    const {
        triggerRef,
        contentRef,
        present,
        state,
        style,
    } = useFloatingLayer<HTMLSpanElement, HTMLDivElement>({
        open,
        presenceDuration: 140,
        side,
        align: 'center',
        sideOffset: 8,
    });
    const layerIndex = useOverlayLayerIndex(present);

    return (
        <>
            <span
                ref={triggerRef}
                className='oui-tooltip-trigger'
                data-testid={testId}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
            >
                {children}
            </span>
            {present ? (
                <Portal>
                    <div
                        ref={contentRef}
                        role='tooltip'
                        className={cn('oui-tooltip-content', className)}
                        data-state={state}
                        data-layer='dropdown'
                        data-testid={testId ? `${testId}-content` : undefined}
                        style={{
                            ...style,
                            zIndex: overlay.zIndex.dropdown + layerIndex * 10,
                        }}
                    >
                        {content}
                    </div>
                </Portal>
            ) : null}
        </>
    );
}
