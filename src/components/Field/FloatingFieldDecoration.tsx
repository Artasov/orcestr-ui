import type { ReactNode } from 'react';

export function FloatingFieldDecoration({
    label,
    htmlFor,
}: {
    label: ReactNode;
    htmlFor?: string;
}) {
    const labelNode = htmlFor ? (
        <label className="oui-floating-field-label" htmlFor={htmlFor}>
            {label}
        </label>
    ) : (
        <span className="oui-floating-field-label" aria-hidden="true">
            {label}
        </span>
    );

    return (
        <>
            <fieldset className="oui-floating-field-outline" aria-hidden="true">
                <legend>
                    <span>{label}</span>
                </legend>
            </fieldset>
            {labelNode}
        </>
    );
}
