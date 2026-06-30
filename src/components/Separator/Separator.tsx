import {cn} from '../../utils/cn';

export function Separator({
    orientation = 'horizontal',
    className,
    testId,
}: {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    testId?: string;
}) {
    return (
        <span
            className={cn('oui-separator', className)}
            data-orientation={orientation}
            data-testid={testId}
            role='separator'
            aria-orientation={orientation}
        />
    );
}
