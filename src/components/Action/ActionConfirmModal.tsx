'use client';

import {ConfirmDialog} from '../ConfirmDialog/ConfirmDialog';
import type {OrcestrActionItem} from './ActionTypes';

export function ActionConfirmModal({
    item,
    open,
    onConfirm,
    onCancel,
}: {
    item: OrcestrActionItem | null;
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const confirmation = item?.confirm;
    const title = confirmation?.title ?? item?.label;
    const confirmLabel = confirmation?.confirmLabel ?? item?.label;
    const tone = confirmation?.tone ?? item?.tone ?? 'neutral';

    return (
        <ConfirmDialog
            open={open && Boolean(item)}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onCancel();
            }}
            title={title}
            message={confirmation?.message}
            confirmLabel={confirmLabel}
            cancelLabel={confirmation?.cancelLabel}
            tone={tone}
            loading={item?.loading}
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );
}
