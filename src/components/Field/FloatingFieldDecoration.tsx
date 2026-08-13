import type { CSSProperties, ReactNode } from 'react';

type FloatingFieldStyle = CSSProperties & {
    '--oui-floating-field-border-color'?: string;
    '--oui-floating-field-border-hover-color'?: string;
    '--oui-floating-field-focus-color'?: string;
    '--oui-floating-field-label-color'?: string;
    '--oui-floating-field-label-focus-color'?: string;
};

export function FloatingFieldDecoration({
    label,
    htmlFor,
    color,
}: {
    label: ReactNode;
    htmlFor?: string;
    color?: string;
}) {
    const floatingStyle: FloatingFieldStyle | undefined = color
        ? {
              '--oui-floating-field-border-color': color,
              '--oui-floating-field-border-hover-color': color,
              '--oui-floating-field-focus-color': color,
              '--oui-floating-field-label-color': color,
              '--oui-floating-field-label-focus-color': color,
          }
        : undefined;
    const labelNode = htmlFor ? (
        <label className="oui-floating-field-label" htmlFor={htmlFor} style={floatingStyle}>
            {label}
        </label>
    ) : (
        <span className="oui-floating-field-label" aria-hidden="true" style={floatingStyle}>
            {label}
        </span>
    );

    return (
        <>
            <span className="oui-floating-field-outline" aria-hidden="true" style={floatingStyle}>
                <span className="oui-floating-field-outline-sides" />
                <span className="oui-floating-field-outline-top">
                    <span className="oui-floating-field-outline-top-start" />
                    <span className="oui-floating-field-outline-gap">
                        <span>{label}</span>
                    </span>
                    <span className="oui-floating-field-outline-top-end" />
                </span>
            </span>
            {labelNode}
        </>
    );
}
