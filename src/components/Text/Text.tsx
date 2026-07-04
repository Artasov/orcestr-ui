import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type Ref } from 'react';

import { cn } from '../../utils/cn';
import {
    normalizeTone,
    splitSystemProps,
    type SystemProps,
    type ToneInput,
} from '../../theme/systemProps';
import { renderSlot } from '../../utils/slot';

export type TextProps = ComponentPropsWithoutRef<'span'> &
    SystemProps & {
        as?: ElementType;
        tone?: ToneInput;
        asChild?: boolean;
        href?: string;
        target?: string;
        rel?: string;
        trim?: string;
        testId?: string;
    };

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
    { as: Component = 'span', className, style, tone, asChild = false, testId, children, ...props },
    ref,
) {
    const { systemStyle, restProps } = splitSystemProps(props);
    const commonProps = {
        className: cn(
            'oui-text',
            tone && `oui-text-${tone === 'muted' ? 'muted' : normalizeTone(tone)}`,
            className,
        ),
        'data-testid': testId,
        style: { ...systemStyle, ...style },
        ...restProps,
    };

    if (asChild) {
        return renderSlot(children, {
            ...commonProps,
            ref: ref as Ref<HTMLElement>,
        });
    }

    return (
        <Component ref={ref} {...commonProps}>
            {children}
        </Component>
    );
});
