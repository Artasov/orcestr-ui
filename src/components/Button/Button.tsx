'use client';

import {
    forwardRef,
    useContext,
    type ButtonHTMLAttributes,
    type ReactNode,
} from 'react';

import {cn} from '../../utils/cn';
import {
    splitSystemProps,
    type SystemProps,
    type Tone,
    type UiSize,
} from '../../theme/systemProps';
import {OrcestrThemeContext} from '../../theme/useTheme';
import type {ButtonPressAnimation} from '../../theme/themeTypes';
import {Spinner} from '../Spinner/Spinner';

export type ButtonVariant = 'solid' | 'soft' | 'surface' | 'pad' | 'ghost' | 'outline';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    SystemProps & {
        size?: UiSize;
        v?: ButtonVariant;
        tone?: Tone;
        loading?: boolean;
        fullWidth?: boolean;
        leftIcon?: ReactNode;
        rightIcon?: ReactNode;
        pressAnimation?: ButtonPressAnimation;
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
    const {systemStyle, restProps} = splitSystemProps(props);
    return (
        <button
            ref={ref}
            type={type}
            className={cn('oui-button', fullWidth && 'oui-button-full', className)}
            data-size={size}
            data-variant={v}
            data-tone={tone}
            data-press-animation={actualPressAnimation}
            data-loading={loading ? 'true' : undefined}
            data-testid={testId}
            aria-busy={loading ? 'true' : undefined}
            disabled={disabled || loading}
            style={{...systemStyle, ...style}}
            {...restProps}
        >
            {loading ? <Spinner size={1} /> : leftIcon}
            <span className='oui-button-label'>{children}</span>
            {rightIcon}
        </button>
    );
});
