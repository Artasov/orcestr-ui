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
import {LuCheck, LuChevronsUpDown, LuPlus, LuX} from 'react-icons/lu';

import {useListNavigation} from '../../hooks/useListNavigation';
import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import type {UiSize} from '../../theme/systemProps';
import {Button} from '../Button/Button';
import {IconButton} from '../IconButton/IconButton';
import {Popover} from '../Popover/Popover';
import {Spinner} from '../Spinner/Spinner';
import {TextField} from '../TextField/TextField';
import {Tooltip} from '../Tooltip/Tooltip';

export type PaginatedResult<T> = {
    items: T[];
    page: number;
    page_size?: number;
    total?: number;
    has_next: boolean;
};

export type PaginatedComboboxSearchAction = {
    label: string | ((search: string) => string);
    onClick: (search: string) => void;
    disabled?: boolean;
};

export type PaginatedComboboxProps<T> = {
    loadPage: (page: number, search: string) => Promise<PaginatedResult<T>>;
    getItemId: (item: T) => string | number;
    renderOption: (item: T) => ReactNode;
    renderSelectedLabel: (item: T) => ReactNode;
    value: T | null;
    onChange: (item: T | null) => void;
    placeholder?: string;
    emptyText?: ReactNode;
    loadingText?: ReactNode;
    errorText?: ReactNode;
    retryLabel?: ReactNode;
    searchPlaceholder?: string;
    clearLabel?: string;
    disabled?: boolean;
    clearable?: boolean;
    showChevron?: boolean;
    size?: UiSize;
    maxHeight?: number;
    closeOnSelect?: boolean;
    isItemSelected?: (item: T) => boolean;
    searchAction?: PaginatedComboboxSearchAction;
    optionAction?: {
        label: (item: T) => string;
        icon: ReactNode;
        onClick: (item: T, close?: () => void) => void;
        disabled?: (item: T) => boolean;
    };
    resetKey?: unknown;
    debounceMs?: number;
    testId?: string;
};

const DEFAULT_DEBOUNCE_MS = 200;

export function PaginatedCombobox<T>({
    loadPage,
    getItemId,
    renderOption,
    renderSelectedLabel,
    value,
    onChange,
    placeholder,
    emptyText,
    loadingText,
    errorText,
    retryLabel,
    searchPlaceholder,
    clearLabel,
    disabled = false,
    clearable = false,
    showChevron = true,
    size = 3,
    maxHeight = 280,
    closeOnSelect = true,
    isItemSelected,
    searchAction,
    optionAction,
    resetKey,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    testId,
}: PaginatedComboboxProps<T>) {
    const {copy} = useOrcestrUiLocale();
    const actualPlaceholder = placeholder ?? copy.common.selectValue;
    const actualEmptyText = emptyText ?? copy.common.noOptions;
    const actualLoadingText = loadingText ?? copy.common.loading;
    const actualErrorText = errorText ?? copy.table.unableToLoad;
    const actualRetryLabel = retryLabel ?? copy.common.retry;
    const actualSearchPlaceholder = searchPlaceholder ?? copy.common.search;
    const [open, setOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const actualSearchActionLabel = searchAction
        ? typeof searchAction.label === 'function'
            ? searchAction.label(searchInput)
            : searchAction.label
        : '';
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [pages, setPages] = useState<Array<PaginatedResult<T>>>([]);
    const [loadingInitial, setLoadingInitial] = useState(false);
    const [loadingNext, setLoadingNext] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const requestIdRef = useRef(0);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(
            () => setDebouncedSearch(searchInput.trim()),
            debounceMs,
        );
        return () => window.clearTimeout(timer);
    }, [debounceMs, searchInput]);

    const items = useMemo(() => {
        const seen = new Set<string>();
        const result: T[] = [];
        for (const page of pages) {
            for (const item of page.items) {
                const key = String(getItemId(item));
                if (seen.has(key)) continue;
                seen.add(key);
                result.push(item);
            }
        }
        return result;
    }, [getItemId, pages]);
    const lastPage = pages.at(-1);
    const hasNextPage = Boolean(lastPage?.has_next);
    const selectedId = value === null ? null : String(getItemId(value));
    const navigationItems = useMemo(
        () =>
            items.map((item) => ({
                value: String(getItemId(item)),
                searchText: String(getItemId(item)),
            })),
        [getItemId, items],
    );
    const navigation = useListNavigation(navigationItems, {value: selectedId});
    const highlightedId = navigation.highlightedValue;
    const highlightedItem = useMemo(
        () =>
            highlightedId === null
                ? null
                : items.find((item) => String(getItemId(item)) === highlightedId) ?? null,
        [getItemId, highlightedId, items],
    );

    useEffect(() => {
        if (!open || highlightedId === null) return;
        const node = scrollRef.current?.querySelector<HTMLElement>(
            `[data-oui-paginated-combobox-value="${cssAttr(highlightedId)}"]`,
        );
        node?.scrollIntoView({block: 'nearest'});
    }, [highlightedId, open]);

    const fetchPage = useCallback(
        async (page: number, search: string) => {
            const requestId = ++requestIdRef.current;
            if (page === 1) {
                setLoadingInitial(true);
                setPages([]);
            } else {
                setLoadingNext(true);
            }
            setError(null);
            try {
                const result = await loadPage(page, search);
                if (requestId !== requestIdRef.current) return;
                setPages((current) => (page === 1 ? [result] : [...current, result]));
            } catch (nextError) {
                if (requestId !== requestIdRef.current) return;
                setError(nextError);
                if (page === 1) setPages([]);
            } finally {
                if (requestId !== requestIdRef.current) return;
                setLoadingInitial(false);
                setLoadingNext(false);
            }
        },
        [loadPage],
    );

    useEffect(() => {
        if (!open) return;
        void fetchPage(1, debouncedSearch);
    }, [debouncedSearch, fetchPage, open, resetKey]);

    useEffect(() => {
        if (!open || !hasNextPage || loadingNext || loadingInitial) return;
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0]?.isIntersecting) return;
                const nextPage = (lastPage?.page ?? pages.length) + 1;
                void fetchPage(nextPage, debouncedSearch);
            },
            {threshold: 0.1},
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [
        debouncedSearch,
        fetchPage,
        hasNextPage,
        lastPage?.page,
        loadingInitial,
        loadingNext,
        open,
        pages.length,
    ]);

    const clear = useCallback(() => {
        onChange(null);
        setSearchInput('');
        setDebouncedSearch('');
    }, [onChange]);

    const close = useCallback(() => {
        setOpen(false);
        navigation.reset();
    }, [navigation]);

    const handleSelect = useCallback(
        (item: T) => {
            onChange(item);
            if (closeOnSelect) {
                setOpen(false);
                setSearchInput('');
                navigation.reset();
            }
        },
        [closeOnSelect, navigation, onChange],
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
                event.preventDefault();
                setOpen(true);
                return;
            }
            if (!open) return;

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
                    if (highlightedItem !== null) {
                        event.preventDefault();
                        handleSelect(highlightedItem);
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    close();
                    break;
            }
        },
        [close, handleSelect, highlightedItem, navigation, open],
    );

    const triggerLabel = value ? renderSelectedLabel(value) : null;
    const canClear = clearable && value !== null && !disabled;
    const isInitialLoading = loadingInitial && items.length === 0;

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) {
                    navigation.reset();
                }
            }}
            trigger={
                <Button
                    type='button'
                    v='surface'
                    size={size}
                    disabled={disabled}
                    fullWidth
                    pressAnimation='none'
                    className='oui-combobox-trigger'
                    data-testid={testId}
                    data-state={open ? 'open' : 'closed'}
                    onKeyDown={handleKeyDown}
                    rightIcon={
                        <span className='oui-combobox-trigger-actions'>
                            {canClear ? (
                                <span
                                    aria-label={clearLabel ?? copy.common.clear}
                                    className='oui-combobox-clear'
                                    onPointerDown={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        clear();
                                    }}
                                >
                                    <LuX size={14} />
                                </span>
                            ) : null}
                            {showChevron ? <LuChevronsUpDown size={15} /> : null}
                        </span>
                    }
                >
                    <span className={triggerLabel ? 'oui-combobox-trigger-label' : 'oui-combobox-placeholder'}>
                        {triggerLabel ?? actualPlaceholder}
                    </span>
                </Button>
            }
            className='oui-combobox-content'
            align='start'
            sideOffset={4}
            matchTriggerWidth
            disabled={disabled}
        >
            <div className='oui-combobox-search-wrap'>
                <TextField
                    autoFocus
                    size={2}
                    placeholder={actualSearchPlaceholder}
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {searchAction ? (
                    <Tooltip content={actualSearchActionLabel}>
                        <IconButton
                            size={2}
                            v='soft'
                            icon={<LuPlus size={14} />}
                            className='oui-combobox-search-action'
                            aria-label={actualSearchActionLabel}
                            disabled={searchAction.disabled}
                            onClick={() => {
                                setOpen(false);
                                searchAction.onClick(searchInput);
                            }}
                        />
                    </Tooltip>
                ) : null}
            </div>
            <div
                ref={scrollRef}
                className='oui-combobox-scroll'
                style={{maxHeight}}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
            >
                {isInitialLoading ? (
                    <div className='oui-combobox-state'>
                        <Spinner />
                        <span className='oui-visually-hidden'>{actualLoadingText}</span>
                    </div>
                ) : error ? (
                    <div className='oui-combobox-state'>
                        <span>{actualErrorText}</span>
                        <Button
                            size={1}
                            v='surface'
                            onClick={() => void fetchPage(1, debouncedSearch)}
                        >
                            {actualRetryLabel}
                        </Button>
                    </div>
                ) : items.length === 0 ? (
                    <div className='oui-combobox-empty'>{actualEmptyText}</div>
                ) : (
                    <div className='oui-combobox-options'>
                        {items.map((item) => {
                            const id = getItemId(item);
                            const itemId = String(id);
                            const selected =
                                isItemSelected?.(item) ??
                                (value !== null &&
                                    String(getItemId(value)) === itemId);
                            const highlighted = highlightedId === itemId;
                            return (
                                <div
                                    key={itemId}
                                    className='oui-combobox-option'
                                    data-selected={selected ? 'true' : 'false'}
                                    data-highlighted={highlighted ? 'true' : 'false'}
                                    data-oui-paginated-combobox-value={itemId}
                                    onMouseEnter={() => navigation.setHighlightedValue(itemId)}
                                >
                                    <button
                                        type='button'
                                        className='oui-combobox-option-main'
                                        onClick={() => handleSelect(item)}
                                    >
                                        {renderOption(item)}
                                    </button>
                                    {selected ? (
                                        <LuCheck className='oui-combobox-check' size={15} />
                                    ) : null}
                                    {optionAction ? (
                                        <Tooltip content={optionAction.label(item)}>
                                            <button
                                                type='button'
                                                className='oui-combobox-option-action'
                                                aria-label={optionAction.label(item)}
                                                disabled={optionAction.disabled?.(item)}
                                                onPointerDown={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                }}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    optionAction.onClick(item, close);
                                                }}
                                            >
                                                {optionAction.icon}
                                            </button>
                                        </Tooltip>
                                    ) : null}
                                </div>
                            );
                        })}
                        {hasNextPage ? (
                            <div ref={sentinelRef} className='oui-combobox-sentinel' />
                        ) : null}
                        {loadingNext ? (
                            <div className='oui-combobox-next-loader'>
                                <Spinner size={1} />
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </Popover>
    );
}

function cssAttr(value: string): string {
    return value.replace(/"/g, '\\"');
}
