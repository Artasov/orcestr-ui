import { forwardRef, type AnchorHTMLAttributes } from 'react';

import { splitSystemProps, type SystemProps } from '../../theme/systemProps.js';
import { cn } from '../../utils/cn.js';

export type LinkUnderline = 'none' | 'hover' | 'always';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
    SystemProps & {
        underline?: LinkUnderline;
        testId?: string;
    };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
    { className, style, underline = 'none', testId, children, ...props },
    ref,
) {
    const { systemStyle, restProps } = splitSystemProps(props);

    return (
        <a
            ref={ref}
            className={cn('oui-link', className)}
            data-underline={underline}
            data-testid={testId}
            style={{ ...systemStyle, ...style }}
            {...restProps}
        >
            {children}
        </a>
    );
});
