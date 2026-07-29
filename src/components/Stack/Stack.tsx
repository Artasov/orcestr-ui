import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '../../utils/cn.js';
import { Flex } from '../Flex/Flex.js';
import type { SystemProps } from '../../theme/systemProps.js';

export type StackProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        testId?: string;
    };

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
    { className, g = 2, ...props },
    ref,
) {
    return <Flex ref={ref} col g={g} className={cn('oui-stack', className)} {...props} />;
});
