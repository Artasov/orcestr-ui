import {forwardRef, type ComponentPropsWithoutRef} from 'react';

import {cn} from '../../utils/cn';
import {splitSystemProps, type SystemProps} from '../../theme/systemProps';

export type SkeletonProps = ComponentPropsWithoutRef<'span'> &
    SystemProps & {
        testId?: string;
    };

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
    {className, style, testId, ...props},
    ref,
) {
    const {systemStyle, restProps} = splitSystemProps(props);
    return (
        <span
            ref={ref}
            className={cn('oui-skeleton', className)}
            data-testid={testId}
            style={{...systemStyle, ...style}}
            aria-hidden='true'
            {...restProps}
        />
    );
});
