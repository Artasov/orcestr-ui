'use client';

import {
    cloneElement,
    useCallback,
    useEffect,
    useRef,
    useState,
    type MouseEvent,
    type ReactElement,
} from 'react';

import {cn} from '../../utils/cn';
import {ActionConfirmModal} from '../Action/ActionConfirmModal';
import {isActionItemDisabled} from '../Action/ActionTypes';
import type {MenuItem} from '../Menu/Menu';
import {useOverlayContext, useOverlayLayerIndex} from '../Overlay/OverlayProvider';
import {Portal} from '../Portal/Portal';
import {Spinner} from '../Spinner/Spinner';

export function ContextMenu({
    children,
    items,
    className,
    testId,
}: {
    children: ReactElement<{onContextMenu?: (event: MouseEvent) => void}>;
    items: ReadonlyArray<MenuItem>;
    className?: string;
    testId?: string;
}) {
    const overlay = useOverlayContext();
    const [point, setPoint] = useState<{x: number; y: number} | null>(null);
    const [confirmItem, setConfirmItem] = useState<MenuItem | null>(null);
    const layerRef = useRef<HTMLDivElement | null>(null);
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
        document.addEventListener('pointerdown', handlePointerDown, true);
        document.addEventListener('keydown', handleKeyDown, true);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown, true);
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [close, point]);

    const childProps = children.props;
    const trigger = cloneElement(children, {
        onContextMenu: (event: MouseEvent) => {
            childProps.onContextMenu?.(event);
            if (event.defaultPrevented) return;
            event.preventDefault();
            setPoint({x: event.clientX, y: event.clientY});
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
                        data-state='opening'
                        data-layer='dropdown'
                        data-testid={testId}
                        style={{
                            left: point.x,
                            top: point.y,
                            zIndex: overlay.zIndex.dropdown + layerIndex * 10,
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <ContextMenuContent
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

function ContextMenuContent({
    items,
    close,
    requestConfirmation,
    testId,
}: {
    items: ReadonlyArray<MenuItem>;
    close: () => void;
    requestConfirmation: (item: MenuItem) => void;
    testId?: string;
}) {
    return (
        <div className='oui-menu-list' role='menu' data-testid={testId}>
            {items.map((item) => (
                <div key={item.key}>
                    {item.separatorBefore ? <div className='oui-menu-separator' /> : null}
                    <button
                        type='button'
                        role='menuitem'
                        className='oui-menu-item oui-combobox-option'
                        data-tone={item.tone}
                        data-selected='false'
                        data-loading={item.loading ? 'true' : undefined}
                        data-testid={testId ? `${testId}-${item.key}` : undefined}
                        aria-busy={item.loading ? 'true' : undefined}
                        disabled={isActionItemDisabled(item) || Boolean(item.children?.length)}
                        onClick={() => {
                            if (isActionItemDisabled(item) || item.children?.length) return;
                            if (item.confirm) {
                                close();
                                requestConfirmation(item);
                                return;
                            }
                            item.onSelect?.();
                            close();
                        }}
                    >
                        {item.icon || item.loading ? (
                            <span className='oui-menu-icon'>
                                {item.loading ? <Spinner size={1} /> : item.icon}
                            </span>
                        ) : null}
                        <span className='oui-menu-label'>{item.label}</span>
                    </button>
                </div>
            ))}
        </div>
    );
}
