'use client';

import {cn} from '../../utils/cn';

export type SegmentedControlItem = {
    value: string;
    label: string;
    disabled?: boolean;
};

export function SegmentedControl({
    value,
    onValueChange,
    items,
    className,
    testId,
}: {
    value: string;
    onValueChange: (value: string) => void;
    items: ReadonlyArray<SegmentedControlItem>;
    className?: string;
    testId?: string;
}) {
    return (
        <div className={cn('oui-segmented', className)} data-testid={testId}>
            {items.map((item) => (
                <button
                    key={item.value}
                    type='button'
                    className='oui-segmented-item'
                    data-active={value === item.value ? 'true' : undefined}
                    data-testid={testId ? `${testId}-${item.value}` : undefined}
                    disabled={item.disabled}
                    onClick={() => onValueChange(item.value)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
