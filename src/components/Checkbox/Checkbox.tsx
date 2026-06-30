'use client';

import {
    forwardRef,
    useState,
    type ChangeEvent,
    type InputHTMLAttributes,
    type ReactNode,
} from 'react';
import {LuCheck} from 'react-icons/lu';

import {cn} from '../../utils/cn';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label?: ReactNode;
    testId?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    function Checkbox(
        {
            className,
            label,
            children,
            checked,
            defaultChecked,
            disabled,
            onChange,
            testId,
            ...props
        },
        ref,
    ) {
        const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
        const actualChecked = checked ?? internalChecked;
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (checked === undefined) setInternalChecked(event.target.checked);
            onChange?.(event);
        };

        return (
            <label
                className={cn('oui-checkbox', className)}
                data-checked={actualChecked ? 'true' : undefined}
                data-disabled={disabled ? 'true' : undefined}
                data-testid={testId}
            >
                <input
                    ref={ref}
                    type='checkbox'
                    checked={actualChecked}
                    disabled={disabled}
                    onChange={handleChange}
                    {...props}
                />
                <span className='oui-checkbox-box'>
                    <LuCheck size={13} />
                </span>
                {label || children ? <span>{label ?? children}</span> : null}
            </label>
        );
    },
);
