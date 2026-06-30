import {useId, type ReactNode} from 'react';

import {cn} from '../../utils/cn';
import {Text} from '../Text/Text';

export function Field({
    label,
    helperText,
    error,
    required,
    htmlFor,
    children,
    className,
    testId,
}: {
    label?: ReactNode;
    helperText?: ReactNode;
    error?: ReactNode;
    required?: boolean;
    htmlFor?: string;
    children: ReactNode;
    className?: string;
    testId?: string;
}) {
    const helperId = useId();
    return (
        <div className={cn('oui-field', className)} data-testid={testId}>
            {label ? (
                <label className='oui-field-label' htmlFor={htmlFor}>
                    {label}
                    {required ? <span className='oui-field-required'>*</span> : null}
                </label>
            ) : null}
            {children}
            {error ? (
                <Text id={helperId} className='oui-field-error' fs='12px'>
                    {error}
                </Text>
            ) : helperText ? (
                <Text id={helperId} className='oui-field-helper' fs='12px'>
                    {helperText}
                </Text>
            ) : null}
        </div>
    );
}
