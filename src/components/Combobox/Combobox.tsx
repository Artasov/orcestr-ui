'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import { LuChevronsUpDown, LuX } from 'react-icons/lu';

import { useOrcestrUiLocale } from '../../locale/LocaleProvider.js';
import { Button } from '../Button/Button.js';
import { Listbox, type ListboxItem } from '../Listbox/Listbox.js';
import { Popover } from '../Popover/Popover.js';
import { TextField } from '../TextField/TextField.js';

export function Combobox({
    items,
    value,
    onValueChange,
    placeholder,
    selectedFallbackLabel,
    searchPlaceholder,
    emptyText,
    clearLabel,
    ariaLabel,
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
    ariaLabel?: string;
    disabled?: boolean;
    clearable?: boolean;
    showChevron?: boolean;
    testId?: string;
}) {
    const { copy } = useOrcestrUiLocale();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const listboxId = useId();
    const selected = items.find((item) => item.value === value);
    const filtered = useMemo(
        () => items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
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
                    asChild
                    v="surface"
                    fullWidth
                    disabled={disabled}
                    pressAnimation="none"
                    className="oui-combobox-trigger"
                    data-state={open ? 'open' : 'closed'}
                    testId={testId}
                >
                    <div
                        role="combobox"
                        tabIndex={disabled ? -1 : 0}
                        aria-haspopup="listbox"
                        aria-label={
                            ariaLabel ??
                            reactNodeText(
                                selected?.label ??
                                    selectedFallbackLabel ??
                                    placeholder ??
                                    copy.common.selectValue,
                            )
                        }
                        aria-expanded={open}
                        aria-controls={listboxId}
                    >
                        <span className="oui-button-label">
                            <span
                                className={
                                    selected || selectedFallbackLabel
                                        ? 'oui-combobox-trigger-label'
                                        : 'oui-combobox-placeholder'
                                }
                            >
                                {selected?.label ??
                                    selectedFallbackLabel ??
                                    placeholder ??
                                    copy.common.selectValue}
                            </span>
                        </span>
                        <span className="oui-combobox-trigger-actions">
                            {clearable && selected ? (
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
                                        onValueChange(null);
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
            className="oui-combobox-content"
            testId={testId ? `${testId}-popover` : undefined}
            align="start"
            sideOffset={4}
            matchTriggerWidth
            disabled={disabled}
        >
            <div className="oui-combobox-search-wrap">
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
                <div className="oui-combobox-empty">{emptyText ?? copy.common.noOptions}</div>
            ) : (
                <Listbox
                    id={listboxId}
                    className="oui-combobox-options"
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

function reactNodeText(value: ReactNode): string {
    if (value === null || value === undefined || value === false) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (Array.isArray(value)) return value.map(reactNodeText).join('');
    if (typeof value === 'object' && 'props' in value) {
        return reactNodeText((value.props as { children?: ReactNode }).children);
    }
    return '';
}
