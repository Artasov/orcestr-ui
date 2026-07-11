import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react';

import { cn } from '../../utils/cn';
import { Text } from '../Text/Text';

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
    const generatedControlId = useId();
    const labelId = useId();
    const helperId = useId();
    const control = isValidElement<Record<string, unknown>>(children)
        ? (children as ReactElement<Record<string, unknown>>)
        : null;
    const controlId = htmlFor ?? (control?.props.id as string | undefined) ?? generatedControlId;
    const describedBy = [
        control?.props['aria-describedby'] as string | undefined,
        error || helperText ? helperId : undefined,
    ]
        .filter(Boolean)
        .join(' ');
    const labelledBy = [
        control?.props['aria-labelledby'] as string | undefined,
        label ? labelId : undefined,
    ]
        .filter(Boolean)
        .join(' ');
    const linkedControl = control
        ? cloneElement(control, {
              id: controlId,
              required: required || (control.props.required as boolean | undefined),
              'aria-required': required || undefined,
              'aria-invalid': error ? true : control.props['aria-invalid'],
              'aria-describedby': describedBy || undefined,
              'aria-labelledby': labelledBy || undefined,
          })
        : children;
    return (
        <div className={cn('oui-field', className)} data-testid={testId}>
            {label ? (
                <label id={labelId} className="oui-field-label" htmlFor={controlId}>
                    {label}
                    {required ? <span className="oui-field-required">*</span> : null}
                </label>
            ) : null}
            {linkedControl}
            {error ? (
                <Text id={helperId} className="oui-field-error" fs="12px" role="alert">
                    {error}
                </Text>
            ) : helperText ? (
                <Text id={helperId} className="oui-field-helper" fs="12px">
                    {helperText}
                </Text>
            ) : null}
        </div>
    );
}
