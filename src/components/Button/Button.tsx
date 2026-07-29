'use client';

import { forwardRef, useContext, type ButtonHTMLAttributes, type Ref, type ReactNode } from 'react';

import { cn } from '../../utils/cn.js';
import {
    splitSystemProps,
    type SystemProps,
    type Tone,
    type ToneInput,
    type UiSize,
    normalizeTone,
} from '../../theme/systemProps.js';
import { OrcestrThemeContext } from '../../theme/useTheme.js';
import type { ButtonPressAnimation } from '../../theme/themeTypes.js';
import { renderSlot } from '../../utils/slot.js';
import { Spinner } from '../Spinner/Spinner.js';

export type ButtonVariant = 'solid' | 'soft' | 'surface' | 'pad' | 'ghost' | 'outline';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    SystemProps & {
        size?: UiSize;
        v?: ButtonVariant;
        tone?: ToneInput;
        loading?: boolean;
        fullWidth?: boolean;
        leftIcon?: ReactNode;
        rightIcon?: ReactNode;
        pressAnimation?: ButtonPressAnimation;
        asChild?: boolean;
        children?: ReactNode;
        testId?: string;
    };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        className,
        style,
        size = 3,
        v = 'solid',
        tone = 'neutral',
        loading = false,
        fullWidth = false,
        leftIcon,
        rightIcon,
        pressAnimation,
        asChild = false,
        testId,
        children,
        disabled,
        type = 'button',
        ...props
    },
    ref,
) {
    const themeContext = useContext(OrcestrThemeContext);
    const actualPressAnimation =
        pressAnimation ?? themeContext?.theme.motion.pressAnimation ?? 'soft';
    const { systemStyle, restProps } = splitSystemProps(props);
    const commonProps = {
        className: cn('oui-button', fullWidth && 'oui-button-full', className),
        'data-size': size,
        'data-variant': v,
        'data-tone': normalizeTone(tone),
        'data-press-animation': actualPressAnimation,
        'data-loading': loading ? 'true' : undefined,
        'data-testid': testId,
        'aria-busy': loading || undefined,
        style: { ...systemStyle, ...style },
        ...restProps,
    };

    if (asChild) {
        return renderSlot(children, {
            ...commonProps,
            ref: ref as Ref<HTMLElement>,
            'aria-disabled': disabled || loading ? true : undefined,
        });
    }

    return (
        <button ref={ref} type={type} {...commonProps} disabled={disabled || loading}>
            {loading ? <Spinner size={1} /> : leftIcon}
            <span className="oui-button-label">{children}</span>
            {rightIcon}
        </button>
    );
});
