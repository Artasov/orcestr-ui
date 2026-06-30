import {cn} from '../../utils/cn';
import type {UiSize} from '../../theme/systemProps';

export function Spinner({
    size = 2,
    className,
    testId,
}: {
    size?: UiSize;
    className?: string;
    testId?: string;
}) {
    return <span className={cn('oui-spinner', className)} data-size={size} data-testid={testId} />;
}
