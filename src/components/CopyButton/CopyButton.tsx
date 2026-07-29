'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { LuCheck, LuCopy } from 'react-icons/lu';

import { cn } from '../../utils/cn.js';
import { Button, type ButtonProps } from '../Button/Button.js';
import { IconButton, type IconButtonProps } from '../IconButton/IconButton.js';
import { useToast } from '../Toast/Toast.js';

export type CopyButtonProps = Omit<ButtonProps, 'children' | 'leftIcon' | 'loading' | 'onClick'> & {
    text: string;
    label?: string;
    copiedLabel?: string;
    successMessage?: string;
    errorMessage?: string;
    resetMs?: number;
    onCopied?: () => void;
    onCopyError?: (error: unknown) => void;
};

export type CopyIconButtonProps = Omit<
    IconButtonProps,
    'children' | 'icon' | 'loading' | 'onClick'
> & {
    text: string;
    label?: string;
    successMessage?: string;
    errorMessage?: string;
    resetMs?: number;
    onCopied?: () => void;
    onCopyError?: (error: unknown) => void;
};

export function CopyButton({
    text,
    label = 'Copy',
    copiedLabel = 'Copied',
    successMessage = 'Copied',
    errorMessage = 'Copy failed',
    resetMs = 1400,
    onCopied,
    onCopyError,
    className,
    disabled,
    ...props
}: CopyButtonProps) {
    const { copied, pending, copy } = useCopyAction({
        text,
        successMessage,
        errorMessage,
        resetMs,
        onCopied,
        onCopyError,
    });

    return (
        <Button
            {...props}
            className={cn('oui-copy-button', className)}
            disabled={disabled || pending}
            loading={pending}
            leftIcon={copied ? <LuCheck size={15} /> : <LuCopy size={15} />}
            onClick={copy}
        >
            {copied ? copiedLabel : label}
        </Button>
    );
}

export function CopyIconButton({
    text,
    label = 'Copy',
    successMessage = 'Copied',
    errorMessage = 'Copy failed',
    resetMs = 1400,
    onCopied,
    onCopyError,
    className,
    disabled,
    ...props
}: CopyIconButtonProps) {
    const { copied, pending, copy } = useCopyAction({
        text,
        successMessage,
        errorMessage,
        resetMs,
        onCopied,
        onCopyError,
    });

    return (
        <IconButton
            {...props}
            className={cn('oui-copy-icon-button', className)}
            disabled={disabled || pending}
            loading={pending}
            icon={copied ? <LuCheck size={15} /> : <LuCopy size={15} />}
            aria-label={label}
            onClick={copy}
        />
    );
}

function useCopyAction({
    text,
    successMessage,
    errorMessage,
    resetMs,
    onCopied,
    onCopyError,
}: {
    text: string;
    successMessage: string;
    errorMessage: string;
    resetMs: number;
    onCopied?: () => void;
    onCopyError?: (error: unknown) => void;
}) {
    const toast = useToast();
    const timerRef = useRef<number | null>(null);
    const [pending, setPending] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(
        () => () => {
            if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        },
        [],
    );

    async function copy(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        setPending(true);
        try {
            await writeClipboardText(text);
            setCopied(true);
            onCopied?.();
            if (successMessage) toast.success(successMessage);
            if (timerRef.current !== null) window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => setCopied(false), resetMs);
        } catch (error) {
            onCopyError?.(error);
            if (errorMessage) toast.error(errorMessage);
        } finally {
            setPending(false);
        }
    }

    return { copied, pending, copy };
}

async function writeClipboardText(text: string) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.top = '-9999px';
    field.style.left = '-9999px';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('Clipboard copy failed');
}
