'use client';

import type { ReactNode } from 'react';
import { LuArrowDown, LuArrowUp, LuRotateCcw, LuSettings2 } from 'react-icons/lu';

import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { IconButton } from '../IconButton/IconButton';
import { Popover } from '../Popover/Popover';
import { Text } from '../Text/Text';
import type { DataTableColumn } from './DataTable';

export function DataTableColumnSettingsPanel<T>({
    columns,
    visibleColumnKeys,
    columnOrder,
    label,
    resetLabel,
    emptyLabel,
    moveLeftLabel,
    moveRightLabel,
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
    moveLeftLabel: string;
    moveRightLabel: string;
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
        const current = columnOrder?.length
            ? [...columnOrder]
            : columns.map((column) => column.key);
        const index = current.indexOf(key);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return;
        const next = [...current];
        [next[index], next[nextIndex]] = [next[nextIndex]!, next[index]!];
        onColumnOrderChange(next);
    };

    return (
        <Popover
            trigger={
                <IconButton
                    v="surface"
                    icon={<LuSettings2 size={16} />}
                    aria-label={typeof label === 'string' ? label : undefined}
                    testId={testId}
                />
            }
            align="end"
            className="oui-data-table-column-settings"
            testId={testId ? `${testId}-popover` : undefined}
        >
            <div className="oui-data-table-column-settings-head">
                <Text fs="13px" fw={760}>
                    {label}
                </Text>
                {onReset ? (
                    <Button
                        className="oui-data-table-settings-reset"
                        size={1}
                        v="ghost"
                        leftIcon={<LuRotateCcw size={13} />}
                        onClick={onReset}
                    >
                        {resetLabel}
                    </Button>
                ) : null}
            </div>
            <div className="oui-data-table-column-settings-list">
                {configurableColumns.length === 0 ? (
                    <Text fs="12px" tone="muted">
                        {emptyLabel}
                    </Text>
                ) : (
                    configurableColumns.map((column, index) => {
                        const visible = visibleSet.has(column.key);
                        return (
                            <div key={column.key} className="oui-data-table-column-settings-row">
                                <label className="oui-data-table-column-toggle">
                                    <Checkbox
                                        checked={visible}
                                        disabled={visible && selectedCount <= 1}
                                        onChange={() => toggleColumn(column.key)}
                                    />
                                    <span>{column.title}</span>
                                </label>
                                {onColumnOrderChange ? (
                                    <span className="oui-data-table-column-settings-order">
                                        <button
                                            type="button"
                                            aria-label={moveLeftLabel}
                                            disabled={index === 0}
                                            onClick={() => moveColumn(column.key, -1)}
                                        >
                                            <LuArrowUp size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label={moveRightLabel}
                                            disabled={index === configurableColumns.length - 1}
                                            onClick={() => moveColumn(column.key, 1)}
                                        >
                                            <LuArrowDown size={13} />
                                        </button>
                                    </span>
                                ) : null}
                            </div>
                        );
                    })
                )}
            </div>
        </Popover>
    );
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
