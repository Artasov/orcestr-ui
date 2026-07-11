'use client';

import {
    cloneElement,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
    type MouseEvent,
    type ReactElement,
    type Ref,
} from 'react';

import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';
import { ActionConfirmModal } from '../Action/ActionConfirmModal';
import { MenuContent, type MenuItem } from '../Menu/Menu';
import {
    overlayLayerZIndex,
    useOverlayContext,
    useOverlayLayerIndex,
} from '../Overlay/OverlayProvider';
import { Portal } from '../Portal/Portal';

type ContextMenuTriggerProps = {
    ref?: Ref<HTMLElement>;
    onContextMenu?: (event: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void;
};

export function ContextMenu({
    children,
    items,
    className,
    testId,
}: {
    children: ReactElement<ContextMenuTriggerProps>;
    items: ReadonlyArray<MenuItem>;
    className?: string;
    testId?: string;
}) {
    const overlay = useOverlayContext();
    const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
    const [confirmItem, setConfirmItem] = useState<MenuItem | null>(null);
    const layerRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
    const close = useCallback(() => setPoint(null), []);
    const layerIndex = useOverlayLayerIndex(point !== null);

    useEffect(() => {
        if (!point) return;
        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;
            if (target instanceof Node && layerRef.current?.contains(target)) return;
            close();
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close();
        };
        const handleViewportChange = () => close();
        document.addEventListener('pointerdown', handlePointerDown, true);
        document.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('scroll', handleViewportChange, true);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown, true);
            document.removeEventListener('keydown', handleKeyDown, true);
            window.removeEventListener('resize', handleViewportChange);
            window.removeEventListener('scroll', handleViewportChange, true);
        };
    }, [close, point]);

    useLayoutEffect(() => {
        if (!point || !layerRef.current) {
            setPosition(null);
            return;
        }
        const rect = layerRef.current.getBoundingClientRect();
        const padding = 8;
        setPosition({
            left: Math.max(padding, Math.min(point.x, window.innerWidth - rect.width - padding)),
            top: Math.max(padding, Math.min(point.y, window.innerHeight - rect.height - padding)),
        });
    }, [point]);

    const childProps = children.props;
    const trigger = cloneElement(children, {
        ref: composeRefs(childProps.ref, triggerRef),
        onContextMenu: (event: MouseEvent<HTMLElement>) => {
            childProps.onContextMenu?.(event);
            if (event.defaultPrevented) return;
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            setPoint({
                x: event.clientX || rect.left + 8,
                y: event.clientY || rect.top + 8,
            });
        },
        onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
            childProps.onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return;
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            setPoint({ x: rect.left + 8, y: rect.top + 8 });
        },
    });

    return (
        <>
            {trigger}
            {point ? (
                <Portal>
                    <div
                        ref={layerRef}
                        className={cn(
                            'oui-popover-content oui-menu oui-action-menu-content oui-context-menu-content',
                            className,
                        )}
                        data-state="opening"
                        data-layer="dropdown"
                        data-oui-layer-index={layerIndex}
                        data-testid={testId}
                        style={{
                            left: position?.left ?? point.x,
                            top: position?.top ?? point.y,
                            visibility: position ? 'visible' : 'hidden',
                            zIndex: overlayLayerZIndex(overlay.zIndex, 'dropdown', layerIndex),
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <MenuContent
                            items={items}
                            close={close}
                            requestConfirmation={setConfirmItem}
                            testId={testId ? `${testId}-list` : undefined}
                        />
                    </div>
                </Portal>
            ) : null}
            <ActionConfirmModal
                item={confirmItem}
                open={confirmItem !== null}
                onCancel={() => setConfirmItem(null)}
                onConfirm={() => {
                    confirmItem?.onSelect?.();
                    setConfirmItem(null);
                }}
            />
        </>
    );
}
