'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';

import { useOrcestrUiLocale, type OrcestrUiLocale } from '../../locale/LocaleProvider.js';
import { cn } from '../../utils/cn.js';
import { IconButton } from '../IconButton/IconButton.js';
import { TextField, type TextFieldProps } from '../TextField/TextField.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import { addStep, draftNumber, effectiveStep, scaleStep } from './StepperInputState.js';

export type StepperInputTooltipContext = {
    direction: 'decrease' | 'increase'; step: number; shiftStep: number; ctrlShiftStep: number; locale: OrcestrUiLocale;
};

type StepperInputCommonProps = Omit<TextFieldProps,
    'value' | 'defaultValue' | 'onChange' | 'onClear' | 'type' | 'min' | 'max' | 'step' | 'rightSlot' | 'leftSlot'> & {
    min?: number; max?: number; step?: number;
    /** Absolute step while Shift is held. Defaults to 10 × step. */
    shiftStep?: number;
    /** Absolute step while Ctrl+Shift (or Cmd+Shift) is held. Defaults to 100 × step. */
    ctrlShiftStep?: number;
    unit?: string; ariaLabel?: string; decreaseLabel?: string; increaseLabel?: string;
    showStepTooltips?: boolean;
    stepTooltip?: ReactNode | ((context: StepperInputTooltipContext) => ReactNode);
};

export type StepperInputProps = StepperInputCommonProps & (
    | { allowEmpty?: false; value: number; onChange: (value: number) => void }
    | { allowEmpty: true; value: number | null; onChange: (value: number | null) => void }
);

export function StepperInput(props: StepperInputProps) {
    const {
        value, min, max, step = 1, shiftStep = scaleStep(step, 1), ctrlShiftStep = scaleStep(step, 2),
        disabled, readOnly, unit, decreaseLabel, increaseLabel, testId, ariaLabel,
        showStepTooltips = true, stepTooltip, allowEmpty = false, clearable = allowEmpty,
        fullWidth = false, size = 1, className, style, onFocus, onBlur, onKeyDown,
        onChange: _onChange, ...inputProps
    } = props;
    const { copy, locale } = useOrcestrUiLocale();
    const formatter = useMemo(() => new Intl.NumberFormat(locale, { useGrouping: false, maximumFractionDigits: 20 }), [locale]);
    const format = (next: number | null) => next === null ? '' : formatter.format(next);
    const [draft, setDraft] = useState(() => format(value));
    const editingRef = useRef(false);

    useEffect(() => {
        if (!editingRef.current) setDraft(value === null ? '' : formatter.format(value));
    }, [formatter, value]);

    const commit = (next: number | null) => {
        if (disabled || readOnly) return;
        if (next === null) {
            if (props.allowEmpty) {
                setDraft('');
                if (value !== null) props.onChange(null);
            } else setDraft(format(value));
            return;
        }
        if (!Number.isFinite(next)) {setDraft(format(value)); return;}
        const clamped = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, next));
        setDraft(format(clamped));
        if (clamped !== value) props.onChange(clamped);
    };
    const commitDraft = () => {
        if (draft.trim() === '') {commit(null); return;}
        const parsed = draftNumber(draft);
        if (parsed === null) setDraft(format(value));
        else commit(parsed);
    };
    const current = editingRef.current && allowEmpty && draft.trim() === '' ? null
        : (editingRef.current ? draftNumber(draft) : null) ?? value;
    const move = (direction: -1 | 1, modifiers: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }) => {
        const increment = effectiveStep(modifiers, step, shiftStep, ctrlShiftStep);
        if (!Number.isFinite(increment) || increment <= 0) return;
        const start = current ?? 0;
        commit(addStep(start, direction * increment));
    };
    const blocked = disabled || readOnly;
    const button = (direction: 'decrease' | 'increase') => {
        const decrease = direction === 'decrease';
        const label = (decrease ? decreaseLabel : increaseLabel) ?? (decrease ? copy.common.decrease : copy.common.increase);
        const control = <IconButton size={size} type="button" v="surface"
            icon={decrease ? <LuMinus size={14} /> : <LuPlus size={14} />} round={false} pressAnimation="none"
            className={`oui-stepper-button oui-stepper-${direction}`} aria-label={label}
            testId={testId ? `${testId}-${direction}` : undefined}
            disabled={blocked || (current !== null && (decrease ? min !== undefined && current <= min : max !== undefined && current >= max))}
            onMouseDown={event => event.preventDefault()}
            onClick={event => move(decrease ? -1 : 1, event)} />;
        if (!showStepTooltips) return control;
        const context = { direction, step, shiftStep, ctrlShiftStep, locale };
        const content = typeof stepTooltip === 'function' ? stepTooltip(context) : stepTooltip ??
            `${label} ${copy.common.stepBy(formatter.format(step))}. ${copy.common.stepModifiers(formatter.format(shiftStep), formatter.format(ctrlShiftStep))}`;
        return <Tooltip content={content} testId={testId ? `${testId}-${direction}` : undefined}>{control}</Tooltip>;
    };

    return <span className={cn('oui-stepper', className)} data-testid={testId} data-size={size}
        data-full-width={fullWidth || undefined} style={style}>
        {button('decrease')}
        <TextField {...inputProps} value={draft} disabled={disabled} readOnly={readOnly}
            className="oui-stepper-field" size={size} fullWidth={false}
            aria-label={ariaLabel ?? inputProps['aria-label']} inputMode="decimal" role="spinbutton"
            aria-valuenow={value ?? undefined} aria-valuemin={min} aria-valuemax={max}
            testId={testId ? `${testId}-input` : undefined}
            clearable={allowEmpty && clearable && !readOnly} onClear={() => commit(null)}
            rightSlot={unit ? <span>{unit}</span> : null}
            onChange={event => {
                if (blocked) return;
                const next = event.target.value;
                if (/^[+-]?(?:\d+)?(?:[.,]\d*)?$/.test(next.trim())) setDraft(next);
            }}
            onFocus={event => {editingRef.current = true; onFocus?.(event);}}
            onBlur={event => {editingRef.current = false; commitDraft(); onBlur?.(event);}}
            onKeyDown={event => {
                onKeyDown?.(event);
                if (event.defaultPrevented || blocked) return;
                if (event.key === 'Enter') {event.preventDefault(); commitDraft();}
                else if (event.key === 'Escape') {event.preventDefault(); setDraft(format(value));}
                else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    event.preventDefault(); move(event.key === 'ArrowUp' ? 1 : -1, event);
                }
            }} />
        {button('increase')}
    </span>;
}
