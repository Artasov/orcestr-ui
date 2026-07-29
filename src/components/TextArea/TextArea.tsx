'use client';

import { forwardRef, useLayoutEffect, useRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '../../utils/cn.js';
import { composeRefs } from '../../utils/composeRefs.js';
import { splitSystemProps, type SystemProps, type UiSize } from '../../theme/systemProps.js';

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
    SystemProps & {
        size?: UiSize;
        invalid?: boolean;
        autoResize?: boolean;
        testId?: string;
    };

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
    {
        className,
        style,
        size = 2,
        invalid = false,
        autoResize = false,
        value,
        testId,
        children: _children,
        dangerouslySetInnerHTML: _dangerouslySetInnerHTML,
        ...props
    },
    ref,
) {
    const localRef = useRef<HTMLTextAreaElement | null>(null);
    const { systemStyle, restProps } = splitSystemProps(props);

    useLayoutEffect(() => {
        if (!autoResize || !localRef.current) return;
        localRef.current.style.height = 'auto';
        localRef.current.style.height = `${localRef.current.scrollHeight}px`;
    }, [autoResize, value]);

    return (
        <textarea
            ref={composeRefs(ref, localRef)}
            className={cn('oui-text-area', className)}
            data-size={size}
            data-invalid={invalid ? 'true' : undefined}
            data-testid={testId}
            aria-invalid={invalid || undefined}
            value={value}
            style={{ ...systemStyle, ...style }}
            {...restProps}
        />
    );
});
