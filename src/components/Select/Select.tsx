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
import {LuCheck, LuChevronsUpDown, LuX} from 'react-icons/lu';

import {Button} from '../Button/Button';
import {Popover} from '../Popover/Popover';
import type {UiSize} from '../../theme/systemProps';
import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {useListNavigation} from '../../hooks/useListNavigation';
import {useTypeahead} from '../../hooks/useTypeahead';

export type SelectItem<V extends string = string> = {
    value: V;
    label: ReactNode;
    searchText?: string;
    triggerLabel?: ReactNode;
    disabled?: boolean;
};

export function Select<V extends string = string>({
    items,
    value,
    onValueChange,
    placeholder,
    selectedFallbackLabel,
    clearable = false,
    disabled = false,
    emptyText,
    size = 3,
    maxHeight = 280,
    onClear,
    className,
    showChevron = true,
    clearLabel,
    testId,
}: {
    items: ReadonlyArray<SelectItem<V>>;
    value: V | null;
    onValueChange: (value: V | null) => void;
    placeholder?: string;
    selectedFallbackLabel?: ReactNode;
    clearable?: boolean;
    disabled?: boolean;
    emptyText?: ReactNode;
    size?: UiSize;
    maxHeight?: number;
    onClear?: () => void;
    className?: string;
    showChevron?: boolean;
    clearLabel?: string;
    testId?: string;
}) {
    const {copy} = useOrcestrUiLocale();
    const actualPlaceholder = placeholder ?? copy.common.selectValue;
    const actualEmptyText = emptyText ?? copy.common.noOptions;
    const [open, setOpen] = useState(false);
    const listboxId = useId();
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const navigationItems = useMemo(
        () =>
            items.map((item) => ({
                value: item.value,
                disabled: item.disabled,
                searchText: labelText(item),
            })),
        [items],
    );
    const navigation = useListNavigation(navigationItems, {value});
    const selected = useMemo(
        () => items.find((item) => item.value === value) ?? null,
        [items, value],
    );
    const highlighted = navigation.highlightedValue as V | null;

    useEffect(() => {
        if (!open || highlighted === null) return;
        const node = optionsRef.current?.querySelector<HTMLElement>(
            `[data-oui-select-value="${cssAttr(highlighted)}"]`,
        );
        node?.scrollIntoView({block: 'nearest'});
    }, [highlighted, open]);

    const commit = useCallback(
        (next: V) => {
            onValueChange(next);
            setOpen(false);
            navigation.reset();
        },
        [navigation, onValueChange],
    );

    const handleTypeahead = useTypeahead((query) => {
        const match = navigation.enabledItems.find((item) =>
            item.searchText?.toLowerCase().startsWith(query),
        );
        if (match) navigation.setHighlightedValue(match.value);
    }, 600);

    const close = useCallback(() => {
        setOpen(false);
        navigation.reset();
    }, [navigation]);

    const openList = useCallback(() => {
        setOpen(true);
    }, []);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
                event.preventDefault();
                openList();
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
                    if (highlighted !== null) commit(highlighted);
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
        [close, commit, handleTypeahead, highlighted, navigation, open, openList],
    );

    const hasSelectedValue = value !== null;
    const canClear = clearable && hasSelectedValue && !disabled;
    const triggerLabel = selected?.triggerLabel ?? selected?.label ?? selectedFallbackLabel ?? null;

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
                    className='oui-combobox-trigger'
                    data-state={open ? 'open' : 'closed'}
                    testId={testId}
                    aria-haspopup='listbox'
                    aria-expanded={open}
                    aria-controls={listboxId}
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
                                        close();
                                        if (onClear) onClear();
                                        else onValueChange(null);
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
                id={listboxId}
                tabIndex={-1}
                className='oui-combobox-scroll oui-combobox-options'
                data-testid={testId ? `${testId}-listbox` : undefined}
                style={{maxHeight}}
                onKeyDown={handleKeyDown}
            >
                {items.length === 0 ? (
                    <div className='oui-combobox-empty'>{actualEmptyText}</div>
                ) : (
                    items.map((item) => {
                        const isSelected = item.value === value;
                        const isHighlighted = item.value === highlighted;
                        return (
                            <button
                                key={item.value}
                                type='button'
                                role='option'
                                aria-selected={isSelected}
                                disabled={item.disabled}
                                className='oui-combobox-option'
                                data-oui-select-value={item.value}
                                data-selected={isSelected ? 'true' : 'false'}
                                data-highlighted={isHighlighted ? 'true' : 'false'}
                                onMouseEnter={() => {
                                    if (!item.disabled) {
                                        navigation.setHighlightedValue(item.value);
                                    }
                                }}
                                onClick={() => {
                                    if (!item.disabled) commit(item.value);
                                }}
                            >
                                <span className='oui-combobox-option-main'>
                                    {item.label}
                                </span>
                                {isSelected ? (
                                    <LuCheck className='oui-combobox-check' size={15} />
                                ) : null}
                            </button>
                        );
                    })
                )}
            </div>
        </Popover>
    );
}

function labelText(item: SelectItem): string {
    if (item.searchText) return item.searchText;
    return reactNodeText(item.label);
}

function reactNodeText(value: ReactNode): string {
    if (value === null || value === undefined || value === false) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (Array.isArray(value)) return value.map(reactNodeText).join('');
    if (typeof value === 'object' && 'props' in value) {
        const props = value.props as {children?: ReactNode};
        return reactNodeText(props.children);
    }
    return '';
}

function cssAttr(value: string): string {
    return value.replace(/"/g, '\\"');
}
