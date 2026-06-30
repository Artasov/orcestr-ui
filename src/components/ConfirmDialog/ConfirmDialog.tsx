'use client';

import type {ReactNode} from 'react';

import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import type {Tone} from '../../theme/systemProps';
import {Button} from '../Button/Button';
import {Modal, type ModalProps} from '../Modal/Modal';
import {Text} from '../Text/Text';

export type ConfirmDialogTone = Extract<
    Tone,
    'danger' | 'info' | 'neutral' | 'success' | 'warning'
>;

export type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: ReactNode;
    description?: ReactNode;
    message?: ReactNode;
    children?: ReactNode;
    confirmLabel?: ReactNode;
    cancelLabel?: ReactNode;
    tone?: ConfirmDialogTone;
    loading?: boolean;
    confirmDisabled?: boolean;
    cancelDisabled?: boolean;
    closeOnOverlayClick?: boolean;
    maxWidth?: ModalProps['maxWidth'];
    testId?: string;
    onConfirm: () => void;
    onCancel?: () => void;
};

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    message,
    children,
    confirmLabel,
    cancelLabel,
    tone = 'neutral',
    loading = false,
    confirmDisabled = false,
    cancelDisabled = false,
    closeOnOverlayClick,
    maxWidth = 420,
    testId,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const {copy} = useOrcestrUiLocale();
    const actualCancelLabel = cancelLabel ?? copy.common.close;
    const actualConfirmLabel = confirmLabel ?? copy.common.save;
    const canClose = !loading && !cancelDisabled;

    const cancel = () => {
        if (!canClose) return;
        onCancel?.();
        onOpenChange(false);
    };

    return (
        <Modal
            open={open}
            onOpenChange={(nextOpen) => {
                if (nextOpen) {
                    onOpenChange(true);
                    return;
                }
                cancel();
            }}
            title={title}
            description={description}
            maxWidth={maxWidth}
            closeOnOverlayClick={closeOnOverlayClick ?? canClose}
            testId={testId}
            footer={(
                <>
                    <Button
                        v='surface'
                        onClick={cancel}
                        disabled={!canClose}
                        testId={testId ? `${testId}-cancel` : undefined}
                    >
                        {actualCancelLabel}
                    </Button>
                    <Button
                        tone={tone}
                        loading={loading}
                        disabled={confirmDisabled}
                        onClick={onConfirm}
                        testId={testId ? `${testId}-confirm` : undefined}
                    >
                        {actualConfirmLabel}
                    </Button>
                </>
            )}
        >
            {message ? (
                <Text as='p' tone='muted' lh={1.5}>
                    {message}
                </Text>
            ) : null}
            {children}
        </Modal>
    );
}
