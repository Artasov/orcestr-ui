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
import {LuCheck, LuChevronsUpDown, LuX} from 'react-icons/lu';

import {useListNavigation} from '../../hooks/useListNavigation';
import {useTypeahead} from '../../hooks/useTypeahead';
import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import type {UiSize} from '../../theme/systemProps';
import {Button} from '../Button/Button';
import {Popover} from '../Popover/Popover';
import type {SelectItem} from '../Select/Select';

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
    selectedFallbackLabel,
    size = 3,
    maxHeight = 280,
    className,
    renderValue,
    testId,
}: {
    items: ReadonlyArray<SelectItem<V>>;
    value: ReadonlyArray<V>;
    onValueChange: (value: V[]) => void;
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
    showChevron?: boolean;
    emptyText?: ReactNode;
    clearLabel?: string;
    selectedFallbackLabel?: ReactNode | ((values: ReadonlyArray<V>) => ReactNode);
    size?: UiSize;
    maxHeight?: number;
    className?: string;
    renderValue?: (items: ReadonlyArray<SelectItem<V>>) => ReactNode;
    testId?: string;
}) {
    const {copy} = useOrcestrUiLocale();
    const [open, setOpen] = useState(false);
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const selectedItems = useMemo(
        () => items.filter((item) => value.includes(item.value)),
        [items, value],
    );
    const selectedSet = useMemo(() => new Set(value), [value]);
    const navigationItems = useMemo(
        () =>
            items.map((item) => ({
                value: item.value,
                disabled: item.disabled,
                searchText: selectItemText(item),
            })),
        [items],
    );
    const navigation = useListNavigation(navigationItems, {
        value: value[0] ?? null,
    });
    const highlighted = navigation.highlightedValue as V | null;
    const canClear = clearable && selectedItems.length > 0 && !disabled;
    const triggerLabel =
        selectedItems.length > 0
            ? renderValue?.(selectedItems) ?? defaultMultiSelectLabel(selectedItems)
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
        node?.scrollIntoView({block: 'nearest'});
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
                case ' ':
                    event.preventDefault();
                    if (highlighted !== null) toggle(highlighted);
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
        [close, handleTypeahead, highlighted, navigation, open, toggle],
    );

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) navigation.reset();
            }}
            trigger={
                <Button
                    type='button'
                    v='surface'
                    size={size}
                    disabled={disabled}
                    fullWidth
                    pressAnimation='none'
                    className='oui-combobox-trigger oui-multi-select-trigger'
                    data-state={open ? 'open' : 'closed'}
                    testId={testId}
                    aria-haspopup='listbox'
                    aria-expanded={open}
                    onKeyDown={handleKeyDown}
                    rightIcon={
                        <span className='oui-combobox-trigger-actions'>
                            {canClear ? (
                                <span
                                    aria-label={clearLabel ?? copy.common.clearSelectedValues}
                                    className='oui-combobox-clear'
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
                                </span>
                            ) : null}
                            {showChevron ? <LuChevronsUpDown size={15} /> : null}
                        </span>
                    }
                >
                    <span
                        className={
                            triggerLabel
                                ? 'oui-combobox-trigger-label'
                                : 'oui-combobox-placeholder'
                        }
                    >
                        {triggerLabel ?? placeholder ?? copy.common.selectValue}
                    </span>
                </Button>
            }
            className={className ? `oui-select-content ${className}` : 'oui-select-content'}
            testId={testId ? `${testId}-popover` : undefined}
            align='start'
            sideOffset={4}
            matchTriggerWidth
            disabled={disabled}
        >
            <div
                ref={optionsRef}
                role='listbox'
                aria-multiselectable='true'
                className='oui-combobox-scroll oui-combobox-options'
                data-testid={testId ? `${testId}-listbox` : undefined}
                style={{maxHeight}}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
            >
                {items.length === 0 ? (
                    <div className='oui-combobox-empty'>{emptyText ?? copy.common.noOptions}</div>
                ) : (
                    items.map((item) => {
                        const selected = selectedSet.has(item.value);
                        const isHighlighted = highlighted === item.value;
                        return (
                            <button
                                key={item.value}
                                type='button'
                                role='option'
                                aria-selected={selected}
                                disabled={item.disabled}
                                className='oui-combobox-option oui-multi-select-option'
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
                                <span className='oui-multi-select-check'>
                                    {selected ? <LuCheck size={14} /> : null}
                                </span>
                                <span className='oui-combobox-option-main'>
                                    {item.label}
                                </span>
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
) {
    if (items.length <= 2) {
        return items.map((item) => selectItemText(item)).join(', ');
    }

    return `${items.length} selected`;
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
