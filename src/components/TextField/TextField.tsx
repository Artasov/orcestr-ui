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
import { FloatingFieldDecoration } from '../Field/FloatingFieldDecoration.js';
import { cn } from '../../utils/cn.js';
import { composeRefs } from '../../utils/composeRefs.js';
import { splitSystemProps, type SystemProps, type UiSize } from '../../theme/systemProps.js';

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
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
        /** Renders an animated label inside the control that moves into the outline. */
        floatingLabel?: ReactNode;
        /** Applies an arbitrary CSS color to the floating label and its outline. */
        floatingColor?: string;
    };

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
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
        floatingLabel,
        floatingColor,
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
    const { systemStyle, restProps } = splitSystemProps(props);
    const [internalValue, setInternalValue] = useState<
        InputHTMLAttributes<HTMLInputElement>['value']
    >(defaultValue ?? '');
    const actualValue = value ?? internalValue;
    const [focused, setFocused] = useState(false);
    const filled = String(actualValue ?? '').length > 0;
    const canClear = clearable && !disabled && String(actualValue ?? '').length > 0;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (value === undefined) setInternalValue(event.target.value);
        onChange?.(event);
    };

    return (
        <span
            className={cn(
                'oui-text-field',
                floatingLabel !== undefined && 'oui-floating-field',
                fullWidth && 'oui-text-field-full',
                className,
            )}
            data-size={size}
            data-invalid={invalid ? 'true' : undefined}
            data-disabled={disabled ? 'true' : undefined}
            data-floating={floatingLabel !== undefined && (focused || filled) ? 'true' : undefined}
            data-focused={floatingLabel !== undefined && focused ? 'true' : undefined}
            data-has-left={floatingLabel !== undefined && leftSlot ? 'true' : undefined}
            style={{ ...systemStyle, ...style }}
        >
            {floatingLabel !== undefined ? (
                <FloatingFieldDecoration
                    label={floatingLabel}
                    htmlFor={inputId}
                    color={floatingColor}
                />
            ) : null}
            {leftSlot ? <span className="oui-text-field-slot">{leftSlot}</span> : null}
            <input
                ref={composeRefs(ref, localRef)}
                id={inputId}
                className="oui-text-field-input"
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
            {canClear ? (
                <button
                    type="button"
                    className="oui-text-field-clear"
                    aria-label={clearLabel ?? copy.common.clear}
                    onMouseDown={(event) => event.preventDefault()}
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
            {rightSlot ? <span className="oui-text-field-slot">{rightSlot}</span> : null}
        </span>
    );
});
