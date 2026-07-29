'use client';

import {
    cloneElement,
    forwardRef,
    isValidElement,
    useContext,
    type ButtonHTMLAttributes,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react';

import { cn } from '../../utils/cn.js';
import {
    splitSystemProps,
    type SystemProps,
    type ToneInput,
    type UiSize,
    normalizeTone,
} from '../../theme/systemProps.js';
import { OrcestrThemeContext } from '../../theme/useTheme.js';
import type { ButtonPressAnimation } from '../../theme/themeTypes.js';
import { renderSlot } from '../../utils/slot.js';
import type { ButtonVariant } from '../Button/Button.js';
import { Spinner } from '../Spinner/Spinner.js';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    SystemProps & {
        size?: UiSize;
        v?: ButtonVariant;
        tone?: ToneInput;
        icon?: ReactNode;
        loading?: boolean;
        round?: boolean;
        badge?: ReactNode;
        badgeTone?: ToneInput;
        badgeMax?: number;
        badgeTestId?: string;
        pressAnimation?: ButtonPressAnimation;
        asChild?: boolean;
        children?: ReactNode;
        testId?: string;
    };

function formatBadge(value: ReactNode, max: number): ReactNode {
    if (typeof value !== 'number') return value;
    return value > max ? `${max}+` : value;
}

function withBadge(children: ReactNode, badge: ReactNode) {
    if (badge === null || badge === undefined || !isValidElement(children)) {
        return children;
    }

    const child = children as ReactElement<{ children?: ReactNode }>;
    return cloneElement(
        child,
        undefined,
        <>
            {child.props.children}
            {badge}
        </>,
    );
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
    {
        className,
        style,
        size = 3,
        v = 'soft',
        tone = 'neutral',
        loading = false,
        round = true,
        badge,
        badgeTone = 'danger',
        badgeMax = 99,
        badgeTestId,
        pressAnimation,
        asChild = false,
        testId,
        icon,
        children,
        disabled,
        type = 'button',
        ...props
    },
    ref,
) {
    const themeContext = useContext(OrcestrThemeContext);
    const actualPressAnimation =
        pressAnimation ?? themeContext?.theme.motion.pressAnimation ?? 'soft';
    const { systemStyle, restProps } = splitSystemProps(props);
    const commonProps = {
        className: cn('oui-icon-button', className),
        'data-size': size,
        'data-variant': v,
        'data-tone': normalizeTone(tone),
        'data-round': round ? 'true' : undefined,
        'data-press-animation': actualPressAnimation,
        'data-loading': loading ? 'true' : undefined,
        'data-testid': testId,
        'aria-busy': loading || undefined,
        style: { ...systemStyle, ...style },
        ...restProps,
    };
    const badgeNode =
        badge === null || badge === undefined ? null : (
            <span
                className="oui-icon-button-badge"
                data-tone={normalizeTone(badgeTone)}
                data-testid={badgeTestId}
            >
                {formatBadge(badge, badgeMax)}
            </span>
        );
    const content = (
        <>
            {loading ? <Spinner size={1} /> : (icon ?? children)}
            {badgeNode}
        </>
    );

    if (asChild) {
        return renderSlot(withBadge(children, badgeNode), {
            ...commonProps,
            ref: ref as Ref<HTMLElement>,
            'aria-disabled': disabled || loading ? true : undefined,
        });
    }

    return (
        <button ref={ref} type={type} {...commonProps} disabled={disabled || loading}>
            {content}
        </button>
    );
});
