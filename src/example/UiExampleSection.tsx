import type { ReactNode } from 'react';

export function UiExampleSection({
    id,
    title,
    description,
    children,
}: {
    id: string;
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className="oui-ui-section">
            <div className="oui-ui-section-head">
                <div>
                    <h2 className="oui-ui-section-title">{title}</h2>
                    {description ? <p className="oui-ui-description">{description}</p> : null}
                </div>
            </div>
            {children}
        </section>
    );
}
