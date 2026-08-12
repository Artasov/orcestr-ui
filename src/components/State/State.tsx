'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { LuLock } from 'react-icons/lu';

import { useOrcestrUiLocale } from '../../locale/LocaleProvider.js';
import { cn } from '../../utils/cn.js';
import type { SystemProps, Tone } from '../../theme/systemProps.js';
import { Button } from '../Button/Button.js';
import { IconText, type IconTextProps } from '../IconText/IconText.js';
import { Spinner } from '../Spinner/Spinner.js';
import { Text, type TextProps } from '../Text/Text.js';
import { stateIcon } from './stateIcon.js';

export type StateCardTone = Tone;
export type StateCardVariant = 'soft' | 'surface' | 'outline' | 'ghost';

export type StateCardProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
    tone?: StateCardTone;
    v?: StateCardVariant;
    icon?: ReactNode;
    iconTone?: IconTextProps['iconTone'];
    title?: ReactNode;
    titleTone?: TextProps['tone'];
    description?: ReactNode;
    descriptionTone?: TextProps['tone'];
    titleFs?: SystemProps['fs'];
    descriptionFs?: SystemProps['fs'];
    action?: ReactNode;
    compact?: boolean;
    testId?: string;
};

export function StateCard({
    tone = 'neutral',
    v = 'soft',
    icon,
    iconTone,
    title,
    titleTone,
    description,
    descriptionTone,
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
            data-variant={v}
            data-compact={compact ? 'true' : undefined}
            data-testid={testId}
            {...props}
        >
            <div className="oui-state-card-main">
                <IconText
                    icon={icon ?? stateIcon(tone)}
                    iconTone={iconTone ?? (tone === 'neutral' ? 'muted' : tone)}
                    textProps={{ fw: 760, fs: actualTitleFs, tone: titleTone }}
                >
                    {title}
                </IconText>
                {hasBody ? (
                    <div className="oui-state-card-body">
                        {description ? (
                            <Text
                                className="oui-state-card-description"
                                fs={descriptionFs}
                                tone={descriptionTone}
                            >
                                {description}
                            </Text>
                        ) : null}
                        {children}
                    </div>
                ) : null}
            </div>
            {action ? <div className="oui-state-card-action">{action}</div> : null}
        </div>
    );
}

export function EmptyState({ title, ...props }: Omit<StateCardProps, 'tone'>) {
    const { copy } = useOrcestrUiLocale();
    return <StateCard tone="neutral" title={title ?? copy.common.noData} {...props} />;
}

export function LoadingState({
    title,
    description,
    ...props
}: Omit<StateCardProps, 'icon' | 'tone'>) {
    const { copy } = useOrcestrUiLocale();
    return (
        <StateCard
            tone="info"
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
    const { copy } = useOrcestrUiLocale();
    return (
        <StateCard
            tone="danger"
            title={title ?? copy.table.unableToLoad}
            action={
                onRetry ? (
                    <Button size={1} v="surface" tone="danger" onClick={onRetry}>
                        {retryLabel ?? copy.common.retry}
                    </Button>
                ) : (
                    action
                )
            }
            {...props}
        />
    );
}

export function AccessDeniedState(props: Omit<StateCardProps, 'icon' | 'tone'>) {
    return <StateCard tone="warning" icon={<LuLock />} {...props} />;
}
