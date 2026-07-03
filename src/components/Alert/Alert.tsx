'use client';

import type {HTMLAttributes, ReactNode} from 'react';

import {
    normalizeTone,
    splitSystemProps,
    type SystemProps,
    type ToneInput,
} from '../../theme/systemProps';
import {cn} from '../../utils/cn';
import {stateIcon} from '../State/stateIcon';

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> &
    SystemProps & {
    tone?: Exclude<ToneInput, 'primary' | 'secondary' | 'muted'>;
    v?: 'soft' | 'surface';
    title?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    testId?: string;
};

export function Alert({
    tone = 'info',
    v = 'soft',
    title,
    icon,
    action,
    className,
    style,
    children,
    testId,
    ...props
}: AlertProps) {
    const {systemStyle, restProps} = splitSystemProps(props);
    const actualTone = normalizeTone(tone, 'info');

    return (
        <div
            className={cn('oui-alert', className)}
            data-tone={actualTone}
            data-variant={v}
            data-testid={testId}
            role={actualTone === 'danger' ? 'alert' : 'status'}
            style={{...systemStyle, ...style}}
            {...restProps}
        >
            <span className='oui-alert-icon'>{icon ?? stateIcon(actualTone)}</span>
            <span className='oui-alert-main'>
                {title ? <strong>{title}</strong> : null}
                {children ? <span>{children}</span> : null}
            </span>
            {action ? <span className='oui-alert-action'>{action}</span> : null}
        </div>
    );
}
