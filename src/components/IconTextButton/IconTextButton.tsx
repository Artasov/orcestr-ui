'use client';

import { forwardRef, type ReactNode, type Ref } from 'react';

import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from '../Button/Button';
import { LinkButton, type LinkButtonProps } from '../LinkButton/LinkButton';

type IconTextButtonOwnProps = {
    icon?: ReactNode;
    endIcon?: ReactNode;
    iconSide?: 'start' | 'end';
    iconClassName?: string;
    labelClassName?: string;
};

type IconTextButtonButtonProps = Omit<ButtonProps, 'leftIcon' | 'rightIcon'> & {
    href?: never;
};

type IconTextButtonLinkProps = Omit<LinkButtonProps, 'leftIcon' | 'rightIcon'> & {
    href: string;
};

export type IconTextButtonProps = IconTextButtonOwnProps &
    (IconTextButtonButtonProps | IconTextButtonLinkProps);

function iconNode(icon: ReactNode, className?: string) {
    if (!icon) return undefined;
    return <span className={cn('oui-icon-text-button-icon', className)}>{icon}</span>;
}

export const IconTextButton = forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    IconTextButtonProps
>(function IconTextButton(
    {
        className,
        icon,
        endIcon,
        iconSide = 'start',
        iconClassName,
        labelClassName,
        children,
        href,
        ...props
    },
    ref,
) {
    const startIcon = iconSide === 'start' ? iconNode(icon, iconClassName) : undefined;
    const finishIcon =
        endIcon !== undefined
            ? iconNode(endIcon, iconClassName)
            : iconSide === 'end'
              ? iconNode(icon, iconClassName)
              : undefined;
    const label = (
        <span className={cn('oui-icon-text-button-label', labelClassName)}>{children}</span>
    );

    if (href !== undefined) {
        return (
            <LinkButton
                ref={ref as Ref<HTMLAnchorElement>}
                href={href}
                className={cn('oui-icon-text-button', className)}
                leftIcon={startIcon}
                rightIcon={finishIcon}
                {...(props as Omit<LinkButtonProps, 'leftIcon' | 'rightIcon'>)}
            >
                {label}
            </LinkButton>
        );
    }

    return (
        <Button
            ref={ref as Ref<HTMLButtonElement>}
            className={cn('oui-icon-text-button', className)}
            leftIcon={startIcon}
            rightIcon={finishIcon}
            {...(props as Omit<ButtonProps, 'leftIcon' | 'rightIcon'>)}
        >
            {label}
        </Button>
    );
});
