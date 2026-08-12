'use client';

import {
    forwardRef,
    useId,
    useRef,
    useState,
    type ChangeEvent,
    type FocusEvent,
    type InputHTMLAttributes,
    type ReactNode,
} from 'react';
import { LuX } from 'react-icons/lu';

import { useOrcestrUiLocale } from '../../locale/LocaleProvider.js';
import { splitSystemProps, type SystemProps, type UiSize } from '../../theme/systemProps.js';
import { cn } from '../../utils/cn.js';
import { composeRefs } from '../../utils/composeRefs.js';

export type FloatingTextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
    SystemProps & {
        label: ReactNode;
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

export const FloatingTextField = forwardRef<HTMLInputElement, FloatingTextFieldProps>(
    function FloatingTextField(
        {
            label,
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
            onFocus,
            onBlur,
            disabled,
            id,
            children: _children,
            dangerouslySetInnerHTML: _dangerouslySetInnerHTML,
            ...props
        },
        ref,
    ) {
        const { copy } = useOrcestrUiLocale();
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const localRef = useRef<HTMLInputElement | null>(null);
        const [focused, setFocused] = useState(false);
        const [internalValue, setInternalValue] = useState<
            InputHTMLAttributes<HTMLInputElement>['value']
        >(defaultValue ?? '');
        const actualValue = value ?? internalValue;
        const filled = String(actualValue ?? '').length > 0;
        const floating = focused || filled;
        const canClear = clearable && !disabled && filled;
        const { systemStyle, restProps } = splitSystemProps(props);

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (value === undefined) setInternalValue(event.target.value);
            onChange?.(event);
        };

        return (
            <span
                className={cn(
                    'oui-floating-text-field',
                    fullWidth && 'oui-floating-text-field-full',
                    className,
                )}
                data-size={size}
                data-floating={floating ? 'true' : undefined}
                data-focused={focused ? 'true' : undefined}
                data-invalid={invalid ? 'true' : undefined}
                data-disabled={disabled ? 'true' : undefined}
                data-has-left={leftSlot ? 'true' : undefined}
                style={{ ...systemStyle, ...style }}
            >
                <fieldset className="oui-floating-text-field-outline" aria-hidden="true">
                    <legend>
                        <span>{label}</span>
                    </legend>
                </fieldset>
                {leftSlot ? (
                    <span className="oui-floating-text-field-slot">{leftSlot}</span>
                ) : null}
                <input
                    ref={composeRefs(ref, localRef)}
                    id={inputId}
                    className="oui-floating-text-field-input"
                    data-testid={testId}
                    value={actualValue}
                    onChange={handleChange}
                    onFocus={(event: FocusEvent<HTMLInputElement>) => {
                        setFocused(true);
                        onFocus?.(event);
                    }}
                    onBlur={(event: FocusEvent<HTMLInputElement>) => {
                        setFocused(false);
                        onBlur?.(event);
                    }}
                    disabled={disabled}
                    aria-invalid={invalid || undefined}
                    {...restProps}
                />
                <label className="oui-floating-text-field-label" htmlFor={inputId}>
                    {label}
                </label>
                {canClear ? (
                    <button
                        type="button"
                        className="oui-floating-text-field-clear"
                        aria-label={clearLabel ?? copy.common.clear}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                            if (value === undefined) setInternalValue('');
                            localRef.current?.focus();
                            onClear?.();
                        }}
                    >
                        <LuX size={14} />
                    </button>
                ) : null}
                {rightSlot ? (
                    <span className="oui-floating-text-field-slot">{rightSlot}</span>
                ) : null}
            </span>
        );
    },
);
