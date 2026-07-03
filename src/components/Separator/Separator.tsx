import type {HTMLAttributes} from 'react';

import {splitSystemProps, type SystemProps} from '../../theme/systemProps';
import {cn} from '../../utils/cn';

export function Separator({
    orientation = 'horizontal',
    className,
    style,
    testId,
    ...props
}: HTMLAttributes<HTMLSpanElement> & SystemProps & {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    testId?: string;
}) {
    const {systemStyle, restProps} = splitSystemProps(props);
    return (
        <span
            className={cn('oui-separator', className)}
            data-orientation={orientation}
            data-testid={testId}
            role='separator'
            aria-orientation={orientation}
            style={{...systemStyle, ...style}}
            {...restProps}
        />
    );
}
