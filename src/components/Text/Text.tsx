import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ElementType,
} from 'react';

import {cn} from '../../utils/cn';
import {splitSystemProps, type SystemProps, type Tone} from '../../theme/systemProps';

export type TextProps = ComponentPropsWithoutRef<'span'> &
    SystemProps & {
        as?: ElementType;
        tone?: Tone | 'muted';
        testId?: string;
    };

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
    {as: Component = 'span', className, style, tone, testId, ...props},
    ref,
) {
    const {systemStyle, restProps} = splitSystemProps(props);
    return (
        <Component
            ref={ref}
            className={cn('oui-text', tone && `oui-text-${tone}`, className)}
            data-testid={testId}
            style={{...systemStyle, ...style}}
            {...restProps}
        />
    );
});
