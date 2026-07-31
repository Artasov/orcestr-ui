import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type ReactNode,
} from 'react';

import { splitSystemProps, type SystemProps, type UiSize } from '../../theme/systemProps.js';
import { cn } from '../../utils/cn.js';

type AvatarStyle = CSSProperties & {
    '--oui-avatar-size'?: string;
};

export type AvatarProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> &
    SystemProps & {
        src?: string | null;
        alt?: string;
        fallback?: ReactNode;
        size?: UiSize | number | string;
        testId?: string;
    };

function customAvatarSize(size: AvatarProps['size']) {
    if (typeof size === 'number' && ![1, 2, 3, 4].includes(size)) {
        return `${size}px`;
    }
    if (typeof size === 'string' && !/^[1-4]$/.test(size)) {
        return size;
    }
    return undefined;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
    {
        className,
        style,
        src,
        alt = '',
        fallback = '?',
        size = 2,
        testId,
        ...props
    },
    ref,
) {
    const { systemStyle, restProps } = splitSystemProps(props);
    const customSize = customAvatarSize(size);
    const avatarStyle: AvatarStyle = {
        ...systemStyle,
        ...(customSize ? { '--oui-avatar-size': customSize } : {}),
        ...style,
    };

    return (
        <span
            ref={ref}
            className={cn('oui-avatar', className)}
            data-size={customSize ? 'custom' : size}
            data-testid={testId}
            role={alt ? 'img' : undefined}
            aria-label={alt || undefined}
            style={avatarStyle}
            {...restProps}
        >
            {src ? <img className="oui-avatar-image" src={src} alt="" /> : fallback}
        </span>
    );
});
