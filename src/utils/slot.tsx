import {
    cloneElement,
    isValidElement,
    type CSSProperties,
    type KeyboardEvent,
    type MouseEvent,
    type PointerEvent,
    type HTMLAttributes,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react';

import { cn } from './cn';
import { composeRefs } from './composeRefs';

type SlotChildProps = HTMLAttributes<HTMLElement> & {
    ref?: Ref<HTMLElement>;
    disabled?: boolean;
};

export function renderSlot(
    children: ReactNode,
    props: SlotChildProps & {
        ref?: Ref<HTMLElement>;
        style?: CSSProperties;
    },
) {
    if (!isValidElement(children)) return null;

    const child = children as ReactElement<SlotChildProps>;
    const { className, style, ref, ...restProps } = props;
    const mergedProps = mergeSlotProps(restProps, child.props);
    const disabled = props.disabled || props['aria-disabled'] === true;

    if (disabled) {
        mergedProps['aria-disabled'] = true;
        mergedProps.onClick = (event: MouseEvent<HTMLElement>) => {
            event.preventDefault();
            event.stopPropagation();
        };
        mergedProps.onPointerDown = (event: PointerEvent<HTMLElement>) => {
            event.preventDefault();
            event.stopPropagation();
        };
        const onKeyDown = mergedProps.onKeyDown;
        mergedProps.onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            onKeyDown?.(event);
        };
        if (
            typeof child.type === 'string' &&
            ['button', 'input', 'select', 'textarea', 'fieldset', 'optgroup', 'option'].includes(
                child.type,
            )
        ) {
            mergedProps.disabled = true;
        }
    }

    return cloneElement(child, {
        ...mergedProps,
        ref: composeRefs(child.props.ref, ref),
        className: cn(className, child.props.className),
        style: {
            ...style,
            ...child.props.style,
        },
    });
}

function mergeSlotProps(
    slotProps: Omit<SlotChildProps, 'className' | 'style' | 'ref'>,
    childProps: SlotChildProps,
): SlotChildProps {
    const merged: Record<string, unknown> = { ...slotProps, ...childProps };

    for (const [key, childValue] of Object.entries(childProps)) {
        const slotValue = (slotProps as Record<string, unknown>)[key];
        if (
            /^on[A-Z]/.test(key) &&
            typeof childValue === 'function' &&
            typeof slotValue === 'function'
        ) {
            merged[key] = (...args: unknown[]) => {
                childValue(...args);
                const event = args[0] as { defaultPrevented?: boolean } | undefined;
                if (!event?.defaultPrevented) slotValue(...args);
            };
        }
    }

    return merged as SlotChildProps;
}
