'use client';

import type {HTMLAttributes, ReactNode} from 'react';

import type {Tone} from '../../theme/systemProps';
import {cn} from '../../utils/cn';
import {stateIcon} from '../State/stateIcon';

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
    tone?: Exclude<Tone, 'brand'>;
    title?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    testId?: string;
};

export function Alert({
    tone = 'info',
    title,
    icon,
    action,
    className,
    children,
    testId,
    ...props
}: AlertProps) {
    return (
        <div
            className={cn('oui-alert', className)}
            data-tone={tone}
            data-testid={testId}
            role={tone === 'danger' ? 'alert' : 'status'}
            {...props}
        >
            <span className='oui-alert-icon'>{icon ?? stateIcon(tone)}</span>
            <span className='oui-alert-main'>
                {title ? <strong>{title}</strong> : null}
                {children ? <span>{children}</span> : null}
            </span>
            {action ? <span className='oui-alert-action'>{action}</span> : null}
        </div>
    );
}
