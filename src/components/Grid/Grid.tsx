import {forwardRef, type ComponentPropsWithoutRef} from 'react';

import {cn} from '../../utils/cn';
import {splitSystemProps, type SystemProps} from '../../theme/systemProps';

export type GridProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        columns?: string;
        testId?: string;
    };

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
    {className, style, columns, testId, ...props},
    ref,
) {
    const {systemStyle, restProps} = splitSystemProps(props);
    return (
        <div
            ref={ref}
            className={cn('oui-grid', className)}
            data-testid={testId}
            style={{
                gridTemplateColumns: columns,
                ...systemStyle,
                ...style,
            }}
            {...restProps}
        />
    );
});
