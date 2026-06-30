'use client';

import {useCallback, useEffect, useMemo, useRef, type KeyboardEvent} from 'react';

import {useListNavigation} from '../../hooks/useListNavigation';
import {useTypeahead} from '../../hooks/useTypeahead';
import {cn} from '../../utils/cn';

export type ListboxItem = {
    value: string;
    label: string;
    disabled?: boolean;
};

export function Listbox({
    items,
    value,
    onValueChange,
    className,
    testId,
}: {
    items: ReadonlyArray<ListboxItem>;
    value?: string | null;
    onValueChange: (value: string) => void;
    className?: string;
    testId?: string;
}) {
    const listboxRef = useRef<HTMLDivElement | null>(null);
    const navigationItems = useMemo(
        () =>
            items.map((item) => ({
                value: item.value,
                disabled: item.disabled,
                searchText: item.label,
            })),
        [items],
    );
    const navigation = useListNavigation(navigationItems, {value});
    const highlighted = navigation.highlightedValue;

    useEffect(() => {
        if (highlighted === null) return;
        const node = listboxRef.current?.querySelector<HTMLElement>(
            `[data-oui-listbox-value="${cssAttr(highlighted)}"]`,
        );
        node?.scrollIntoView({block: 'nearest'});
    }, [highlighted]);

    const commit = useCallback(
        (next: string | null) => {
            if (next !== null) onValueChange(next);
        },
        [onValueChange],
    );

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
                    commit(highlighted);
                    break;
                default:
                    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
                        handleTypeahead(event.key);
                    }
            }
        },
        [commit, handleTypeahead, highlighted, navigation],
    );

    return (
        <div
            ref={listboxRef}
            className={cn('oui-listbox', className)}
            role='listbox'
            tabIndex={0}
            data-testid={testId}
            onKeyDown={handleKeyDown}
        >
            {items.map((item) => {
                const isSelected = value === item.value;
                const isHighlighted = highlighted === item.value;
                return (
                    <button
                        key={item.value}
                        type='button'
                        role='option'
                        aria-selected={isSelected}
                        className='oui-listbox-item'
                        data-oui-listbox-value={item.value}
                        data-selected={isSelected ? 'true' : undefined}
                        data-highlighted={isHighlighted ? 'true' : undefined}
                        data-testid={testId ? `${testId}-${item.value}` : undefined}
                        disabled={item.disabled}
                        tabIndex={-1}
                        onMouseEnter={() => {
                            if (!item.disabled) navigation.setHighlightedValue(item.value);
                        }}
                        onClick={() => {
                            if (!item.disabled) commit(item.value);
                        }}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}

function cssAttr(value: string): string {
    return value.replace(/"/g, '\\"');
}
