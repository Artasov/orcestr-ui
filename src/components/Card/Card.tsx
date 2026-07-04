import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ElementType,
    type Ref,
    type ReactNode,
} from 'react';

import { splitSystemProps, type SystemProps, type UiSize } from '../../theme/systemProps';
import { cn } from '../../utils/cn';
import { renderSlot } from '../../utils/slot';

export type CardVariant = 'ghost' | 'surface' | 'soft' | 'classic';

export type CardProps<C extends ElementType = 'div'> = SystemProps & {
    as?: C;
    children?: ReactNode;
    className?: string;
    style?: ComponentPropsWithoutRef<'div'>['style'];
    size?: UiSize;
    v?: CardVariant;
    interactive?: boolean;
    asChild?: boolean;
    testId?: string;
} & Omit<
        ComponentPropsWithoutRef<C>,
        keyof SystemProps | 'as' | 'children' | 'className' | 'style' | 'size'
    >;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
    {
        as,
        className,
        style,
        size = 2,
        v = 'ghost',
        interactive = false,
        asChild = false,
        testId,
        children,
        ...props
    },
    ref,
) {
    const Component = as ?? 'div';
    const { systemStyle, restProps } = splitSystemProps(props);
    const commonProps = {
        className: cn('oui-card', className),
        'data-size': size,
        'data-variant': v,
        'data-interactive': interactive ? 'true' : undefined,
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
