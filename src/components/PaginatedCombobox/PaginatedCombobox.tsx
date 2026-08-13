'use client';

import {
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from 'react';
import { LuCheck, LuChevronsUpDown, LuPlus, LuX } from 'react-icons/lu';

import { useListNavigation } from '../../hooks/useListNavigation.js';
import { useOrcestrUiLocale } from '../../locale/LocaleProvider.js';
import type { UiSize } from '../../theme/systemProps.js';
import { Button } from '../Button/Button.js';
import { FloatingFieldDecoration } from '../Field/FloatingFieldDecoration.js';
import { IconButton } from '../IconButton/IconButton.js';
import { Popover } from '../Popover/Popover.js';
import { Spinner } from '../Spinner/Spinner.js';
import { TextField } from '../TextField/TextField.js';
import { Tooltip } from '../Tooltip/Tooltip.js';

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

export type PaginatedComboboxOptionAction<T> = {
    label: (item: T) => string;
    icon: ReactNode;
    onClick: (item: T, close?: () => void) => void;
    disabled?: (item: T) => boolean;
};

export type PaginatedComboboxProps<T> = {
    loadPage: (
        page: number,
        search: string,
        options: { signal: AbortSignal; pageSize?: number },
    ) => Promise<PaginatedResult<T>>;
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
    autoFocusSearch?: boolean;
    clearLabel?: string;
    ariaLabel?: string;
    disabled?: boolean;
    clearable?: boolean;
    showChevron?: boolean;
    trigger?: ReactNode;
    size?: UiSize;
    maxHeight?: number;
    closeOnSelect?: boolean;
    isItemSelected?: (item: T) => boolean;
    searchAction?: PaginatedComboboxSearchAction;
    optionAction?: PaginatedComboboxOptionAction<T>;
    resetKey?: unknown;
    debounceMs?: number;
    pageSize?: number;
    virtualizeThreshold?: number;
    estimatedItemHeight?: number;
    virtualOverscan?: number;
    testId?: string;
    floatingLabel?: ReactNode;
    floatingColor?: string;
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
    autoFocusSearch = false,
    clearLabel,
    ariaLabel,
    disabled = false,
    clearable = false,
    showChevron = true,
    trigger,
    size = 3,
    maxHeight = 280,
    closeOnSelect = true,
    isItemSelected,
    searchAction,
    optionAction,
    resetKey,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    pageSize,
    virtualizeThreshold = 80,
    estimatedItemHeight = 40,
    virtualOverscan = 6,
    testId,
    floatingLabel,
    floatingColor,
}: PaginatedComboboxProps<T>) {
    const { copy } = useOrcestrUiLocale();
    const actualPlaceholder = placeholder ?? copy.common.selectValue;
    const actualEmptyText = emptyText ?? copy.common.noOptions;
    const actualLoadingText = loadingText ?? copy.common.loading;
    const actualErrorText = errorText ?? copy.table.unableToLoad;
    const actualRetryLabel = retryLabel ?? copy.common.retry;
    const actualSearchPlaceholder = searchPlaceholder ?? copy.common.search;
    const [open, setOpen] = useState(false);
    const listboxId = useId();
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
    const requestControllerRef = useRef<AbortController | null>(null);
    const loadPageRef = useRef(loadPage);
    loadPageRef.current = loadPage;
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const rowHeightsRef = useRef(new Map<string, number>());
    const [measurementVersion, setMeasurementVersion] = useState(0);
    const [viewport, setViewport] = useState({ top: 0, height: maxHeight });
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const shouldAutoFocusSearchRef = useRef(false);
    const previousHighlightedIdRef = useRef<string | null>(null);
    shouldAutoFocusSearchRef.current = open && autoFocusSearch;
    const setSearchInputRef = useCallback(
        (node: HTMLInputElement | null) => {
            searchInputRef.current = node;
            if (!node || !open || !autoFocusSearch) return;
            window.requestAnimationFrame(() => {
                if (searchInputRef.current === node && shouldAutoFocusSearchRef.current) {
                    node.focus({ preventScroll: true });
                }
            });
        },
        [autoFocusSearch, open],
    );

    useEffect(() => {
        const timer = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), debounceMs);
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
    const navigation = useListNavigation(navigationItems, { value: selectedId });
    const highlightedId = navigation.highlightedValue;
    const highlightedItem = useMemo(
        () =>
            highlightedId === null
                ? null
                : (items.find((item) => String(getItemId(item)) === highlightedId) ?? null),
        [getItemId, highlightedId, items],
    );
    const virtualModel = useMemo(() => {
        const offsets = [0];
        for (const item of items) {
            const id = String(getItemId(item));
            offsets.push(offsets.at(-1)! + (rowHeightsRef.current.get(id) ?? estimatedItemHeight));
        }
        const enabled = items.length >= virtualizeThreshold;
        if (!enabled) {
            return {
                enabled,
                start: 0,
                end: items.length,
                before: 0,
                after: 0,
                offsets,
                items,
            };
        }

        let firstVisible = 0;
        while (firstVisible < items.length && offsets[firstVisible + 1]! < viewport.top) {
            firstVisible += 1;
        }
        let lastVisible = firstVisible;
        while (
            lastVisible < items.length &&
            offsets[lastVisible]! < viewport.top + viewport.height
        ) {
            lastVisible += 1;
        }
        const start = Math.max(0, firstVisible - virtualOverscan);
        const end = Math.min(items.length, lastVisible + virtualOverscan);
        const totalHeight = offsets.at(-1) ?? 0;
        return {
            enabled,
            start,
            end,
            before: offsets[start] ?? 0,
            after: Math.max(0, totalHeight - (offsets[end] ?? totalHeight)),
            offsets,
            items: items.slice(start, end),
        };
    }, [
        estimatedItemHeight,
        getItemId,
        items,
        measurementVersion,
        viewport.height,
        viewport.top,
        virtualizeThreshold,
        virtualOverscan,
    ]);

    useEffect(() => {
        if (!open) {
            previousHighlightedIdRef.current = null;
            return;
        }
        if (highlightedId === null || previousHighlightedIdRef.current === highlightedId) {
            return;
        }
        previousHighlightedIdRef.current = highlightedId;
        const node = scrollRef.current?.querySelector<HTMLElement>(
            `[data-oui-paginated-combobox-value="${cssAttr(highlightedId)}"]`,
        );
        if (node) {
            node.scrollIntoView({ block: 'nearest' });
            return;
        }
        const index = items.findIndex((item) => String(getItemId(item)) === highlightedId);
        const scrollNode = scrollRef.current;
        if (index !== -1 && scrollNode) {
            scrollNode.scrollTop = virtualModel.offsets[index] ?? 0;
        }
    }, [getItemId, highlightedId, items, open, virtualModel.offsets]);

    useLayoutEffect(() => {
        if (!open || !scrollRef.current) return;
        const scrollNode = scrollRef.current;
        const ResizeObserverCtor = scrollNode.ownerDocument.defaultView?.ResizeObserver;
        const updateViewport = () => {
            setViewport({
                top: scrollNode.scrollTop,
                height: scrollNode.clientHeight || maxHeight,
            });
        };
        updateViewport();
        if (!ResizeObserverCtor) return;
        const observer = new ResizeObserverCtor((entries) => {
            let measurementsChanged = false;
            for (const entry of entries) {
                if (entry.target === scrollNode) {
                    updateViewport();
                    continue;
                }
                if (!(entry.target instanceof HTMLElement)) continue;
                const id = entry.target.dataset.ouiPaginatedComboboxValue;
                if (!id) continue;
                const height = entry.borderBoxSize[0]?.blockSize ?? entry.target.offsetHeight;
                if (height <= 0 || rowHeightsRef.current.get(id) === height) continue;
                rowHeightsRef.current.set(id, height);
                measurementsChanged = true;
            }
            if (measurementsChanged) setMeasurementVersion((current) => current + 1);
        });
        observer.observe(scrollNode);
        for (const row of scrollNode.querySelectorAll<HTMLElement>(
            '[data-oui-paginated-combobox-value]',
        )) {
            observer.observe(row);
        }
        return () => observer.disconnect();
    }, [maxHeight, open, virtualModel.end, virtualModel.start]);

    const fetchPage = useCallback(
        async (page: number, search: string) => {
            requestControllerRef.current?.abort();
            const controller = new AbortController();
            requestControllerRef.current = controller;
            const requestId = ++requestIdRef.current;
            if (page === 1) {
                setLoadingInitial(true);
                setPages([]);
            } else {
                setLoadingNext(true);
            }
            setError(null);
            try {
                const result = await loadPageRef.current(page, search, {
                    signal: controller.signal,
                    pageSize,
                });
                if (requestId !== requestIdRef.current) return;
                setPages((current) => (page === 1 ? [result] : [...current, result]));
            } catch (nextError) {
                if (requestId !== requestIdRef.current) return;
                if (controller.signal.aborted) return;
                setError(nextError);
                if (page === 1) setPages([]);
            } finally {
                if (requestId !== requestIdRef.current) return;
                if (requestControllerRef.current === controller) {
                    requestControllerRef.current = null;
                }
                setLoadingInitial(false);
                setLoadingNext(false);
            }
        },
        [pageSize],
    );

    useEffect(
        () => () => {
            requestControllerRef.current?.abort();
            requestControllerRef.current = null;
            requestIdRef.current += 1;
        },
        [],
    );

    useEffect(() => {
        if (open) return;
        requestControllerRef.current?.abort();
        requestControllerRef.current = null;
        requestIdRef.current += 1;
        setLoadingInitial(false);
        setLoadingNext(false);
    }, [open]);

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
            { root: scrollRef.current, threshold: 0.1 },
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
    const handleOpenChange = useCallback(
        (next: boolean) => {
            setOpen(next);
            if (!next) navigation.reset();
        },
        [navigation.reset],
    );

    return (
        <Popover
            open={open}
            onOpenChange={handleOpenChange}
            trigger={
                trigger ?? (
                    <Button
                        asChild
                        v="surface"
                        size={size}
                        disabled={disabled}
                        fullWidth
                        pressAnimation="none"
                        className={
                            floatingLabel !== undefined
                                ? 'oui-combobox-trigger oui-floating-field'
                                : 'oui-combobox-trigger'
                        }
                        data-testid={testId}
                        data-state={open ? 'open' : 'closed'}
                        data-floating={
                            floatingLabel !== undefined && (open || value !== null)
                                ? 'true'
                                : undefined
                        }
                        data-focused={floatingLabel !== undefined && open ? 'true' : undefined}
                    >
                        <div
                            role="combobox"
                            tabIndex={disabled ? -1 : 0}
                            aria-haspopup="listbox"
                            aria-label={
                                ariaLabel ?? reactNodeText(triggerLabel ?? actualPlaceholder)
                            }
                            aria-expanded={open}
                            aria-controls={listboxId}
                            aria-activedescendant={
                                highlightedId === null
                                    ? undefined
                                    : `${listboxId}-option-${domId(highlightedId)}`
                            }
                            onKeyDown={handleKeyDown}
                        >
                            {floatingLabel !== undefined ? (
                                <FloatingFieldDecoration
                                    label={floatingLabel}
                                    color={floatingColor}
                                />
                            ) : null}
                            <span className="oui-button-label">
                                <span
                                    className={
                                        triggerLabel
                                            ? 'oui-combobox-trigger-label'
                                            : 'oui-combobox-placeholder'
                                    }
                                >
                                    {triggerLabel ?? actualPlaceholder}
                                </span>
                            </span>
                            <span className="oui-combobox-trigger-actions">
                                {canClear ? (
                                    <button
                                        type="button"
                                        aria-label={clearLabel ?? copy.common.clear}
                                        className="oui-combobox-clear"
                                        onKeyDown={(event) => event.stopPropagation()}
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
                                    </button>
                                ) : null}
                                {showChevron ? <LuChevronsUpDown size={15} /> : null}
                            </span>
                        </div>
                    </Button>
                )
            }
            className="oui-combobox-content"
            align="start"
            sideOffset={4}
            matchTriggerWidth
            disabled={disabled}
        >
            <div className="oui-combobox-search-wrap oui-paginated-combobox-search-wrap">
                <TextField
                    ref={setSearchInputRef}
                    size={1}
                    placeholder={actualSearchPlaceholder}
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={open}
                    aria-controls={listboxId}
                    aria-activedescendant={
                        highlightedId === null
                            ? undefined
                            : `${listboxId}-option-${domId(highlightedId)}`
                    }
                />
                {searchAction ? (
                    <Tooltip content={actualSearchActionLabel}>
                        <IconButton
                            size={1}
                            v="soft"
                            icon={<LuPlus size={12} />}
                            className="oui-combobox-search-action"
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
                id={listboxId}
                role="listbox"
                className="oui-combobox-scroll"
                style={{ maxHeight }}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                onScroll={(event) =>
                    setViewport({
                        top: event.currentTarget.scrollTop,
                        height: event.currentTarget.clientHeight || maxHeight,
                    })
                }
            >
                {isInitialLoading ? (
                    <div className="oui-combobox-state">
                        <Spinner />
                        <span className="oui-visually-hidden">{actualLoadingText}</span>
                    </div>
                ) : error ? (
                    <div className="oui-combobox-state">
                        <span>{actualErrorText}</span>
                        <Button
                            size={1}
                            v="surface"
                            onClick={() => void fetchPage(1, debouncedSearch)}
                        >
                            {actualRetryLabel}
                        </Button>
                    </div>
                ) : items.length === 0 ? (
                    <div className="oui-combobox-empty">{actualEmptyText}</div>
                ) : (
                    <div className="oui-combobox-options">
                        {virtualModel.before > 0 ? (
                            <div aria-hidden="true" style={{ height: virtualModel.before }} />
                        ) : null}
                        {virtualModel.items.map((item, renderedIndex) => {
                            const id = getItemId(item);
                            const itemId = String(id);
                            const itemIndex = virtualModel.start + renderedIndex;
                            const selected =
                                isItemSelected?.(item) ??
                                (value !== null && String(getItemId(value)) === itemId);
                            const highlighted = highlightedId === itemId;
                            return (
                                <div
                                    key={itemId}
                                    className="oui-combobox-option"
                                    data-selected={selected ? 'true' : 'false'}
                                    data-highlighted={highlighted ? 'true' : 'false'}
                                    data-oui-paginated-combobox-value={itemId}
                                    onMouseEnter={() => navigation.setHighlightedValue(itemId)}
                                >
                                    <button
                                        type="button"
                                        id={`${listboxId}-option-${domId(itemId)}`}
                                        role="option"
                                        aria-selected={selected}
                                        aria-posinset={itemIndex + 1}
                                        aria-setsize={items.length}
                                        className="oui-combobox-option-main"
                                        onClick={() => handleSelect(item)}
                                    >
                                        {renderOption(item)}
                                    </button>
                                    {selected ? (
                                        <LuCheck className="oui-combobox-check" size={15} />
                                    ) : null}
                                    {optionAction ? (
                                        <Tooltip content={optionAction.label(item)}>
                                            <button
                                                type="button"
                                                className="oui-combobox-option-action"
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
                        {virtualModel.after > 0 ? (
                            <div aria-hidden="true" style={{ height: virtualModel.after }} />
                        ) : null}
                        {hasNextPage ? (
                            <div ref={sentinelRef} className="oui-combobox-sentinel" />
                        ) : null}
                        {loadingNext ? (
                            <div className="oui-combobox-next-loader">
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

function domId(value: string) {
    return encodeURIComponent(value).replace(/%/g, '_');
}

function reactNodeText(value: ReactNode): string {
    if (value === null || value === undefined || value === false) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (Array.isArray(value)) return value.map(reactNodeText).join('');
    if (typeof value === 'object' && 'props' in value) {
        return reactNodeText((value.props as { children?: ReactNode }).children);
    }
    return '';
}
