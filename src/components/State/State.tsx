'use client';

import type {HTMLAttributes, ReactNode} from 'react';
import {LuLock} from 'react-icons/lu';

import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {cn} from '../../utils/cn';
import type {SystemProps, Tone} from '../../theme/systemProps';
import {Button} from '../Button/Button';
import {IconText} from '../IconText/IconText';
import {Spinner} from '../Spinner/Spinner';
import {Text} from '../Text/Text';
import {stateIcon} from './stateIcon';

export type StateCardTone = Tone;

export type StateCardProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
    tone?: StateCardTone;
    icon?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    titleFs?: SystemProps['fs'];
    descriptionFs?: SystemProps['fs'];
    action?: ReactNode;
    compact?: boolean;
    testId?: string;
};

export function StateCard({
    tone = 'neutral',
    icon,
    title,
    description,
    titleFs,
    descriptionFs = '13px',
    action,
    compact = false,
    className,
    children,
    testId,
    ...props
}: StateCardProps) {
    const hasBody = description || children;
    const actualTitleFs = titleFs ?? (compact ? '14px' : '15px');
    return (
        <div
            className={cn('oui-state-card', className)}
            data-tone={tone}
            data-compact={compact ? 'true' : undefined}
            data-testid={testId}
            {...props}
        >
            <div className='oui-state-card-main'>
                <IconText
                    fw={760}
                    fs={actualTitleFs}
                    icon={icon ?? stateIcon(tone)}
                    iconTone={tone === 'neutral' ? 'muted' : tone}
                >
                    {title}
                </IconText>
                {hasBody ? (
                    <div className='oui-state-card-body'>
                        {description ? (
                            <Text className='oui-state-card-description' fs={descriptionFs}>
                                {description}
                            </Text>
                        ) : null}
                        {children}
                    </div>
                ) : null}
            </div>
            {action ? <div className='oui-state-card-action'>{action}</div> : null}
        </div>
    );
}

export function EmptyState({title, ...props}: Omit<StateCardProps, 'tone'>) {
    const {copy} = useOrcestrUiLocale();
    return <StateCard tone='neutral' title={title ?? copy.common.noData} {...props} />;
}

export function LoadingState({
    title,
    description,
    ...props
}: Omit<StateCardProps, 'icon' | 'tone'>) {
    const {copy} = useOrcestrUiLocale();
    return (
        <StateCard
            tone='info'
            icon={<Spinner />}
            title={title ?? copy.common.loading}
            description={description}
            {...props}
        />
    );
}

export function ErrorState({
    title,
    retryLabel,
    onRetry,
    action,
    ...props
}: Omit<StateCardProps, 'tone'> & {
    retryLabel?: ReactNode;
    onRetry?: () => void;
}) {
    const {copy} = useOrcestrUiLocale();
    return (
        <StateCard
            tone='danger'
            title={title ?? copy.table.unableToLoad}
            action={
                onRetry ? (
                    <Button size={1} v='surface' tone='danger' onClick={onRetry}>
                        {retryLabel ?? copy.common.retry}
                    </Button>
                ) : action
            }
            {...props}
        />
    );
}

export function AccessDeniedState(props: Omit<StateCardProps, 'icon' | 'tone'>) {
    return <StateCard tone='warning' icon={<LuLock />} {...props} />;
}
