import {forwardRef, type ComponentPropsWithoutRef} from 'react';

import {cn} from '../../utils/cn';
import {Flex} from '../Flex/Flex';
import type {SystemProps} from '../../theme/systemProps';

export type StackProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        testId?: string;
    };

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
    {className, g = 2, ...props},
    ref,
) {
    return (
        <Flex
            ref={ref}
            col
            g={g}
            className={cn('oui-stack', className)}
            {...props}
        />
    );
});
