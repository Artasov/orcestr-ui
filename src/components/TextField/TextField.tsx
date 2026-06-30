'use client';

import {
    forwardRef,
    useId,
    useRef,
    useState,
    type ChangeEvent,
    type InputHTMLAttributes,
    type ReactNode,
} from 'react';
import {LuX} from 'react-icons/lu';

import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {cn} from '../../utils/cn';
import {composeRefs} from '../../utils/composeRefs';
import {
    splitSystemProps,
    type SystemProps,
    type UiSize,
} from '../../theme/systemProps';

export type TextFieldProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size'
> &
    SystemProps & {
        size?: UiSize;
        invalid?: boolean;
        fullWidth?: boolean;
        leftSlot?: ReactNode;
        rightSlot?: ReactNode;
        clearable?: boolean;
        onClear?: () => void;
        clearLabel?: string;
        testId?: string;
    };

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    function TextField(
        {
            className,
            style,
            size = 3,
            invalid = false,
            fullWidth = true,
            leftSlot,
            rightSlot,
            clearable = false,
            onClear,
            clearLabel,
            testId,
            value,
            defaultValue,
            onChange,
            disabled,
            id,
            ...props
        },
        ref,
    ) {
        const {copy} = useOrcestrUiLocale();
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const localRef = useRef<HTMLInputElement | null>(null);
        const {systemStyle, restProps} = splitSystemProps(props);
        const [internalValue, setInternalValue] =
            useState<InputHTMLAttributes<HTMLInputElement>['value']>(
                defaultValue ?? '',
            );
        const actualValue = value ?? internalValue;
        const canClear =
            clearable && !disabled && String(actualValue ?? '').length > 0;

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (value === undefined) setInternalValue(event.target.value);
            onChange?.(event);
        };

        return (
            <span
                className={cn(
                    'oui-text-field',
                    fullWidth && 'oui-text-field-full',
                    className,
                )}
                data-size={size}
                data-invalid={invalid ? 'true' : undefined}
                data-disabled={disabled ? 'true' : undefined}
                style={{...systemStyle, ...style}}
            >
                {leftSlot ? (
                    <span className='oui-text-field-slot'>{leftSlot}</span>
                ) : null}
                <input
                    ref={composeRefs(ref, localRef)}
                    id={inputId}
                    className='oui-text-field-input'
                    data-testid={testId}
                    value={actualValue}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-invalid={invalid || undefined}
                    {...restProps}
                />
                {canClear ? (
                    <button
                        type='button'
                        className='oui-text-field-clear'
                        aria-label={clearLabel ?? copy.common.clear}
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            if (value === undefined) setInternalValue('');
                            localRef.current?.focus();
                            onClear?.();
                        }}
                    >
                        <LuX size={14} />
                    </button>
                ) : null}
                {rightSlot ? (
                    <span className='oui-text-field-slot'>{rightSlot}</span>
                ) : null}
            </span>
        );
    },
);
