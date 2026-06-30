'use client';

import {useMemo, useState, type ReactNode} from 'react';
import {LuChevronsUpDown, LuX} from 'react-icons/lu';

import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {Button} from '../Button/Button';
import {Listbox, type ListboxItem} from '../Listbox/Listbox';
import {Popover} from '../Popover/Popover';
import {TextField} from '../TextField/TextField';

export function Combobox({
    items,
    value,
    onValueChange,
    placeholder,
    selectedFallbackLabel,
    searchPlaceholder,
    emptyText,
    clearLabel,
    disabled = false,
    clearable = true,
    showChevron = true,
    testId,
}: {
    items: ReadonlyArray<ListboxItem>;
    value: string | null;
    onValueChange: (value: string | null) => void;
    placeholder?: string;
    selectedFallbackLabel?: ReactNode;
    searchPlaceholder?: string;
    emptyText?: string;
    clearLabel?: string;
    disabled?: boolean;
    clearable?: boolean;
    showChevron?: boolean;
    testId?: string;
}) {
    const {copy} = useOrcestrUiLocale();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const selected = items.find((item) => item.value === value);
    const filtered = useMemo(
        () =>
            items.filter((item) =>
                item.label.toLowerCase().includes(query.toLowerCase()),
            ),
        [items, query],
    );

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) setQuery('');
            }}
            trigger={
                <Button
                    v='surface'
                    fullWidth
                    disabled={disabled}
                    pressAnimation='none'
                    className='oui-combobox-trigger'
                    data-state={open ? 'open' : 'closed'}
                    testId={testId}
                    rightIcon={
                        <span className='oui-combobox-trigger-actions'>
                            {clearable && selected ? (
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
                                        onValueChange(null);
                                    }}
                                >
                                    <LuX size={14} />
                                </span>
                            ) : null}
                            {showChevron ? <LuChevronsUpDown size={15} /> : null}
                        </span>
                    }
                >
                    <span className={selected || selectedFallbackLabel ? 'oui-combobox-trigger-label' : 'oui-combobox-placeholder'}>
                        {selected?.label ?? selectedFallbackLabel ?? placeholder ?? copy.common.selectValue}
                    </span>
                </Button>
            }
            className='oui-combobox-content'
            testId={testId ? `${testId}-popover` : undefined}
            align='start'
            sideOffset={4}
            matchTriggerWidth
            disabled={disabled}
        >
            <div className='oui-combobox-search-wrap'>
                <TextField
                    autoFocus
                    size={1}
                    value={query}
                    testId={testId ? `${testId}-search` : undefined}
                    placeholder={searchPlaceholder ?? copy.common.search}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>
            {filtered.length === 0 ? (
                <div className='oui-combobox-empty'>{emptyText ?? copy.common.noOptions}</div>
            ) : (
                <Listbox
                    className='oui-combobox-options'
                    items={filtered}
                    value={value}
                    testId={testId ? `${testId}-listbox` : undefined}
                    onValueChange={(next) => {
                        onValueChange(next);
                        setOpen(false);
                        setQuery('');
                    }}
                />
            )}
        </Popover>
    );
}
