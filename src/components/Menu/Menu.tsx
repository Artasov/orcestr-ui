'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from 'react';
import {LuChevronRight, LuInfo} from 'react-icons/lu';

import {useListNavigation} from '../../hooks/useListNavigation';
import {usePresence} from '../../hooks/usePresence';
import {useTypeahead} from '../../hooks/useTypeahead';
import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {cn} from '../../utils/cn';
import {
    actionItemText,
    isActionItemDisabled,
    type OrcestrActionItem,
} from '../Action/ActionTypes';
import {ActionConfirmModal} from '../Action/ActionConfirmModal';
import {Popover, type PopoverProps} from '../Popover/Popover';
import {Spinner} from '../Spinner/Spinner';
import {Tooltip} from '../Tooltip/Tooltip';

export type MenuItem = OrcestrActionItem;

export function Menu({
    trigger,
    items,
    className,
    align = 'end',
    side = 'bottom',
    sideOffset = 6,
    testId,
}: {
    trigger: ReactNode;
    items: ReadonlyArray<MenuItem>;
    className?: string;
    align?: PopoverProps['align'];
    side?: PopoverProps['side'];
    sideOffset?: number;
    testId?: string;
}) {
    const [open, setOpen] = useState(false);
    const [confirmItem, setConfirmItem] = useState<MenuItem | null>(null);
    const inlineState = useInlineSubmenus();
    const reserveIconSpace = useMemo(() => menuHasIcons(items), [items]);

    if (items.length === 0) return trigger;

    return (
        <>
            <Popover
                open={open}
                onOpenChange={(next) => {
                    setOpen(next);
                    if (!next) inlineState.reset();
                }}
                trigger={trigger}
                className={cn('oui-menu oui-action-menu-content', className)}
                align={align}
                side={side}
                sideOffset={sideOffset}
                collisionPadding={12}
                testId={testId}
            >
                <MenuList
                    items={items}
                    reserveIconSpace={reserveIconSpace}
                    inlineState={inlineState}
                    close={() => setOpen(false)}
                    requestConfirmation={setConfirmItem}
                    autoFocus
                    testId={testId ? `${testId}-list` : undefined}
                />
            </Popover>
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

function MenuList({
    items,
    reserveIconSpace,
    inlineState,
    close,
    requestConfirmation,
    autoFocus = false,
    testId,
}: {
    items: ReadonlyArray<MenuItem>;
    reserveIconSpace: boolean;
    inlineState: InlineSubmenuState;
    close: () => void;
    requestConfirmation: (item: MenuItem) => void;
    autoFocus?: boolean;
    testId?: string;
}) {
    const listRef = useRef<HTMLDivElement | null>(null);
    const navigationItems = useMemo(
        () =>
            items.map((item) => ({
                value: item.key,
                disabled: isActionItemDisabled(item),
                searchText: menuItemText(item),
            })),
        [items],
    );
    const navigation = useListNavigation(navigationItems);
    const highlightedKey = navigation.highlightedValue;

    useEffect(() => {
        if (autoFocus) listRef.current?.focus();
    }, [autoFocus]);

    const selectHighlighted = useCallback(() => {
        if (highlightedKey === null) return;
        const item = items.find((candidate) => candidate.key === highlightedKey);
        if (!item || isActionItemDisabled(item)) return;
        if (item.children?.length) {
            inlineState.toggle(item.key);
            return;
        }
        if (item.confirm) {
            close();
            requestConfirmation(item);
            return;
        }
        item.onSelect?.();
        close();
    }, [close, highlightedKey, inlineState, items, requestConfirmation]);

    const handleTypeahead = useTypeahead((query) => {
        const match = navigation.enabledItems.find((item) =>
            item.searchText?.toLowerCase().startsWith(query),
        );
        if (match) navigation.setHighlightedValue(match.value);
    });

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    navigation.move(1);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    navigation.move(-1);
                    break;
                case 'Home':
                    event.preventDefault();
                    navigation.first();
                    break;
                case 'End':
                    event.preventDefault();
                    navigation.last();
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    selectHighlighted();
                    break;
                case 'Escape':
                    event.preventDefault();
                    close();
                    break;
                default:
                    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
                        handleTypeahead(event.key);
                    }
            }
        },
        [close, handleTypeahead, navigation, selectHighlighted],
    );

    return (
        <div
            ref={listRef}
            className='oui-menu-list'
            role='menu'
            tabIndex={0}
            data-testid={testId}
            onKeyDown={handleKeyDown}
        >
            {items.map((item) => (
                <MenuRow
                    key={item.key}
                    item={item}
                    reserveIconSpace={reserveIconSpace}
                    inlineState={inlineState}
                    close={close}
                    requestConfirmation={requestConfirmation}
                    highlighted={highlightedKey === item.key}
                    setHighlighted={() => navigation.setHighlightedValue(item.key)}
                    testId={testId ? `${testId}-${item.key}` : undefined}
                />
            ))}
        </div>
    );
}

function MenuRow({
    item,
    reserveIconSpace,
    inlineState,
    close,
    requestConfirmation,
    highlighted,
    setHighlighted,
    testId,
}: {
    item: MenuItem;
    reserveIconSpace: boolean;
    inlineState: InlineSubmenuState;
    close: () => void;
    requestConfirmation: (item: MenuItem) => void;
    highlighted: boolean;
    setHighlighted: () => void;
    testId?: string;
}) {
    const [hoverOpen, setHoverOpen] = useState(false);
    const hasChildren = Boolean(item.children?.length);
    const inlineOpen = inlineState.openSubmenus.has(item.key);
    const submenuPresence = usePresence(hoverOpen, 180);

    return (
        <div
            className='oui-menu-row'
            onMouseEnter={() => {
                setHighlighted();
                setHoverOpen(true);
            }}
            onMouseLeave={() => setHoverOpen(false)}
        >
            {item.separatorBefore ? <div className='oui-menu-separator' /> : null}
            <button
                type='button'
                className='oui-menu-item oui-combobox-option'
                data-tone={item.tone}
                data-selected='false'
                data-highlighted={highlighted ? 'true' : undefined}
                data-submenu-state={inlineOpen || hoverOpen ? 'open' : 'closed'}
                data-loading={item.loading ? 'true' : undefined}
                data-testid={testId}
                aria-busy={item.loading ? 'true' : undefined}
                disabled={isActionItemDisabled(item)}
                tabIndex={-1}
                onClick={(event) => {
                    event.stopPropagation();
                    if (isActionItemDisabled(item)) return;
                    if (hasChildren) {
                        inlineState.toggle(item.key);
                        return;
                    }
                    if (item.confirm) {
                        close();
                        requestConfirmation(item);
                        return;
                    }
                    item.onSelect?.();
                    close();
                }}
                role='menuitem'
            >
                <MenuItemContent item={item} reserveIconSpace={reserveIconSpace} />
                {hasChildren ? (
                    <LuChevronRight
                        className='oui-menu-sub-chevron'
                        size={15}
                        aria-hidden
                    />
                ) : null}
            </button>
            {hasChildren && item.children ? (
                inlineState.inlineSubmenus ? (
                    <div
                        className='oui-menu-inline-subitems'
                        data-state={inlineOpen ? 'open' : 'closed'}
                    >
                        {inlineOpen ? (
                            <MenuList
                                items={item.children}
                                reserveIconSpace={menuHasIcons(item.children)}
                                inlineState={inlineState}
                                close={close}
                                requestConfirmation={requestConfirmation}
                                autoFocus={false}
                                testId={testId ? `${testId}-subitems` : undefined}
                            />
                        ) : null}
                    </div>
                ) : submenuPresence.present ? (
                    <div
                        className='oui-menu-subcontent oui-popover-content'
                        data-state={submenuPresence.state}
                        data-testid={testId ? `${testId}-subcontent` : undefined}
                    >
                        <MenuList
                            items={item.children}
                            reserveIconSpace={menuHasIcons(item.children)}
                            inlineState={inlineState}
                            close={close}
                            requestConfirmation={requestConfirmation}
                            autoFocus={false}
                            testId={testId ? `${testId}-subitems` : undefined}
                        />
                    </div>
                ) : null
            ) : null}
        </div>
    );
}

function MenuItemContent({
    item,
    reserveIconSpace,
}: {
    item: MenuItem;
    reserveIconSpace: boolean;
}) {
    const {copy} = useOrcestrUiLocale();
    return (
        <>
            <span className='oui-menu-item-main'>
                {item.icon || item.loading || reserveIconSpace ? (
                    <span className='oui-menu-icon' aria-hidden={!item.icon && !item.loading}>
                        {item.loading ? <Spinner size={1} /> : item.icon}
                    </span>
                ) : null}
                <span className='oui-menu-label'>{item.label}</span>
                {item.description ? (
                    <span className='oui-menu-description'>{item.description}</span>
                ) : null}
            </span>
            {item.shortcut ? (
                <span className='oui-menu-shortcut'>{item.shortcut}</span>
            ) : null}
            {item.info ? (
                <Tooltip content={item.info}>
                    <span
                        className='oui-menu-info'
                        aria-label={copy.common.details}
                        onPointerDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }}
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }}
                    >
                        <LuInfo size={14} />
                    </span>
                </Tooltip>
            ) : null}
        </>
    );
}

type InlineSubmenuState = {
    inlineSubmenus: boolean;
    openSubmenus: ReadonlySet<string>;
    toggle: (key: string) => void;
    reset: () => void;
};

function useInlineSubmenus(): InlineSubmenuState {
    const [inlineSubmenus, setInlineSubmenus] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState<ReadonlySet<string>>(
        () => new Set(),
    );

    useEffect(() => {
        const media = window.matchMedia('(max-width: 640px), (pointer: coarse)');
        const update = () => setInlineSubmenus(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    return {
        inlineSubmenus,
        openSubmenus,
        toggle: (key) => {
            setOpenSubmenus((current) => {
                const next = new Set(current);
                if (next.has(key)) next.delete(key);
                else next.add(key);
                return next;
            });
        },
        reset: () => setOpenSubmenus(new Set()),
    };
}

function menuHasIcons(items: ReadonlyArray<MenuItem>): boolean {
    return items.some(
        (item) => item.icon || (item.children && menuHasIcons(item.children)),
    );
}

function menuItemText(item: MenuItem): string {
    return actionItemText(item.label);
}
