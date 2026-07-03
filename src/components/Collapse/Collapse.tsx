'use client';

import {type CSSProperties, type ReactNode} from 'react';

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
    return (
        <div
            className={cn('oui-collapse', className)}
            data-state={open ? 'open' : 'closed'}
            data-animate={animate ? 'true' : 'false'}
            data-testid={testId}
            style={{
                gridTemplateRows: open ? '1fr' : '0fr',
                transition: animate
                    ? 'grid-template-rows 220ms cubic-bezier(0.22, 1, 0.36, 1)'
                    : 'none',
                ...style,
            }}
        >
            <div className='oui-collapse-content'>
                {children}
            </div>
        </div>
    );
}
