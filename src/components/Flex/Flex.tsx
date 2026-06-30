import {forwardRef, type ComponentPropsWithoutRef} from 'react';

import {cn} from '../../utils/cn';
import {splitSystemProps, type SystemProps} from '../../theme/systemProps';

export type FlexProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        testId?: string;
    };

export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
    {className, style, testId, ...props},
    ref,
) {
    const {systemStyle, restProps} = splitSystemProps(props);
    return (
        <div
            ref={ref}
            className={cn('oui-flex', className)}
            data-testid={testId}
            style={{...systemStyle, ...style}}
            {...restProps}
        />
    );
});
