import {forwardRef, type ComponentPropsWithoutRef} from 'react';

import {cn} from '../../utils/cn';

export type VisuallyHiddenProps = ComponentPropsWithoutRef<'span'> & {
    testId?: string;
};

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
    function VisuallyHidden({className, testId, ...props}, ref) {
        return (
            <span
                ref={ref}
                className={cn('oui-visually-hidden', className)}
                data-testid={testId}
                {...props}
            />
        );
    },
);
