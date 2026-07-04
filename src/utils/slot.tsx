import {
    cloneElement,
    isValidElement,
    type CSSProperties,
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

    return cloneElement(child, {
        ...restProps,
        ref: composeRefs(child.props.ref, ref),
        className: cn(className, child.props.className),
        style: {
            ...style,
            ...child.props.style,
        },
    });
}
