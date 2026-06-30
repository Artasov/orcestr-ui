'use client';

import type {HTMLAttributes, ReactNode} from 'react';
import {LuArrowRight, LuCheck, LuCircleAlert, LuRefreshCw} from 'react-icons/lu';

import {cn} from '../../utils/cn';
import type {Tone} from '../../theme/systemProps';
import type {OrcestrActionItem} from '../Action/ActionTypes';
import {Alert} from '../Alert/Alert';
import {Badge} from '../Badge/Badge';
import {Button} from '../Button/Button';
import {Skeleton} from '../Skeleton/Skeleton';
import {Tooltip} from '../Tooltip/Tooltip';

export type StatusBadgeProps = {
    children: ReactNode;
    tone?: Tone;
    size?: 1 | 2 | 3 | 4;
    testId?: string;
};

export function StatusBadge({children, tone = 'neutral', size = 2, testId}: StatusBadgeProps) {
    return (
        <Badge tone={tone} size={size} testId={testId}>
            {children}
        </Badge>
    );
}

export type TimelineItem = {
    key: string;
    title: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    tone?: Tone;
    icon?: ReactNode;
};

export function Timeline({
    items,
    className,
    testId,
    ...props
}: HTMLAttributes<HTMLOListElement> & {items: ReadonlyArray<TimelineItem>; testId?: string}) {
    return (
        <ol className={cn('oui-timeline', className)} data-testid={testId} {...props}>
            {items.map((item) => (
                <li key={item.key} className='oui-timeline-item' data-tone={item.tone ?? 'neutral'}>
                    <span className='oui-timeline-marker'>{item.icon}</span>
                    <div className='oui-timeline-content'>
                        <div className='oui-timeline-title-row'>
                            <strong>{item.title}</strong>
                            {item.meta ? <span>{item.meta}</span> : null}
                        </div>
                        {item.description ? <p>{item.description}</p> : null}
                    </div>
                </li>
            ))}
        </ol>
    );
}

export type WorkflowStepStatus =
    | 'active'
    | 'blocked'
    | 'done'
    | 'error'
    | 'pending'
    | 'processing';

export type PipelineStep = {
    key: string;
    label?: ReactNode;
    title?: ReactNode;
    detail?: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    tooltip?: ReactNode;
    disabledReason?: ReactNode;
    status?: WorkflowStepStatus;
    tone?: Tone;
    active?: boolean;
    complete?: boolean;
    disabled?: boolean;
    loading?: boolean;
    onSelect?: () => void;
};

export function Pipeline({
    steps,
    loading = false,
    loadingSteps = 5,
    disabled = false,
    className,
    testId,
    ...props
}: HTMLAttributes<HTMLDivElement> & {
    steps?: ReadonlyArray<PipelineStep>;
    loading?: boolean;
    loadingSteps?: number;
    disabled?: boolean;
    testId?: string;
}) {
    if (loading) {
        return (
            <div className={cn('oui-pipeline', className)} data-testid={testId} {...props}>
                {Array.from({length: loadingSteps}).map((_, index) => (
                    <div key={index} className='oui-pipeline-step' data-loading='true'>
                        <Skeleton w={16} h={16} r={7} />
                        <span className='oui-pipeline-step-main'>
                            <Skeleton w='70%' h={14} />
                            <Skeleton w='46%' h={12} />
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={cn('oui-pipeline', className)} data-testid={testId} {...props}>
            {(steps ?? []).map((step) => (
                <PipelineStepView key={step.key} step={step} disabled={disabled} />
            ))}
        </div>
    );
}

export type WorkflowSummaryBadge = {
    key: string;
    label: ReactNode;
    value?: ReactNode;
    tone?: Tone;
};

export function WorkflowSummaryBar({
    items,
    className,
    testId,
}: {
    items: ReadonlyArray<WorkflowSummaryBadge>;
    className?: string;
    testId?: string;
}) {
    return (
        <div className={cn('oui-workflow-summary', className)} data-testid={testId}>
            {items.map((item) => (
                <StatusBadge key={item.key} tone={item.tone ?? 'neutral'}>
                    {item.label}
                    {item.value !== undefined ? <strong>{item.value}</strong> : null}
                </StatusBadge>
            ))}
        </div>
    );
}

export type LifecycleBlockReason = {
    key: string;
    title?: ReactNode;
    message: ReactNode;
    tone?: Exclude<Tone, 'brand'>;
    actionLabel?: ReactNode;
    onAction?: () => void;
};

export function LifecycleBlockReasonCallout({
    reason,
}: {
    reason: LifecycleBlockReason;
}) {
    return (
        <Alert
            tone={reason.tone ?? 'warning'}
            title={reason.title}
            icon={<LuCircleAlert />}
            action={
                reason.onAction ? (
                    <Button size={1} v='surface' tone={reason.tone ?? 'warning'} onClick={reason.onAction}>
                        {reason.actionLabel}
                    </Button>
                ) : null
            }
        >
            {reason.message}
        </Alert>
    );
}

export type LifecycleAction = Omit<OrcestrActionItem, 'children' | 'onSelect'> & {
    disabledReason?: ReactNode;
    onSelect: () => void;
};

export function LifecycleActionPanel({
    title,
    meta,
    reasons = [],
    actions,
    className,
    testId,
}: {
    title?: ReactNode;
    meta?: ReactNode;
    reasons?: ReadonlyArray<LifecycleBlockReason>;
    actions: ReadonlyArray<LifecycleAction>;
    className?: string;
    testId?: string;
}) {
    return (
        <div className={cn('oui-lifecycle-panel', className)} data-testid={testId}>
            {title || meta ? (
                <div className='oui-lifecycle-panel-head'>
                    {title ? <strong>{title}</strong> : null}
                    {meta ? <span>{meta}</span> : null}
                </div>
            ) : null}
            {reasons.length ? (
                <div className='oui-lifecycle-reasons'>
                    {reasons.map((reason) => (
                        <LifecycleBlockReasonCallout key={reason.key} reason={reason} />
                    ))}
                </div>
            ) : null}
            <div className='oui-lifecycle-panel-actions'>
                {actions.map((action) => (
                    <LifecycleActionButton key={action.key} action={action} />
                ))}
            </div>
        </div>
    );
}

function PipelineStepView({
    step,
    disabled,
}: {
    step: PipelineStep;
    disabled: boolean;
}) {
    const status = pipelineStepStatus(step);
    const label = step.label ?? step.title;
    const isDisabled = disabled || step.disabled || !step.onSelect || step.loading;
    const content = (
        <button
            type='button'
            className='oui-pipeline-step'
            data-tone={step.tone ?? workflowStatusTone(status)}
            data-status={status}
            data-active={status === 'active' ? 'true' : undefined}
            data-complete={status === 'done' ? 'true' : undefined}
            data-clickable={!isDisabled ? 'true' : undefined}
            disabled={isDisabled}
            onClick={step.onSelect}
        >
            <span className='oui-pipeline-dot'>{workflowStatusIcon(status)}</span>
            <span className='oui-pipeline-step-main'>
                <span className='oui-pipeline-label'>{label}</span>
                {step.detail ? <span className='oui-pipeline-detail'>{step.detail}</span> : null}
                {step.description ? (
                    <span className='oui-pipeline-description'>{step.description}</span>
                ) : null}
            </span>
            {step.meta ? <span className='oui-pipeline-meta'>{step.meta}</span> : null}
        </button>
    );
    const tooltip = step.tooltip ?? step.disabledReason;
    if (!tooltip) return content;
    return (
        <Tooltip content={tooltip}>
            <span className='oui-pipeline-tooltip-wrap'>{content}</span>
        </Tooltip>
    );
}

function LifecycleActionButton({action}: {action: LifecycleAction}) {
    const button = (
        <Button
            size={1}
            v='surface'
            tone={action.tone}
            disabled={action.disabled}
            loading={action.loading}
            leftIcon={action.icon}
            onClick={action.onSelect}
        >
            {action.label}
        </Button>
    );
    if (!action.disabledReason) return button;
    return (
        <Tooltip content={action.disabledReason}>
            <span className='oui-lifecycle-action-tooltip-wrap'>{button}</span>
        </Tooltip>
    );
}

function pipelineStepStatus(step: PipelineStep): WorkflowStepStatus {
    if (step.status) return step.status;
    if (step.complete) return 'done';
    if (step.active) return 'active';
    return 'pending';
}

function workflowStatusTone(status: WorkflowStepStatus): Tone {
    if (status === 'done') return 'success';
    if (status === 'active' || status === 'processing') return 'info';
    if (status === 'blocked') return 'warning';
    if (status === 'error') return 'danger';
    return 'neutral';
}

function workflowStatusIcon(status: WorkflowStepStatus) {
    if (status === 'done') return <LuCheck aria-hidden />;
    if (status === 'active' || status === 'processing') return <LuRefreshCw aria-hidden />;
    return <LuArrowRight aria-hidden />;
}
