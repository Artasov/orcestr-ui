'use client';

import type {CSSProperties, ReactNode} from 'react';

import type {Tone} from '../../theme/systemProps';
import {cn} from '../../utils/cn';
import {Text, type TextProps} from '../Text/Text';

export type IconTextProps = TextProps & {
    icon?: ReactNode;
    iconTone?: Tone | 'muted';
    iconColor?: CSSProperties['color'];
    iconClassName?: string;
    iconSpin?: boolean;
};

export function IconText({
    icon,
    iconTone,
    iconColor,
    iconClassName,
    iconSpin,
    className,
    children,
    ...props
}: IconTextProps) {
    return (
        <Text className={cn('oui-icon-text', className)} {...props}>
            {icon ? (
                <span
                    className={cn('oui-icon-text-icon', iconClassName)}
                    data-spin={iconSpin ? 'true' : undefined}
                    data-tone={iconTone}
                    style={iconColor ? {'--oui-icon-text-icon-color': iconColor} as CSSProperties : undefined}
                >
                    {icon}
                </span>
            ) : null}
            {children}
        </Text>
    );
}
