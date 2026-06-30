'use client';

import {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type MouseEvent,
    type PointerEvent as ReactPointerEvent,
    type ReactNode,
    type UIEvent,
    type WheelEvent,
} from 'react';
import {
    LuArrowDown,
    LuArrowUp,
    LuChevronDown,
    LuChevronRight,
    LuRefreshCw,
    LuRotateCcw,
    LuSettings2,
} from 'react-icons/lu';

import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {Button} from '../Button/Button';
import {Checkbox} from '../Checkbox/Checkbox';
import {ContextMenu} from '../ContextMenu/ContextMenu';
import {IconButton} from '../IconButton/IconButton';
import type {MenuItem} from '../Menu/Menu';
import {Popover} from '../Popover/Popover';
import {Spinner} from '../Spinner/Spinner';
import {Text} from '../Text/Text';
import type {OrcestrActionItem} from '../Action/ActionTypes';

export type DataTableSortDirection = 'asc' | 'desc';

export type DataTableSort = {
    key: string;
    direction: DataTableSortDirection;
};

export type DataTableColumn<T> = {
    key: string;
    title: ReactNode;
    render: (row: T) => ReactNode;
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    resizable?: boolean;
    hideable?: boolean;
    defaultVisible?: boolean;
    pinned?: 'left' | 'right';
};

export type DataTableColumnSettings<T> = {
    columns?: ReadonlyArray<DataTableColumn<T>>;
    visibleColumnKeys: ReadonlyArray<string>;
    onVisibleColumnKeysChange: (keys: string[]) => void;
    columnWidths?: Record<string, number>;
    onColumnWidthsChange?: (widths: Record<string, number>) => void;
    columnOrder?: ReadonlyArray<string>;
    onColumnOrderChange?: (keys: string[]) => void;
    onReset?: () => void;
    label?: ReactNode;
    resetLabel?: ReactNode;
    emptyLabel?: ReactNode;
};

export type DataTableRowAction<T> = OrcestrActionItem<T>;

export type DataTableRowGroup<T> = {
    key: string;
    label: ReactNode;
    rows?: ReadonlyArray<T>;
};

export type DataTableExpansion<T> = {
    expandedRowKeys: ReadonlyArray<string>;
    onExpandedRowKeysChange: (keys: string[]) => void;
    renderExpandedRow: (row: T) => ReactNode;
    expandLabel?: string;
    collapseLabel?: string;
};

export type DataTableProps<T> = {
    rows: ReadonlyArray<T>;
    columns: ReadonlyArray<DataTableColumn<T>>;
    rowKey?: (row: T, index: number) => string;
    sort?: DataTableSort | ReadonlyArray<DataTableSort> | null;
    onSortChange?: (sort: DataTableSort | DataTableSort[] | null) => void;
    selectedRowKeys?: ReadonlyArray<string>;
    onSelectedRowKeysChange?: (keys: string[]) => void;
    selectable?: boolean;
    isLoading?: boolean;
    isFetchingNext?: boolean;
    hasNext?: boolean;
    sentinelRef?: (node: HTMLTableRowElement | null) => void;
    scrollRootRef?: (node: HTMLDivElement | null) => void;
    emptyText?: ReactNode;
    loadingText?: ReactNode;
    error?: ReactNode;
    errorTitle?: ReactNode;
    retryLabel?: ReactNode;
    onRetry?: () => void;
    onRowClick?: (row: T) => void;
    rowContextMenuActions?: (row: T) => ReadonlyArray<DataTableRowAction<T>>;
    rowGroup?: (row: T) => DataTableRowGroup<T> | null;
    expansion?: DataTableExpansion<T>;
    height?: number | string;
    total?: number;
    toolbar?: ReactNode;
    columnSettings?: DataTableColumnSettings<T>;
    virtualized?: boolean;
    virtualRowHeight?: number;
    virtualOverscan?: number;
    virtualWindow?: {
        start: number;
        end: number;
        beforeHeight?: number;
        afterHeight?: number;
    };
    testId?: string;
};

export function DataTable<T>({
    rows,
    columns,
    rowKey,
    sort,
    onSortChange,
    selectedRowKeys = [],
    onSelectedRowKeysChange,
    selectable = false,
    isLoading = false,
    isFetchingNext = false,
    hasNext = false,
    sentinelRef,
    scrollRootRef,
    emptyText,
    loadingText,
    error,
    errorTitle,
    retryLabel,
    onRetry,
    onRowClick,
    rowContextMenuActions,
    rowGroup,
    expansion,
    height,
    total,
    toolbar,
    columnSettings,
    virtualized = false,
    virtualRowHeight = 44,
    virtualOverscan = 8,
    virtualWindow,
    testId,
}: DataTableProps<T>) {
    const {copy} = useOrcestrUiLocale();
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const actualColumnWidths = columnSettings?.columnWidths ?? columnWidths;
    const [resizingColumnKey, setResizingColumnKey] = useState<string | null>(null);
    const [scrollState, setScrollState] = useState({top: 0, height: 0});
    const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
    const horizontalScrollAnimationRef = useRef<number | null>(null);
    const horizontalScrollTargetRef = useRef<number | null>(null);
    const sortItems = normalizeSort(sort);
    const settingsColumns = columnSettings?.columns ?? columns;
    const visibleColumns = useMemo(
        () => orderColumns(
            columns.filter((column) => columnVisible(column, columnSettings)),
            columnSettings?.columnOrder,
        ),
        [columnSettings, columns],
    );
    const keyedRows = useMemo(
        () =>
            rows.map((row, index) => ({
                row,
                key: rowKey?.(row, index) ?? String(index),
            })),
        [rowKey, rows],
    );
    const internalVirtualWindow = useMemo(() => {
        if (!virtualized || virtualWindow || scrollState.height <= 0) return null;
        const start = Math.max(
            0,
            Math.floor(scrollState.top / virtualRowHeight) - virtualOverscan,
        );
        const visibleCount = Math.ceil(scrollState.height / virtualRowHeight) + virtualOverscan * 2;
        const end = Math.min(keyedRows.length, start + visibleCount);
        return {
            start,
            end,
            beforeHeight: start * virtualRowHeight,
            afterHeight: Math.max(0, keyedRows.length - end) * virtualRowHeight,
        };
    }, [
        keyedRows.length,
        scrollState.height,
        scrollState.top,
        virtualized,
        virtualOverscan,
        virtualRowHeight,
        virtualWindow,
    ]);
    const actualVirtualWindow = virtualWindow ?? internalVirtualWindow;
    const renderedRows = useMemo(() => {
        if (!virtualized || !actualVirtualWindow) return keyedRows;
        return keyedRows.slice(actualVirtualWindow.start, actualVirtualWindow.end);
    }, [actualVirtualWindow, keyedRows, virtualized]);
    const selectedSet = useMemo(() => new Set(selectedRowKeys), [selectedRowKeys]);
    const expandedSet = useMemo(
        () => new Set(expansion?.expandedRowKeys ?? []),
        [expansion?.expandedRowKeys],
    );
    const visibleKeys = renderedRows.map((item) => item.key);
    const selectedVisibleCount = visibleKeys.filter((key) => selectedSet.has(key)).length;
    const allVisibleSelected = visibleKeys.length > 0 && selectedVisibleCount === visibleKeys.length;
    const someVisibleSelected = selectedVisibleCount > 0 && !allVisibleSelected;
    const colSpan = visibleColumns.length + (selectable ? 1 : 0) + (expansion ? 1 : 0);
    const pinnedLeftOffset = (selectable ? 42 : 0) + (expansion ? 34 : 0);
    const tableMinWidth = useMemo(
        () => tableMinimumWidth({
            columns: visibleColumns,
            columnWidths: actualColumnWidths,
            selectable,
            expandable: Boolean(expansion),
        }),
        [actualColumnWidths, expansion, selectable, visibleColumns],
    );
    const attachScrollRoot = useCallback((node: HTMLDivElement | null) => {
        scrollRootRef?.(node);
        if (!node) return;
        setScrollState({
            top: node.scrollTop,
            height: node.clientHeight,
        });
    }, [scrollRootRef]);

    const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
        const node = event.currentTarget;
        setScrollState({
            top: node.scrollTop,
            height: node.clientHeight,
        });
    }, []);

    const cancelHorizontalScrollAnimation = useCallback(() => {
        horizontalScrollTargetRef.current = null;
        if (horizontalScrollAnimationRef.current !== null) {
            window.cancelAnimationFrame(horizontalScrollAnimationRef.current);
            horizontalScrollAnimationRef.current = null;
        }
    }, []);

    const animateHorizontalScroll = useCallback((node: HTMLDivElement) => {
        if (horizontalScrollAnimationRef.current !== null) return;
        const tick = () => {
            const target = horizontalScrollTargetRef.current;
            if (target === null) {
                horizontalScrollAnimationRef.current = null;
                return;
            }
            const distance = target - node.scrollLeft;
            if (Math.abs(distance) < 0.5) {
                node.scrollLeft = target;
                horizontalScrollAnimationRef.current = null;
                horizontalScrollTargetRef.current = null;
                return;
            }
            node.scrollLeft += distance * 0.24;
            horizontalScrollAnimationRef.current = window.requestAnimationFrame(tick);
        };
        horizontalScrollAnimationRef.current = window.requestAnimationFrame(tick);
    }, []);

    const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
        if (!event.shiftKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        const node = event.currentTarget;
        if (node.scrollWidth <= node.clientWidth) return;
        event.preventDefault();
        const currentTarget = horizontalScrollTargetRef.current ?? node.scrollLeft;
        const maxScroll = Math.max(0, node.scrollWidth - node.clientWidth);
        horizontalScrollTargetRef.current = clamp(
            currentTarget + normalizeWheelDelta(event, node),
            0,
            maxScroll,
        );
        animateHorizontalScroll(node);
    }, [animateHorizontalScroll]);

    useEffect(() => {
        if (!resizingColumnKey || typeof document === 'undefined') return;
        const previousCursor = document.body.style.cursor;
        const previousUserSelect = document.body.style.userSelect;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        return () => {
            document.body.style.cursor = previousCursor;
            document.body.style.userSelect = previousUserSelect;
        };
    }, [resizingColumnKey]);

    useEffect(() => () => cancelHorizontalScrollAnimation(), [cancelHorizontalScrollAnimation]);

    const setSelectedKeys = (keys: string[]) => {
        onSelectedRowKeysChange?.(keys);
    };

    const toggleAllVisible = () => {
        if (!onSelectedRowKeysChange) return;
        if (allVisibleSelected) {
            setSelectedKeys(selectedRowKeys.filter((key) => !visibleKeys.includes(key)));
            return;
        }
        setSelectedKeys(Array.from(new Set([...selectedRowKeys, ...visibleKeys])));
    };

    const toggleRow = (key: string) => {
        if (!onSelectedRowKeysChange) return;
        if (selectedSet.has(key)) {
            setSelectedKeys(selectedRowKeys.filter((item) => item !== key));
            return;
        }
        setSelectedKeys([...selectedRowKeys, key]);
    };

    const toggleExpandedRow = (key: string) => {
        if (!expansion) return;
        if (expandedSet.has(key)) {
            expansion.onExpandedRowKeysChange(expansion.expandedRowKeys.filter((item) => item !== key));
            return;
        }
        expansion.onExpandedRowKeysChange([...expansion.expandedRowKeys, key]);
    };

    const toggleSort = (column: DataTableColumn<T>, event?: MouseEvent) => {
        if (!column.sortable || !onSortChange) return;
        const existing = sortItems.find((item) => item.key === column.key);
        const nextForColumn: DataTableSort | null = !existing
            ? {key: column.key, direction: 'asc'}
            : existing.direction === 'asc'
              ? {key: column.key, direction: 'desc'}
              : null;
        const keepOthers = event?.shiftKey ? sortItems.filter((item) => item.key !== column.key) : [];
        const next = nextForColumn ? [...keepOthers, nextForColumn] : keepOthers;
        onSortChange(next.length === 0 ? null : event?.shiftKey ? next : next[0]);
    };

    const startResize = (column: DataTableColumn<T>, event: ReactPointerEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const startX = event.clientX;
        const headerCell = event.currentTarget.closest('th');
        const measuredWidth = Math.round(headerCell?.getBoundingClientRect().width ?? 0);
        const startWidth =
            actualColumnWidths[column.key] ??
            (measuredWidth > 0 ? measuredWidth : undefined) ??
            numericWidth(column.width) ??
            column.minWidth ??
            160;
        setResizingColumnKey(column.key);
        const onMove = (moveEvent: globalThis.PointerEvent) => {
            const next = clamp(
                Math.round(startWidth + moveEvent.clientX - startX),
                column.minWidth ?? 72,
                column.maxWidth ?? 720,
            );
            if (columnSettings?.onColumnWidthsChange) {
                columnSettings.onColumnWidthsChange({
                    ...actualColumnWidths,
                    [column.key]: next,
                });
                return;
            }
            setColumnWidths((current) => ({...current, [column.key]: next}));
        };
        const onUp = () => {
            setResizingColumnKey(null);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (renderedRows.length === 0) return;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveRowIndex((current) => Math.min(renderedRows.length - 1, (current ?? -1) + 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveRowIndex((current) => Math.max(0, (current ?? renderedRows.length) - 1));
        } else if (event.key === 'Enter') {
            if (activeRowIndex == null) return;
            const item = renderedRows[activeRowIndex];
            if (item) onRowClick?.(item.row);
        } else if (event.key === ' ' && selectable) {
            if (activeRowIndex == null) return;
            const item = renderedRows[activeRowIndex];
            if (item) {
                event.preventDefault();
                toggleRow(item.key);
            }
        } else if (event.key === 'ArrowRight' && expansion) {
            if (activeRowIndex == null) return;
            const item = renderedRows[activeRowIndex];
            if (item && !expandedSet.has(item.key)) toggleExpandedRow(item.key);
        } else if (event.key === 'ArrowLeft' && expansion) {
            if (activeRowIndex == null) return;
            const item = renderedRows[activeRowIndex];
            if (item && expandedSet.has(item.key)) toggleExpandedRow(item.key);
        }
    };

    return (
        <div className='oui-data-table-shell' data-testid={testId ? `${testId}-shell` : undefined}>
            {toolbar || columnSettings ? (
                <div className='oui-data-table-toolbar'>
                    {toolbar ? (
                        <div className='oui-data-table-toolbar-content'>
                            {toolbar}
                        </div>
                    ) : null}
                    {columnSettings ? (
                        <ColumnSettingsPanel
                            columns={settingsColumns}
                            visibleColumnKeys={columnSettings.visibleColumnKeys}
                            columnOrder={columnSettings.columnOrder}
                            label={columnSettings.label ?? copy.table.columnSettings}
                            resetLabel={columnSettings.resetLabel ?? copy.common.reset}
                            emptyLabel={columnSettings.emptyLabel ?? copy.common.noData}
                            onVisibleColumnKeysChange={columnSettings.onVisibleColumnKeysChange}
                            onColumnOrderChange={columnSettings.onColumnOrderChange}
                            onReset={columnSettings.onReset}
                            testId={testId ? `${testId}-columns` : undefined}
                        />
                    ) : null}
                </div>
            ) : null}
            <div
                ref={attachScrollRoot}
                className='oui-data-table-wrap'
                style={{height}}
                role='grid'
                tabIndex={0}
                data-testid={testId}
                onScroll={virtualized ? handleScroll : undefined}
                onWheel={handleWheel}
                onPointerDown={cancelHorizontalScrollAnimation}
                onMouseDown={cancelHorizontalScrollAnimation}
                onKeyDown={handleKeyDown}
            >
                <table
                    className='oui-data-table'
                    aria-rowcount={total ?? rows.length}
                    style={{
                        minWidth: tableMinWidth ? `${tableMinWidth}px` : undefined,
                        '--oui-data-table-select-left-offset': expansion ? '34px' : '0px',
                        '--oui-data-table-pinned-left-offset': `${pinnedLeftOffset}px`,
                    } as CSSProperties}
                >
                <colgroup>
                    {expansion ? <col style={{width: 34}} /> : null}
                    {selectable ? <col style={{width: 42}} /> : null}
                    {visibleColumns.map((column) => (
                        <col
                            key={column.key}
                            style={{
                                width: formatCssSize(actualColumnWidths[column.key] ?? column.width),
                                minWidth: formatCssSize(column.minWidth),
                                maxWidth: formatCssSize(column.maxWidth),
                            }}
                        />
                    ))}
                </colgroup>
                <thead>
                    <tr>
                        {expansion ? (
                            <th
                                className='oui-data-table-expand-cell'
                                role='columnheader'
                                aria-hidden='true'
                            />
                        ) : null}
                        {selectable ? (
                            <th className='oui-data-table-select-cell' role='columnheader' scope='col'>
                                <span className='oui-data-table-select-control'>
                                    <Checkbox
                                        aria-label={copy.table.selectAllRows}
                                        checked={allVisibleSelected}
                                        ref={(node) => {
                                            if (node) node.indeterminate = someVisibleSelected;
                                        }}
                                        disabled={!onSelectedRowKeysChange || visibleKeys.length === 0}
                                        onChange={toggleAllVisible}
                                    />
                                </span>
                            </th>
                        ) : null}
                        {visibleColumns.map((column) => {
                            const activeSort = sortItems.find((item) => item.key === column.key) ?? null;
                            return (
                                <th
                                    key={column.key}
                                    role='columnheader'
                                    scope='col'
                                    data-pinned={column.pinned}
                                    data-resizing={resizingColumnKey === column.key ? 'true' : undefined}
                                    style={{
                                        width: formatCssSize(actualColumnWidths[column.key] ?? column.width),
                                        minWidth: formatCssSize(column.minWidth),
                                        maxWidth: formatCssSize(column.maxWidth),
                                        textAlign: column.align,
                                    }}
                                >
                                    <span className='oui-data-table-header-cell'>
                                        {column.sortable ? (
                                            <button
                                                type='button'
                                                className='oui-data-table-sort'
                                                data-active={activeSort ? 'true' : undefined}
                                                onClick={(event) => toggleSort(column, event)}
                                            >
                                                <span className='oui-data-table-sort-label'>{column.title}</span>
                                                {activeSort?.direction === 'asc' ? (
                                                    <LuArrowUp size={13} />
                                                ) : activeSort?.direction === 'desc' ? (
                                                    <LuArrowDown size={13} />
                                                ) : (
                                                    <span className='oui-data-table-sort-placeholder' />
                                                )}
                                            </button>
                                        ) : (
                                            column.title
                                        )}
                                        {column.resizable ? (
                                            <span
                                                role='separator'
                                                aria-orientation='vertical'
                                                tabIndex={0}
                                                className='oui-data-table-resize'
                                                aria-label={copy.common.resizeColumn}
                                                onPointerDown={(event) => startResize(column, event)}
                                            />
                                        ) : null}
                                    </span>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {error ? (
                        <DataTableMessageRow colSpan={colSpan}>
                            <Text fw={700}>{errorTitle ?? copy.table.unableToLoad}</Text>
                            <Text fs='12px' tone='muted'>
                                {error}
                            </Text>
                            {onRetry ? (
                                <Button
                                    size={1}
                                    v='surface'
                                    leftIcon={<LuRefreshCw size={14} />}
                                    onClick={onRetry}
                                >
                                    {retryLabel ?? copy.common.retry}
                                </Button>
                            ) : null}
                        </DataTableMessageRow>
                    ) : isLoading ? (
                        <DataTableMessageRow colSpan={colSpan}>
                            <Spinner />
                            <Text fs='12px' tone='muted'>
                                {loadingText ?? copy.table.loadingRows}
                            </Text>
                        </DataTableMessageRow>
                    ) : renderedRows.length === 0 ? (
                        <DataTableMessageRow colSpan={colSpan}>
                            <Text fs='12px' tone='muted'>
                                {emptyText ?? copy.common.noData}
                            </Text>
                        </DataTableMessageRow>
                    ) : (
                        <>
                            {virtualized && actualVirtualWindow?.beforeHeight ? (
                                <tr role='row' aria-hidden='true'>
                                    <td colSpan={colSpan} style={{height: actualVirtualWindow.beforeHeight, padding: 0}} />
                                </tr>
                            ) : null}
                            {renderGroupedRows({
                                activeRowIndex,
                                colSpan,
                                columns: visibleColumns,
                                copy,
                                expandedSet,
                                expansion,
                                renderedRows,
                                rowContextMenuActions,
                                rowGroup,
                                onRowClick,
                                onSelectToggle: toggleRow,
                                onExpandToggle: toggleExpandedRow,
                                selectable,
                                selectedSet,
                                canSelect: Boolean(onSelectedRowKeysChange),
                            })}
                            {virtualized && actualVirtualWindow?.afterHeight ? (
                                <tr role='row' aria-hidden='true'>
                                    <td colSpan={colSpan} style={{height: actualVirtualWindow.afterHeight, padding: 0}} />
                                </tr>
                            ) : null}
                            {hasNext ? (
                                <tr ref={sentinelRef} role='row' aria-hidden='true'>
                                    <td colSpan={colSpan}>
                                        <div className='oui-data-table-next-loader'>
                                            {isFetchingNext ? <Spinner size={1} /> : null}
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                        </>
                    )}
                </tbody>
                </table>
            </div>
        </div>
    );
}

function ColumnSettingsPanel<T>({
    columns,
    visibleColumnKeys,
    columnOrder,
    label,
    resetLabel,
    emptyLabel,
    onVisibleColumnKeysChange,
    onColumnOrderChange,
    onReset,
    testId,
}: {
    columns: ReadonlyArray<DataTableColumn<T>>;
    visibleColumnKeys: ReadonlyArray<string>;
    columnOrder?: ReadonlyArray<string>;
    label: ReactNode;
    resetLabel: ReactNode;
    emptyLabel: ReactNode;
    onVisibleColumnKeysChange: (keys: string[]) => void;
    onColumnOrderChange?: (keys: string[]) => void;
    onReset?: () => void;
    testId?: string;
}) {
    const configurableColumns = orderColumns(
        columns.filter((column) => column.hideable !== false),
        columnOrder,
    );
    const visibleSet = new Set(visibleColumnKeys);
    const orderedKeys = configurableColumns.map((column) => column.key);
    const selectedCount = orderedKeys.filter((key) => visibleSet.has(key)).length;

    const toggleColumn = (key: string) => {
        if (visibleSet.has(key)) {
            if (selectedCount <= 1) return;
            onVisibleColumnKeysChange(visibleColumnKeys.filter((item) => item !== key));
            return;
        }
        onVisibleColumnKeysChange([...visibleColumnKeys, key]);
    };

    const moveColumn = (key: string, direction: -1 | 1) => {
        if (!onColumnOrderChange) return;
        const current = columnOrder?.length ? [...columnOrder] : columns.map((column) => column.key);
        const index = current.indexOf(key);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return;
        const next = [...current];
        [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
        onColumnOrderChange(next);
    };

    return (
        <Popover
            trigger={(
                <IconButton
                    v='surface'
                    icon={<LuSettings2 size={16} />}
                    aria-label={typeof label === 'string' ? label : undefined}
                    testId={testId}
                />
            )}
            align='end'
            className='oui-data-table-column-settings'
            testId={testId ? `${testId}-popover` : undefined}
        >
            <div className='oui-data-table-column-settings-head'>
                <Text fs='13px' fw={760}>
                    {label}
                </Text>
                {onReset ? (
                    <Button
                        className='oui-data-table-settings-reset'
                        size={1}
                        v='ghost'
                        leftIcon={<LuRotateCcw size={13} />}
                        onClick={onReset}
                    >
                        {resetLabel}
                    </Button>
                ) : null}
            </div>
            <div className='oui-data-table-column-settings-list'>
                {configurableColumns.length === 0 ? (
                    <Text fs='12px' tone='muted'>
                        {emptyLabel}
                    </Text>
                ) : configurableColumns.map((column, index) => {
                    const visible = visibleSet.has(column.key);
                    return (
                        <div key={column.key} className='oui-data-table-column-settings-row'>
                            <label className='oui-data-table-column-toggle'>
                                <Checkbox
                                    checked={visible}
                                    disabled={visible && selectedCount <= 1}
                                    onChange={() => toggleColumn(column.key)}
                                />
                                <span>{column.title}</span>
                            </label>
                            {onColumnOrderChange ? (
                                <span className='oui-data-table-column-settings-order'>
                                    <button
                                        type='button'
                                        disabled={index === 0}
                                        onClick={() => moveColumn(column.key, -1)}
                                    >
                                        <LuArrowUp size={13} />
                                    </button>
                                    <button
                                        type='button'
                                        disabled={index === configurableColumns.length - 1}
                                        onClick={() => moveColumn(column.key, 1)}
                                    >
                                        <LuArrowDown size={13} />
                                    </button>
                                </span>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </Popover>
    );
}

function DataTableRow<T>({
    row,
    columns,
    active,
    expanded,
    expansion,
    selected,
    selectable,
    canSelect,
    onToggle,
    onExpandToggle,
    onRowClick,
    actions,
    selectLabel,
}: {
    row: T;
    columns: ReadonlyArray<DataTableColumn<T>>;
    active: boolean;
    expanded: boolean;
    expansion?: DataTableExpansion<T>;
    selected: boolean;
    selectable: boolean;
    canSelect: boolean;
    onToggle: () => void;
    onExpandToggle: () => void;
    onRowClick?: (row: T) => void;
    actions: ReadonlyArray<DataTableRowAction<T>>;
    selectLabel: string;
}) {
    const rowNode = (
        <tr
            role='row'
            data-selected={selected ? 'true' : undefined}
            data-active={active ? 'true' : undefined}
            data-clickable={onRowClick ? 'true' : undefined}
            onClick={() => onRowClick?.(row)}
        >
            {expansion ? (
                <td className='oui-data-table-expand-cell' role='gridcell'>
                    <button
                        type='button'
                        className='oui-data-table-expand'
                        aria-label={expanded ? expansion.collapseLabel : expansion.expandLabel}
                        aria-expanded={expanded}
                        onClick={(event) => {
                            event.stopPropagation();
                            onExpandToggle();
                        }}
                    >
                        {expanded ? <LuChevronDown size={14} /> : <LuChevronRight size={14} />}
                    </button>
                </td>
            ) : null}
            {selectable ? (
                <td className='oui-data-table-select-cell' role='gridcell'>
                    <span className='oui-data-table-select-control'>
                        <Checkbox
                            aria-label={selectLabel}
                            checked={selected}
                            disabled={!canSelect}
                            onClick={(event) => event.stopPropagation()}
                            onChange={onToggle}
                        />
                    </span>
                </td>
            ) : null}
            {columns.map((column) => (
                <td
                    key={column.key}
                    role='gridcell'
                    data-pinned={column.pinned}
                    style={{textAlign: column.align}}
                >
                    {column.render(row)}
                </td>
            ))}
        </tr>
    );

    if (actions.length === 0) return rowNode;

    const menuItems: MenuItem[] = actions.map(({children: _children, onSelect, ...action}) => ({
        ...action,
        onSelect: () => onSelect?.(row),
    }));

    return (
        <ContextMenu items={menuItems}>
            {rowNode}
        </ContextMenu>
    );
}

function renderGroupedRows<T>({
    activeRowIndex,
    colSpan,
    columns,
    copy,
    expandedSet,
    expansion,
    renderedRows,
    rowContextMenuActions,
    rowGroup,
    onRowClick,
    onSelectToggle,
    onExpandToggle,
    selectable,
    selectedSet,
    canSelect,
}: {
    activeRowIndex: number | null;
    colSpan: number;
    columns: ReadonlyArray<DataTableColumn<T>>;
    copy: ReturnType<typeof useOrcestrUiLocale>['copy'];
    expandedSet: Set<string>;
    expansion?: DataTableExpansion<T>;
    renderedRows: ReadonlyArray<{row: T; key: string}>;
    rowContextMenuActions?: (row: T) => ReadonlyArray<DataTableRowAction<T>>;
    rowGroup?: (row: T) => DataTableRowGroup<T> | null;
    onRowClick?: (row: T) => void;
    onSelectToggle: (key: string) => void;
    onExpandToggle: (key: string) => void;
    selectable: boolean;
    selectedSet: Set<string>;
    canSelect: boolean;
}) {
    let previousGroupKey: string | null = null;

    return renderedRows.map(({row, key}, index) => {
        const group = rowGroup?.(row) ?? null;
        const showGroup = group && group.key !== previousGroupKey;
        if (group) previousGroupKey = group.key;
        const expanded = expandedSet.has(key);

        return (
            <Fragment key={key}>
                {showGroup ? (
                    <tr className='oui-data-table-group-row' role='row'>
                        <td role='gridcell' colSpan={colSpan}>{group.label}</td>
                    </tr>
                ) : null}
                <DataTableRow
                    row={row}
                    columns={columns}
                    active={index === activeRowIndex}
                    expanded={expanded}
                    expansion={
                        expansion
                            ? {
                                  ...expansion,
                                  expandLabel: expansion.expandLabel ?? copy.table.expandRow,
                                  collapseLabel: expansion.collapseLabel ?? copy.table.collapseRow,
                              }
                            : undefined
                    }
                    selected={selectedSet.has(key)}
                    selectable={selectable}
                    canSelect={canSelect}
                    onToggle={() => onSelectToggle(key)}
                    onExpandToggle={() => onExpandToggle(key)}
                    onRowClick={onRowClick}
                    actions={rowContextMenuActions?.(row) ?? []}
                    selectLabel={copy.table.selectRow}
                />
                {expanded && expansion ? (
                    <tr className='oui-data-table-expanded-row' role='row'>
                        <td role='gridcell' colSpan={colSpan}>{expansion.renderExpandedRow(row)}</td>
                    </tr>
                ) : null}
            </Fragment>
        );
    });
}

function DataTableMessageRow({
    colSpan,
    children,
}: {
    colSpan: number;
    children: ReactNode;
}) {
    return (
        <tr role='row'>
            <td role='gridcell' colSpan={colSpan}>
                <div className='oui-data-table-message'>{children}</div>
            </td>
        </tr>
    );
}

function normalizeSort(
    sort: DataTableSort | ReadonlyArray<DataTableSort> | null | undefined,
): DataTableSort[] {
    if (!sort) return [];
    return Array.isArray(sort) ? [...(sort as DataTableSort[])] : [sort as DataTableSort];
}

function columnVisible<T>(
    column: DataTableColumn<T>,
    settings?: DataTableColumnSettings<T>,
) {
    if (!settings) return column.defaultVisible !== false;
    return settings.visibleColumnKeys.includes(column.key);
}

function orderColumns<T>(
    columns: ReadonlyArray<DataTableColumn<T>>,
    order?: ReadonlyArray<string>,
) {
    const ordered = order
        ? [...columns].sort((left, right) => {
              const leftIndex = order.indexOf(left.key);
              const rightIndex = order.indexOf(right.key);
              return indexOrEnd(leftIndex) - indexOrEnd(rightIndex);
          })
        : [...columns];

    return [
        ...ordered.filter((column) => column.pinned === 'left'),
        ...ordered.filter((column) => !column.pinned),
        ...ordered.filter((column) => column.pinned === 'right'),
    ];
}

function indexOrEnd(index: number) {
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function formatCssSize(value: number | string | undefined): string | undefined {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
}

function numericWidth(value: number | string | undefined) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && /^\d+px$/.test(value)) {
        return Number.parseInt(value, 10);
    }
    return undefined;
}

function tableMinimumWidth<T>({
    columns,
    columnWidths,
    selectable,
    expandable,
}: {
    columns: ReadonlyArray<DataTableColumn<T>>;
    columnWidths: Record<string, number>;
    selectable: boolean;
    expandable: boolean;
}) {
    const base = (selectable ? 42 : 0) + (expandable ? 34 : 0);
    return columns.reduce((total, column) => {
        const width =
            columnWidths[column.key] ??
            numericWidth(column.width) ??
            column.minWidth ??
            120;
        return total + width;
    }, base);
}

function normalizeWheelDelta(event: WheelEvent<HTMLElement>, node: HTMLElement) {
    if (event.deltaMode === 1) return event.deltaY * 16;
    if (event.deltaMode === 2) return event.deltaY * node.clientWidth;
    return event.deltaY;
}

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}
