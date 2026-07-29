import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type Ref } from 'react';

import { cn } from '../../utils/cn.js';
import { splitSystemProps, type SystemProps } from '../../theme/systemProps.js';
import { renderSlot } from '../../utils/slot.js';

export type FlexProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        as?: ElementType;
        asChild?: boolean;
        testId?: string;
    };

export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
    { as: Component = 'div', asChild = false, className, style, testId, children, ...props },
    ref,
) {
    const { systemStyle, restProps } = splitSystemProps(props);
    const commonProps = {
        className: cn('oui-flex', className),
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
