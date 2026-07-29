import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '../../utils/cn.js';
import {
    splitSystemProps,
    type SystemProps,
    type Tone,
    type ToneInput,
    type UiSize,
    normalizeTone,
} from '../../theme/systemProps.js';

export type BadgeProps = ComponentPropsWithoutRef<'span'> &
    SystemProps & {
        tone?: ToneInput;
        size?: UiSize;
        v?: 'soft' | 'solid' | 'outline' | 'surface';
        icon?: ReactNode;
        testId?: string;
    };

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
    { className, style, tone = 'neutral', size = 2, v = 'soft', icon, testId, children, ...props },
    ref,
) {
    const { systemStyle, restProps } = splitSystemProps(props);
    return (
        <span
            ref={ref}
            className={cn('oui-badge', className)}
            data-tone={normalizeTone(tone)}
            data-size={size}
            data-variant={v}
            data-testid={testId}
            style={{ ...systemStyle, ...style }}
            {...restProps}
        >
            {icon ? <span className="oui-badge-icon">{icon}</span> : null}
            {children}
        </span>
    );
});
