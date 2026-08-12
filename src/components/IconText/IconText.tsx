'use client';

import type { CSSProperties, ReactNode } from 'react';

import type { Tone } from '../../theme/systemProps.js';
import { cn } from '../../utils/cn.js';
import { Text, type TextProps } from '../Text/Text.js';

export type IconTextProps = {
    icon?: ReactNode;
    iconTone?: Tone | 'muted';
    iconColor?: CSSProperties['color'];
    iconClassName?: string;
    iconSpin?: boolean;
    textProps?: Omit<TextProps, 'children'>;
    children?: ReactNode;
};

export function IconText({
    icon,
    iconTone,
    iconColor,
    iconClassName,
    iconSpin,
    textProps,
    children,
}: IconTextProps) {
    const { className, ...restTextProps } = textProps ?? {};

    return (
        <Text className={cn('oui-icon-text', className)} {...restTextProps}>
            {icon ? (
                <span
                    className={cn('oui-icon-text-icon', iconClassName)}
                    data-spin={iconSpin ? 'true' : undefined}
                    data-tone={iconTone}
                    style={
                        iconColor
                            ? ({ '--oui-icon-text-icon-color': iconColor } as CSSProperties)
                            : undefined
                    }
                >
                    {icon}
                </span>
            ) : null}
            {children}
        </Text>
    );
}
