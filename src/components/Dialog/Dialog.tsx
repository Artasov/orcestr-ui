'use client';

import {
    createContext,
    useContext,
    useId,
    type CSSProperties,
    type KeyboardEventHandler,
    type ReactNode,
} from 'react';

import { Modal, type ModalProps } from '../Modal/Modal.js';
import { splitSystemProps, type SystemProps } from '../../theme/systemProps.js';
import { cn } from '../../utils/cn.js';

export type DialogProps = ModalProps;

function DialogModal(props: DialogProps) {
    return <Modal {...props} />;
}

export const Dialog = Object.assign(DialogModal, {
    Root: DialogRoot,
    Content: DialogContent,
    Title: DialogTitle,
    Description: DialogDescription,
    Close: DialogClose,
});

type DialogContextValue = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    titleId?: string;
    descriptionId?: string;
};

const DialogContext = createContext<DialogContextValue | null>(null);

type DialogRootProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
};

function DialogRoot({ open, onOpenChange, children }: DialogRootProps) {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>
    );
}

type DialogContentProps = Omit<
    ModalProps,
    'open' | 'onOpenChange' | 'children' | 'ariaLabelledBy' | 'ariaDescribedBy'
> & {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    onOpenAutoFocus?: (event: { preventDefault: () => void }) => void;
    onEscapeKeyDown?: (event: { preventDefault: () => void }) => void;
};

function DialogContent({ children, className, style, ...props }: DialogContentProps) {
    const context = useContext(DialogContext);
    const titleId = useId();
    const descriptionId = useId();
    if (!context) return null;

    return (
        <DialogContext.Provider
            value={{
                ...context,
                titleId,
                descriptionId,
            }}
        >
            <Modal
                {...props}
                open={context.open}
                onOpenChange={context.onOpenChange}
                ariaLabelledBy={titleId}
                ariaDescribedBy={descriptionId}
                contentClassName={className}
                contentStyle={style}
            >
                {children}
            </Modal>
        </DialogContext.Provider>
    );
}

type DialogTitleProps = {
    children: ReactNode;
} & SystemProps & {
        className?: string;
        style?: CSSProperties;
    };

function DialogTitle({ children, className, style, ...props }: DialogTitleProps) {
    const context = useContext(DialogContext);
    const { systemStyle, restProps } = splitSystemProps(props);
    return (
        <h2
            id={context?.titleId}
            className={cn('oui-modal-title', className)}
            style={{ ...systemStyle, ...style }}
            {...restProps}
        >
            {children}
        </h2>
    );
}

type DialogDescriptionProps = {
    children: ReactNode;
    size?: number | string;
} & SystemProps & {
        className?: string;
        style?: CSSProperties;
    };

function DialogDescription({
    children,
    className,
    style,
    size: _size,
    ...props
}: DialogDescriptionProps) {
    const context = useContext(DialogContext);
    const { systemStyle, restProps } = splitSystemProps(props);
    return (
        <p
            id={context?.descriptionId}
            className={cn('oui-modal-description', className)}
            style={{ ...systemStyle, ...style }}
            {...restProps}
        >
            {children}
        </p>
    );
}

type DialogCloseProps = {
    children: ReactNode;
};

function DialogClose({ children }: DialogCloseProps) {
    const context = useContext(DialogContext);
    return (
        <span
            onClick={() => context?.onOpenChange(false)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    context?.onOpenChange(false);
                }
            }}
        >
            {children}
        </span>
    );
}
