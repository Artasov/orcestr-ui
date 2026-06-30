'use client';

import {cn} from '../../utils/cn';

export type RadioGroupItem = {
    value: string;
    label: string;
    disabled?: boolean;
};

export function RadioGroup({
    value,
    onValueChange,
    items,
    name,
    className,
    testId,
}: {
    value: string;
    onValueChange: (value: string) => void;
    items: ReadonlyArray<RadioGroupItem>;
    name: string;
    className?: string;
    testId?: string;
}) {
    return (
        <div
            className={cn('oui-radio-group', className)}
            role='radiogroup'
            data-testid={testId}
        >
            {items.map((item) => (
                <label
                    key={item.value}
                    className='oui-radio'
                    data-checked={value === item.value ? 'true' : undefined}
                    data-disabled={item.disabled ? 'true' : undefined}
                    data-testid={testId ? `${testId}-${item.value}` : undefined}
                >
                    <input
                        type='radio'
                        name={name}
                        value={item.value}
                        checked={value === item.value}
                        disabled={item.disabled}
                        onChange={() => onValueChange(item.value)}
                    />
                    <span className='oui-radio-dot' />
                    <span>{item.label}</span>
                </label>
            ))}
        </div>
    );
}
