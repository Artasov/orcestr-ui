import type {ReactNode} from 'react';

import {Section} from '../components/Section/Section';

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
        <Section id={id} className='oui-ui-section'>
            <div className='oui-ui-section-head'>
                <div>
                    <h2 className='oui-ui-section-title'>{title}</h2>
                    {description ? (
                        <p className='oui-ui-description'>{description}</p>
                    ) : null}
                </div>
            </div>
            {children}
        </Section>
    );
}
