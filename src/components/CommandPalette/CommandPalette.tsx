'use client';

import {
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from 'react';
import {LuSearch} from 'react-icons/lu';

import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {
    actionItemSearchText,
    isActionItemDisabled,
    type OrcestrActionItem,
} from '../Action/ActionTypes';
import {ActionConfirmModal} from '../Action/ActionConfirmModal';
import {Collapse} from '../Collapse/Collapse';
import {Modal} from '../Modal/Modal';
import {Spinner} from '../Spinner/Spinner';
import {TextField} from '../TextField/TextField';

export type CommandPaletteItem = OrcestrActionItem & {
    group?: string;
    keywords?: string[];
};

type CommandPaletteGroup = {
    group: string;
    items: CommandPaletteItem[];
    recent?: boolean;
};

export function CommandPalette({
    open,
    onOpenChange,
    items,
    recentItems = [],
    onSelect,
    title,
    description,
    placeholder,
    emptyText,
    recentTitle,
    globalOpenEvents = [],
    testId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: ReadonlyArray<CommandPaletteItem>;
    recentItems?: ReadonlyArray<CommandPaletteItem>;
    onSelect: (value: string) => void;
    title?: ReactNode;
    description?: ReactNode;
    placeholder?: string;
    emptyText?: ReactNode;
    recentTitle?: string;
    globalOpenEvents?: ReadonlyArray<string>;
    testId?: string;
}) {
    const {copy} = useOrcestrUiLocale();
    const actualTitle = title ?? copy.command.title;
    const actualDescription = description ?? copy.command.description;
    const actualPlaceholder = placeholder ?? copy.command.placeholder;
    const actualEmptyText = emptyText ?? copy.command.empty;
    const actualRecentTitle = recentTitle ?? copy.command.recent;
    const listboxId = useId();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [confirmItem, setConfirmItem] = useState<CommandPaletteItem | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = useMemo(
        () =>
            items.filter((item) => {
                if (!normalizedQuery) return true;
                return [
                    actionItemSearchText(item),
                    item.group,
                    ...(item.keywords ?? []),
                ]
                    .filter(Boolean)
                    .some((value) => value!.toLowerCase().includes(normalizedQuery));
            }),
        [items, normalizedQuery],
    );
    const groups = useMemo<CommandPaletteGroup[]>(() => {
        const result: CommandPaletteGroup[] = [];
        const grouped = new Map<string, CommandPaletteItem[]>();
        if (!normalizedQuery && recentItems.length > 0) {
            result.push({
                group: actualRecentTitle,
                items: [...recentItems],
                recent: true,
            });
        }
        for (const item of filtered) {
            const group = item.group ?? copy.command.group;
            grouped.set(group, [...(grouped.get(group) ?? []), item]);
        }
        return [
            ...result,
            ...Array.from(grouped.entries()).map(([group, groupItems]) => ({
                group,
                items: groupItems,
            })),
        ];
    }, [actualRecentTitle, copy.command.group, filtered, normalizedQuery, recentItems]);
    const options = useMemo(
        () => groups.flatMap((group) => group.items),
        [groups],
    );
    const actualSelectedIndex = options.length === 0
        ? 0
        : Math.min(selectedIndex, options.length - 1);
    const selectedItem = options[actualSelectedIndex] ?? null;

    const close = useCallback(() => {
        onOpenChange(false);
        setQuery('');
        setSelectedIndex(0);
    }, [onOpenChange]);

    const selectItem = useCallback((item: CommandPaletteItem) => {
        if (isActionItemDisabled(item)) return;
        if (item.confirm) {
            close();
            setConfirmItem(item);
            return;
        }
        item.onSelect?.();
        onSelect(item.key);
        close();
    }, [close, onSelect]);

    const moveSelected = useCallback((delta: 1 | -1) => {
        setSelectedIndex((current) => {
            if (options.length === 0) return 0;
            return (current + delta + options.length) % options.length;
        });
    }, [options.length]);

    useEffect(() => {
        if (!open || options.length === 0) return;
        const node = optionsRef.current?.querySelector<HTMLElement>(
            `[data-oui-command-index="${actualSelectedIndex}"]`,
        );
        node?.scrollIntoView({block: 'nearest'});
    }, [actualSelectedIndex, open, options.length]);

    useEffect(() => {
        if (!globalOpenEvents.length) return;
        const openPalette = () => onOpenChange(true);
        for (const eventName of globalOpenEvents) {
            window.addEventListener(eventName, openPalette);
        }
        return () => {
            for (const eventName of globalOpenEvents) {
                window.removeEventListener(eventName, openPalette);
            }
        };
    }, [globalOpenEvents, onOpenChange]);

    useEffect(() => {
        const onKeyDown = (event: globalThis.KeyboardEvent) => {
            const isShortcut =
                (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
            if (!isShortcut) return;
            event.preventDefault();
            onOpenChange(!open);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onOpenChange, open]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            moveSelected(1);
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            moveSelected(-1);
            return;
        }
        if (event.key === 'Home') {
            event.preventDefault();
            setSelectedIndex(0);
            return;
        }
        if (event.key === 'End') {
            event.preventDefault();
            setSelectedIndex(Math.max(options.length - 1, 0));
            return;
        }
        if (event.key === 'Enter' && selectedItem) {
            event.preventDefault();
            selectItem(selectedItem);
            return;
        }
        if (event.key === 'Escape' && query.length > 0) {
            event.preventDefault();
            setQuery('');
        }
    };

    return (
        <>
            <Modal
                open={open}
                onOpenChange={(next) => {
                    if (next) onOpenChange(true);
                    else close();
                }}
                title={actualTitle}
                description={actualDescription}
                maxWidth={520}
                testId={testId}
            >
                <div className='oui-command-palette' data-testid={testId ? `${testId}-panel` : undefined} onKeyDown={handleKeyDown}>
                    <TextField
                        autoFocus
                        className='oui-command-palette-search'
                        leftSlot={<LuSearch size={16} />}
                        placeholder={actualPlaceholder}
                        value={query}
                        role='combobox'
                        aria-autocomplete='list'
                        aria-controls={listboxId}
                        aria-expanded={open}
                        aria-activedescendant={
                            selectedItem
                                ? commandOptionId(listboxId, actualSelectedIndex)
                                : undefined
                        }
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <div
                        ref={optionsRef}
                        id={listboxId}
                        className='oui-command-palette-results'
                        role='listbox'
                        aria-label={copy.common.commandPaletteResults}
                    >
                        <Collapse open className='oui-command-palette-collapse'>
                            {groups.length > 0 ? (
                                groups.map((groupData) => (
                                    <div
                                        key={groupData.group}
                                        className='oui-command-palette-group'
                                    >
                                        <div
                                            className='oui-command-palette-group-title'
                                            data-recent={groupData.recent ? 'true' : undefined}
                                        >
                                            {groupData.group}
                                        </div>
                                        <div className='oui-command-palette-items'>
                                            {groupData.items.map((item) => {
                                                const index = options.indexOf(item);
                                                const selected = index === actualSelectedIndex;
                                                return (
                                                    <button
                                                        key={`${groupData.group}-${item.key}`}
                                                        id={commandOptionId(listboxId, index)}
                                                        type='button'
                                                        role='option'
                                                        aria-selected={selected}
                                                        className='oui-command-palette-item'
                                                        data-selected={selected ? 'true' : undefined}
                                                        data-loading={item.loading ? 'true' : undefined}
                                                        data-tone={item.tone}
                                                        data-oui-command-index={index}
                                                        aria-busy={item.loading ? 'true' : undefined}
                                                        disabled={isActionItemDisabled(item)}
                                                        onMouseEnter={() => setSelectedIndex(index)}
                                                        onClick={() => selectItem(item)}
                                                    >
                                                        {item.icon || item.loading ? (
                                                            <span className='oui-command-palette-item-icon'>
                                                                {item.loading ? <Spinner size={1} /> : item.icon}
                                                            </span>
                                                        ) : null}
                                                        <span className='oui-command-palette-item-main'>
                                                            <span className='oui-command-palette-item-label'>
                                                                {item.label}
                                                            </span>
                                                            {item.description ? (
                                                                <span className='oui-command-palette-item-description'>
                                                                    {item.description}
                                                                </span>
                                                            ) : null}
                                                        </span>
                                                        {item.shortcut ? (
                                                            <span className='oui-command-palette-shortcut'>
                                                                {item.shortcut}
                                                            </span>
                                                        ) : null}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='oui-command-palette-empty'>
                                {actualEmptyText}
                                </div>
                            )}
                        </Collapse>
                    </div>
                </div>
            </Modal>
            <ActionConfirmModal
                item={confirmItem}
                open={confirmItem !== null}
                onCancel={() => setConfirmItem(null)}
                onConfirm={() => {
                    confirmItem?.onSelect?.();
                    if (confirmItem) onSelect(confirmItem.key);
                    setConfirmItem(null);
                }}
            />
        </>
    );
}

function commandOptionId(listboxId: string, index: number): string {
    return `${listboxId}-option-${index}`;
}
