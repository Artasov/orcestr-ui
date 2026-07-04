'use client';

import {
    forwardRef,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type InputHTMLAttributes,
    type ReactNode,
} from 'react';
import { LuCheck, LuMinus } from 'react-icons/lu';

import { cn } from '../../utils/cn';
import { composeRefs } from '../../utils/composeRefs';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked'> & {
    label?: ReactNode;
    checked?: boolean | 'indeterminate';
    onCheckedChange?: (checked: boolean) => void;
    testId?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
    {
        className,
        label,
        children,
        checked,
        defaultChecked,
        disabled,
        onChange,
        onCheckedChange,
        testId,
        dangerouslySetInnerHTML: _dangerouslySetInnerHTML,
        ...props
    },
    ref,
) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
    const actualChecked = checked ?? internalChecked;
    const inputChecked = actualChecked === 'indeterminate' ? false : actualChecked;
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (checked === undefined) setInternalChecked(event.target.checked);
        onChange?.(event);
        onCheckedChange?.(event.target.checked);
    };

    useEffect(() => {
        if (!inputRef.current) return;
        inputRef.current.indeterminate = actualChecked === 'indeterminate';
    }, [actualChecked]);

    return (
        <label
            className={cn('oui-checkbox', className)}
            data-checked={actualChecked === true ? 'true' : undefined}
            data-indeterminate={actualChecked === 'indeterminate' ? 'true' : undefined}
            data-disabled={disabled ? 'true' : undefined}
            data-testid={testId}
        >
            <input
                ref={composeRefs(inputRef, ref)}
                type="checkbox"
                checked={inputChecked}
                disabled={disabled}
                onChange={handleChange}
                {...props}
            />
            <span className="oui-checkbox-box">
                <LuCheck className="oui-checkbox-check" size={13} />
                <LuMinus className="oui-checkbox-minus" size={13} />
            </span>
            {label || children ? <span>{label ?? children}</span> : null}
        </label>
    );
});
