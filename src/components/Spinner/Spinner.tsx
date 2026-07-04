import { cn } from '../../utils/cn';
import type { UiSize } from '../../theme/systemProps';
import type { CSSProperties } from 'react';

export function Spinner({
    size = 2,
    className,
    style,
    testId,
}: {
    size?: UiSize;
    className?: string;
    style?: CSSProperties;
    testId?: string;
}) {
    return (
        <span
            className={cn('oui-spinner', className)}
            data-size={size}
            data-testid={testId}
            style={style}
        />
    );
}
