'use client';

import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type ReactNode,
} from 'react';
import { LuX } from 'react-icons/lu';

import { cn } from '../../utils/cn.js';
import { useOrcestrUiLocale } from '../../locale/LocaleProvider.js';
import { Modal, type ModalProps } from '../Modal/Modal.js';

export type SpecialModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type SpecialModalScroll = 'body' | 'content';
export type SpecialModalDensity = 'regular' | 'compact';

export type SpecialModalProps = Omit<ModalProps, 'maxWidth'> & {
    size?: SpecialModalSize;
    maxW?: number | string;
    scroll?: SpecialModalScroll;
    density?: SpecialModalDensity;
};

const sizeMaxWidth: Record<SpecialModalSize, string> = {
    sm: '420px',
    md: '640px',
    lg: '960px',
    xl: 'min(1480px, calc(100vw - 48px))',
    full: 'calc(100vw - 48px)',
};

function SpecialModalRoot({
    size = 'lg',
    maxW,
    scroll = 'body',
    density = 'regular',
    className,
    contentClassName,
    children,
    ...props
}: SpecialModalProps) {
    return (
        <Modal
            {...props}
            maxWidth={maxW ?? sizeMaxWidth[size]}
            className={cn('oui-special-modal-layer', className)}
            contentClassName={cn(
                'oui-special-modal',
                `oui-special-modal-size-${size}`,
                `oui-special-modal-scroll-${scroll}`,
                `oui-special-modal-density-${density}`,
                contentClassName,
            )}
        >
            {children}
        </Modal>
    );
}

type SpecialModalPartProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
    testId?: string;
};

export type SpecialModalHeaderProps = SpecialModalPartProps & {
    title?: ReactNode;
    meta?: ReactNode;
    actions?: ReactNode;
};

const SpecialModalHeader = forwardRef<HTMLDivElement, SpecialModalHeaderProps>(
    function SpecialModalHeader(
        { className, title, meta, actions, children, testId, ...props },
        ref,
    ) {
        return (
            <div
                ref={ref}
                className={cn('oui-special-modal-header', className)}
                data-testid={testId}
                {...props}
            >
                {children ?? (
                    <>
                        <div className="oui-special-modal-title-wrap">
                            {title ? <h2 className="oui-special-modal-title">{title}</h2> : null}
                            {meta ? <div className="oui-special-modal-meta">{meta}</div> : null}
                        </div>
                        {actions ? (
                            <div className="oui-special-modal-actions">{actions}</div>
                        ) : null}
                    </>
                )}
            </div>
        );
    },
);

const SpecialModalBody = forwardRef<HTMLDivElement, SpecialModalPartProps>(
    function SpecialModalBody({ className, testId, ...props }, ref) {
        return (
            <div
                ref={ref}
                className={cn('oui-special-modal-body', className)}
                data-testid={testId}
                {...props}
            />
        );
    },
);

const SpecialModalFooter = forwardRef<HTMLDivElement, SpecialModalPartProps>(
    function SpecialModalFooter({ className, testId, ...props }, ref) {
        return (
            <div
                ref={ref}
                className={cn('oui-special-modal-footer', className)}
                data-testid={testId}
                {...props}
            />
        );
    },
);

type SpecialModalCloseProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
    children?: ReactNode;
};

function SpecialModalClose({
    className,
    children,
    'aria-label': ariaLabel,
    ...props
}: SpecialModalCloseProps) {
    const { copy } = useOrcestrUiLocale();
    return (
        <Modal.Close
            {...props}
            className={cn('oui-icon-button oui-special-modal-close', className)}
            aria-label={ariaLabel ?? copy.common.close}
            data-size="2"
            data-variant="ghost"
            data-tone="neutral"
            data-round="true"
        >
            {children ?? <LuX size={18} />}
        </Modal.Close>
    );
}

export const SpecialModal = Object.assign(SpecialModalRoot, {
    Header: SpecialModalHeader,
    Body: SpecialModalBody,
    Footer: SpecialModalFooter,
    Close: SpecialModalClose,
});

export type SpecialModalContentStyle = CSSProperties;
