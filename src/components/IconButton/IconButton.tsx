'use client';

import {forwardRef, useContext, type ButtonHTMLAttributes, type ReactNode} from 'react';

import {cn} from '../../utils/cn';
import {
    splitSystemProps,
    type SystemProps,
    type Tone,
    type UiSize,
} from '../../theme/systemProps';
import {OrcestrThemeContext} from '../../theme/useTheme';
import type {ButtonPressAnimation} from '../../theme/themeTypes';
import type {ButtonVariant} from '../Button/Button';
import {Spinner} from '../Spinner/Spinner';

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> &
    SystemProps & {
        size?: UiSize;
        v?: ButtonVariant;
        tone?: Tone;
        icon: ReactNode;
        loading?: boolean;
        round?: boolean;
        pressAnimation?: ButtonPressAnimation;
        testId?: string;
    };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    function IconButton(
        {
            className,
            style,
            size = 3,
            v = 'soft',
            tone = 'neutral',
            loading = false,
            round = true,
            pressAnimation,
            testId,
            icon,
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
                className={cn('oui-icon-button', className)}
                data-size={size}
                data-variant={v}
                data-tone={tone}
                data-round={round ? 'true' : undefined}
                data-press-animation={actualPressAnimation}
                data-loading={loading ? 'true' : undefined}
                data-testid={testId}
                aria-busy={loading ? 'true' : undefined}
                disabled={disabled || loading}
                style={{...systemStyle, ...style}}
                {...restProps}
            >
                {loading ? <Spinner size={1} /> : icon}
            </button>
        );
    },
);
