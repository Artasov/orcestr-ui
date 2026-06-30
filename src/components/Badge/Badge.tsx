import {forwardRef, type ComponentPropsWithoutRef} from 'react';

import {cn} from '../../utils/cn';
import {
    splitSystemProps,
    type SystemProps,
    type Tone,
    type UiSize,
} from '../../theme/systemProps';

export type BadgeProps = ComponentPropsWithoutRef<'span'> &
    SystemProps & {
        tone?: Tone;
        size?: UiSize;
        v?: 'soft' | 'solid' | 'outline';
        testId?: string;
    };

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
    {
        className,
        style,
        tone = 'neutral',
        size = 2,
        v = 'soft',
        testId,
        ...props
    },
    ref,
) {
    const {systemStyle, restProps} = splitSystemProps(props);
    return (
        <span
            ref={ref}
            className={cn('oui-badge', className)}
            data-tone={tone}
            data-size={size}
            data-variant={v}
            data-testid={testId}
            style={{...systemStyle, ...style}}
            {...restProps}
        />
    );
});
