'use client';

import {useMemo} from 'react';
import {LuMinus, LuPlus} from 'react-icons/lu';

import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {IconButton} from '../IconButton/IconButton';
import {TextField} from '../TextField/TextField';

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
    const {copy} = useOrcestrUiLocale();
    const canDecrease = min === undefined || value > min;
    const canIncrease = max === undefined || value < max;
    const displayValue = useMemo(() => String(value), [value]);
    const commit = (next: number) => {
        const clamped = Math.max(min ?? next, Math.min(max ?? next, next));
        onChange(clamped);
    };

    return (
        <span className='oui-stepper' data-testid={testId}>
            <IconButton
                size={1}
                v='surface'
                icon={<LuMinus size={14} />}
                round={false}
                pressAnimation='none'
                className='oui-stepper-button oui-stepper-decrease'
                aria-label={decreaseLabel ?? copy.common.decrease}
                testId={testId ? `${testId}-decrease` : undefined}
                disabled={disabled || !canDecrease}
                onClick={() => commit(value - step)}
            />
            <TextField
                value={displayValue}
                disabled={disabled}
                className='oui-stepper-field'
                size={1}
                testId={testId ? `${testId}-input` : undefined}
                onChange={(event) => {
                    const next = Number(event.target.value);
                    if (Number.isFinite(next)) commit(next);
                }}
                rightSlot={unit ? <span>{unit}</span> : null}
                w='86px'
            />
            <IconButton
                size={1}
                v='surface'
                icon={<LuPlus size={14} />}
                round={false}
                pressAnimation='none'
                className='oui-stepper-button oui-stepper-increase'
                aria-label={increaseLabel ?? copy.common.increase}
                testId={testId ? `${testId}-increase` : undefined}
                disabled={disabled || !canIncrease}
                onClick={() => commit(value + step)}
            />
        </span>
    );
}
