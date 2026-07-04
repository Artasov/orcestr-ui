'use client';

import { forwardRef, useContext, type AnchorHTMLAttributes, type ReactNode } from 'react';

import {
    splitSystemProps,
    type SystemProps,
    type Tone,
    type ToneInput,
    type UiSize,
    normalizeTone,
} from '../../theme/systemProps';
import type { ButtonPressAnimation } from '../../theme/themeTypes';
import { OrcestrThemeContext } from '../../theme/useTheme';
import { cn } from '../../utils/cn';
import type { ButtonVariant } from '../Button/Button';

export type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> &
    SystemProps & {
        size?: UiSize;
        v?: ButtonVariant;
        tone?: ToneInput;
        fullWidth?: boolean;
        leftIcon?: ReactNode;
        rightIcon?: ReactNode;
        pressAnimation?: ButtonPressAnimation;
        testId?: string;
    };

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(
    {
        className,
        style,
        size = 3,
        v = 'solid',
        tone = 'neutral',
        fullWidth = false,
        leftIcon,
        rightIcon,
        pressAnimation,
        testId,
        children,
        ...props
    },
    ref,
) {
    const themeContext = useContext(OrcestrThemeContext);
    const actualPressAnimation =
        pressAnimation ?? themeContext?.theme.motion.pressAnimation ?? 'soft';
    const { systemStyle, restProps } = splitSystemProps(props);

    return (
        <a
            ref={ref}
            className={cn('oui-button', fullWidth && 'oui-button-full', className)}
            data-size={size}
            data-variant={v}
            data-tone={normalizeTone(tone)}
            data-press-animation={actualPressAnimation}
            data-testid={testId}
            style={{ ...systemStyle, ...style }}
            {...restProps}
        >
            {leftIcon}
            <span className="oui-button-label">{children}</span>
            {rightIcon}
        </a>
    );
});
