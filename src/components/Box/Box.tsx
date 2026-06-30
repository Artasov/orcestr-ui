import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ElementType,
} from 'react';

import {cn} from '../../utils/cn';
import {splitSystemProps, type SystemProps} from '../../theme/systemProps';

export type BoxProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        as?: ElementType;
        testId?: string;
    };

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
    {as: Component = 'div', className, style, testId, ...props},
    ref,
) {
    const {systemStyle, restProps} = splitSystemProps(props);
    return (
        <Component
            ref={ref}
            className={cn('oui-box', className)}
            data-testid={testId}
            style={{...systemStyle, ...style}}
            {...restProps}
        />
    );
});
