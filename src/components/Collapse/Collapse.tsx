'use client';

import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';

import {cn} from '../../utils/cn';

export type CollapseProps = {
    open: boolean;
    children: ReactNode;
    animate?: boolean;
    className?: string;
    style?: CSSProperties;
    testId?: string;
};

export function Collapse({
    open,
    children,
    animate = true,
    className,
    style,
    testId,
}: CollapseProps) {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [contentHeight, setContentHeight] = useState<number | null>(null);

    const measure = useCallback(() => {
        const element = contentRef.current;
        if (!element) return;
        const nextHeight = element.scrollHeight;
        setContentHeight((current) => (current === nextHeight ? current : nextHeight));
    }, []);

    useLayoutEffect(() => {
        measure();
    }, [children, measure, open]);

    useLayoutEffect(() => {
        const element = contentRef.current;
        if (!element || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => measure());
        observer.observe(element);
        return () => observer.disconnect();
    }, [measure]);

    return (
        <div
            className={cn('oui-collapse', className)}
            data-state={open ? 'open' : 'closed'}
            data-testid={testId}
            style={{
                height: open ? (contentHeight ?? undefined) : 0,
                transition: animate
                    ? 'height 220ms cubic-bezier(0.22, 1, 0.36, 1)'
                    : 'none',
                ...style,
            }}
        >
            <div ref={contentRef} className='oui-collapse-content'>
                {children}
            </div>
        </div>
    );
}
