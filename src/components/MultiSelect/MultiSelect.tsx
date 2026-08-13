'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useId,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from 'react';
import { LuCheck, LuChevronsUpDown, LuX } from 'react-icons/lu';

import { useListNavigation } from '../../hooks/useListNavigation.js';
import { useTypeahead } from '../../hooks/useTypeahead.js';
import { useOrcestrUiLocale } from '../../locale/LocaleProvider.js';
import type { UiSize } from '../../theme/systemProps.js';
import { Button } from '../Button/Button.js';
import { FloatingFieldDecoration } from '../Field/FloatingFieldDecoration.js';
import { Popover } from '../Popover/Popover.js';
import type { SelectItem } from '../Select/Select.js';
import { TextField } from '../TextField/TextField.js';

export type MultiSelectProps<V extends string = string> = {
    items: ReadonlyArray<SelectItem<V>>;
    value: ReadonlyArray<V>;
    onValueChange: (value: V[]) => void;
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
    showChevron?: boolean;
    emptyText?: ReactNode;
    clearLabel?: string;
    ariaLabel?: string;
    selectedFallbackLabel?: ReactNode | ((values: ReadonlyArray<V>) => ReactNode);
    size?: UiSize;
    maxHeight?: number;
    className?: string;
    renderValue?: (items: ReadonlyArray<SelectItem<V>>) => ReactNode;
    searchable?: boolean;
    searchPlaceholder?: string;
    testId?: string;
    floatingLabel?: ReactNode;
};

export function MultiSelect<V extends string = string>({
    items,
    value,
    onValueChange,
    placeholder,
    clearable = true,
    disabled = false,
    showChevron = true,
    emptyText,
    clearLabel,
    ariaLabel,
    selectedFallbackLabel,
    size = 3,
    maxHeight = 280,
    className,
    renderValue,
    searchable = false,
    searchPlaceholder,
    testId,
    floatingLabel,
}: MultiSelectProps<V>) {
    const { copy } = useOrcestrUiLocale();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const listboxId = useId();
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const selectedItems = useMemo(
        () => items.filter((item) => value.includes(item.value)),
        [items, value],
    );
    const selectedSet = useMemo(() => new Set(value), [value]);
    const filteredItems = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!searchable || !query) return items;
        return items.filter((item) => selectItemText(item).toLowerCase().includes(query));
    }, [items, search, searchable]);
    const navigationItems = useMemo(
        () =>
            filteredItems.map((item) => ({
                value: item.value,
                disabled: item.disabled,
                searchText: selectItemText(item),
            })),
        [filteredItems],
    );
    const navigation = useListNavigation(navigationItems, {
        value: value[0] ?? null,
    });
    const highlighted = navigation.highlightedValue as V | null;
    const canClear = clearable && selectedItems.length > 0 && !disabled;
    const triggerLabel =
        selectedItems.length > 0
            ? (renderValue?.(selectedItems) ??
              defaultMultiSelectLabel(selectedItems, copy.common.selectedCount))
            : value.length > 0
              ? typeof selectedFallbackLabel === 'function'
                  ? selectedFallbackLabel(value)
                  : selectedFallbackLabel
              : null;

    useEffect(() => {
        if (!open || highlighted === null) return;
        const node = optionsRef.current?.querySelector<HTMLElement>(
            `[data-oui-multi-select-value="${cssAttr(highlighted)}"]`,
        );
        node?.scrollIntoView({ block: 'nearest' });
    }, [highlighted, open]);

    const toggle = useCallback(
        (nextValue: V) => {
            if (selectedSet.has(nextValue)) {
                onValueChange(value.filter((itemValue) => itemValue !== nextValue));
                return;
            }
            onValueChange([...value, nextValue]);
        },
        [onValueChange, selectedSet, value],
    );

    const close = useCallback(() => {
        setOpen(false);
        setSearch('');
        navigation.reset();
    }, [navigation]);

    const handleTypeahead = useTypeahead((query) => {
        const match = navigation.enabledItems.find((item) =>
            item.searchText?.toLowerCase().startsWith(query),
        );
        if (match) navigation.setHighlightedValue(match.value);
    });

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const fromSearchInput = (event.currentTarget as HTMLElement).tagName === 'INPUT';
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
                    event.preventDefault();
                    if (highlighted !== null) toggle(highlighted);
                    break;
                case ' ':
                    if (fromSearchInput) break;
                    event.preventDefault();
                    if (highlighted !== null) toggle(highlighted);
                    break;
                case 'Escape':
                    event.preventDefault();
                    close();
                    break;
                default:
                    if (
                        !fromSearchInput &&
                        event.key.length === 1 &&
                        !event.metaKey &&
                        !event.ctrlKey
                    ) {
                        handleTypeahead(event.key);
                    }
            }
        },
        [close, handleTypeahead, highlighted, navigation, open, toggle],
    );

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) {
                    setSearch('');
                    navigation.reset();
                }
            }}
            trigger={
                <Button
                    asChild
                    v="surface"
                    size={size}
                    disabled={disabled}
                    fullWidth
                    pressAnimation="none"
                    className={
                        floatingLabel !== undefined
                            ? 'oui-combobox-trigger oui-multi-select-trigger oui-floating-field'
                            : 'oui-combobox-trigger oui-multi-select-trigger'
                    }
                    data-state={open ? 'open' : 'closed'}
                    data-floating={
                        floatingLabel !== undefined && (open || value.length > 0)
                            ? 'true'
                            : undefined
                    }
                    data-focused={floatingLabel !== undefined && open ? 'true' : undefined}
                    testId={testId}
                >
                    <div
                        role="combobox"
                        tabIndex={disabled ? -1 : 0}
                        aria-haspopup="listbox"
                        aria-label={
                            ariaLabel ??
                            reactNodeText(triggerLabel ?? placeholder ?? copy.common.selectValue)
                        }
                        aria-expanded={open}
                        aria-controls={listboxId}
                        onKeyDown={handleKeyDown}
                    >
                        {floatingLabel !== undefined ? (
                            <FloatingFieldDecoration label={floatingLabel} />
                        ) : null}
                        <span className="oui-button-label">
                            <span
                                className={
                                    triggerLabel
                                        ? 'oui-combobox-trigger-label'
                                        : 'oui-combobox-placeholder'
                                }
                            >
                                {triggerLabel ?? placeholder ?? copy.common.selectValue}
                            </span>
                        </span>
                        <span className="oui-combobox-trigger-actions">
                            {canClear ? (
                                <button
                                    type="button"
                                    aria-label={clearLabel ?? copy.common.clearSelectedValues}
                                    className="oui-combobox-clear"
                                    onKeyDown={(event) => event.stopPropagation()}
                                    onPointerDown={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        onValueChange([]);
                                        navigation.reset();
                                    }}
                                >
                                    <LuX size={14} />
                                </button>
                            ) : null}
                            {showChevron ? <LuChevronsUpDown size={15} /> : null}
                        </span>
                    </div>
                </Button>
            }
            className={className ? `oui-select-content ${className}` : 'oui-select-content'}
            testId={testId ? `${testId}-popover` : undefined}
            align="start"
            sideOffset={4}
            matchTriggerWidth
            disabled={disabled}
        >
            {searchable ? (
                <div className="oui-combobox-search-wrap">
                    <TextField
                        size={1}
                        placeholder={searchPlaceholder ?? copy.common.search}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyDown={handleKeyDown}
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={open}
                        aria-controls={listboxId}
                    />
                </div>
            ) : null}
            <div
                ref={optionsRef}
                id={listboxId}
                role="listbox"
                aria-multiselectable="true"
                className="oui-combobox-scroll oui-combobox-options"
                data-testid={testId ? `${testId}-listbox` : undefined}
                style={{ maxHeight }}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
            >
                {filteredItems.length === 0 ? (
                    <div className="oui-combobox-empty">{emptyText ?? copy.common.noOptions}</div>
                ) : (
                    filteredItems.map((item) => {
                        const selected = selectedSet.has(item.value);
                        const isHighlighted = highlighted === item.value;
                        return (
                            <button
                                key={item.value}
                                type="button"
                                role="option"
                                aria-selected={selected}
                                disabled={item.disabled}
                                className="oui-combobox-option oui-multi-select-option"
                                data-oui-multi-select-value={item.value}
                                data-selected={selected ? 'true' : 'false'}
                                data-highlighted={isHighlighted ? 'true' : 'false'}
                                onMouseEnter={() => {
                                    if (!item.disabled) {
                                        navigation.setHighlightedValue(item.value);
                                    }
                                }}
                                onClick={() => {
                                    if (!item.disabled) toggle(item.value);
                                }}
                            >
                                <span className="oui-multi-select-check">
                                    {selected ? <LuCheck size={14} /> : null}
                                </span>
                                <span className="oui-combobox-option-main">{item.label}</span>
                            </button>
                        );
                    })
                )}
            </div>
        </Popover>
    );
}

function defaultMultiSelectLabel<V extends string>(
    items: ReadonlyArray<SelectItem<V>>,
    selectedCount: (count: number) => string,
) {
    if (items.length <= 2) {
        return items.map((item) => selectItemText(item)).join(', ');
    }

    return selectedCount(items.length);
}

function selectItemText(item: SelectItem) {
    const label = item.triggerLabel ?? item.label;
    if (typeof label === 'string') return label;
    if (typeof label === 'number') return String(label);
    return item.searchText ?? String(item.value);
}

function cssAttr(value: string): string {
    return value.replace(/"/g, '\\"');
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
