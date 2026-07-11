'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';

import { useOrcestrUiLocale } from '../../locale/LocaleProvider';
import { IconButton } from '../IconButton/IconButton';
import { TextField } from '../TextField/TextField';

export function StepperInput({
    value,
    onChange,
    min,
    max,
    step = 1,
    disabled,
    unit,
    decreaseLabel,
    increaseLabel,
    testId,
}: {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    unit?: string;
    decreaseLabel?: string;
    increaseLabel?: string;
    testId?: string;
}) {
    const { copy, locale } = useOrcestrUiLocale();
    const canDecrease = min === undefined || value > min;
    const canIncrease = max === undefined || value < max;
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                useGrouping: false,
                maximumFractionDigits: 20,
            }),
        [locale],
    );
    const decimalSeparator = useMemo(
        () => formatter.formatToParts(1.1).find((part) => part.type === 'decimal')?.value ?? '.',
        [formatter],
    );
    const [draft, setDraft] = useState(() => formatter.format(value));
    const editingRef = useRef(false);

    useEffect(() => {
        if (!editingRef.current) setDraft(formatter.format(value));
    }, [formatter, value]);

    const commit = (next: number) => {
        const clamped = roundForStep(Math.max(min ?? next, Math.min(max ?? next, next)), step);
        setDraft(formatter.format(clamped));
        if (clamped !== value) onChange(clamped);
    };
    const commitDraft = () => {
        const parsed = parseDraft(draft, decimalSeparator);
        if (parsed === null) {
            setDraft(formatter.format(value));
            return;
        }
        commit(parsed);
    };

    return (
        <span className="oui-stepper" data-testid={testId}>
            <IconButton
                size={1}
                v="surface"
                icon={<LuMinus size={14} />}
                round={false}
                pressAnimation="none"
                className="oui-stepper-button oui-stepper-decrease"
                aria-label={decreaseLabel ?? copy.common.decrease}
                testId={testId ? `${testId}-decrease` : undefined}
                disabled={disabled || !canDecrease}
                onClick={() => commit(value - step)}
            />
            <TextField
                value={draft}
                disabled={disabled}
                className="oui-stepper-field"
                size={1}
                testId={testId ? `${testId}-input` : undefined}
                onChange={(event) => {
                    const next = event.target.value;
                    if (isValidDraft(next)) setDraft(next);
                }}
                onFocus={() => {
                    editingRef.current = true;
                }}
                onBlur={() => {
                    editingRef.current = false;
                    commitDraft();
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        commitDraft();
                    } else if (event.key === 'Escape') {
                        event.preventDefault();
                        setDraft(formatter.format(value));
                    } else if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        commit(value + step);
                    } else if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        commit(value - step);
                    }
                }}
                inputMode="decimal"
                role="spinbutton"
                aria-valuenow={value}
                aria-valuemin={min}
                aria-valuemax={max}
                rightSlot={unit ? <span>{unit}</span> : null}
                w="86px"
            />
            <IconButton
                size={1}
                v="surface"
                icon={<LuPlus size={14} />}
                round={false}
                pressAnimation="none"
                className="oui-stepper-button oui-stepper-increase"
                aria-label={increaseLabel ?? copy.common.increase}
                testId={testId ? `${testId}-increase` : undefined}
                disabled={disabled || !canIncrease}
                onClick={() => commit(value + step)}
            />
        </span>
    );
}

function isValidDraft(value: string) {
    return /^[+-]?(?:\d+)?(?:[.,]\d*)?$/.test(value.trim());
}

function parseDraft(value: string, decimalSeparator: string) {
    const normalized = value.trim().replace(decimalSeparator, '.').replace(',', '.');
    if (!normalized || normalized === '+' || normalized === '-' || normalized === '.') return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}

function roundForStep(value: number, step: number) {
    const precision = Math.min(12, Math.max(decimalPlaces(value), decimalPlaces(step)));
    return Number(value.toFixed(precision));
}

function decimalPlaces(value: number) {
    const normalized = value.toString().toLowerCase();
    if (normalized.includes('e-')) return Number(normalized.split('e-')[1] ?? 0);
    return normalized.split('.')[1]?.length ?? 0;
}
