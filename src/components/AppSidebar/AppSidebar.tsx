'use client';

import {
    forwardRef,
    useCallback,
    useLayoutEffect,
    useRef,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type ElementType,
    type ReactNode,
} from 'react';

import { splitSystemProps, type SystemProps } from '../../theme/systemProps';
import { cn } from '../../utils/cn';
import { ScrollArea } from '../ScrollArea/ScrollArea';
import { Separator } from '../Separator/Separator';

export type AppSidebarSide = 'left' | 'right';

export type AppSidebarItem = {
    key: string;
    label: ReactNode;
    icon?: ReactNode;
    href?: string;
    component?: ElementType;
    active?: boolean;
    disabled?: boolean;
    onSelect?: () => void;
};

export type AppSidebarGroup = {
    key: string;
    items: readonly AppSidebarItem[];
};

export type AppSidebarProps = Omit<ComponentPropsWithoutRef<'aside'>, 'title'> &
    SystemProps & {
        header?: ReactNode;
        groups: readonly AppSidebarGroup[];
        footer?: ReactNode;
        side?: AppSidebarSide;
        itemH?: number;
        onNavigate?: (item: AppSidebarItem) => void;
        testId?: string;
    };

export const AppSidebar = forwardRef<HTMLElement, AppSidebarProps>(function AppSidebar(
    {
        className,
        style,
        header,
        groups,
        footer,
        side = 'left',
        itemH = 40,
        onNavigate,
        testId,
        ...props
    },
    ref,
) {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const indicatorRef = useRef<HTMLDivElement | null>(null);
    const indicatorPlacedRef = useRef(false);
    const transitionFrameRef = useRef(0);
    const activeKey = groups.flatMap((group) => group.items).find((item) => item.active)?.key;
    const { systemStyle, restProps } = splitSystemProps(props);
    const sidebarStyle = {
        '--oui-app-sidebar-item-h': `${itemH}px`,
        ...systemStyle,
        ...style,
    } as CSSProperties;

    const updateActiveIndicator = useCallback((animate = true) => {
        const root = contentRef.current;
        const indicator = indicatorRef.current;
        const activeItem = root?.querySelector<HTMLElement>('[data-sidebar-active="true"]');
        if (!root || !indicator || !activeItem) {
            if (indicator) indicator.style.opacity = '0';
            return;
        }

        const itemHeight = activeItem.offsetHeight;
        if (itemHeight <= 0) {
            indicator.style.opacity = '0';
            return;
        }

        const skipTransition = !indicatorPlacedRef.current || !animate;
        if (skipTransition) {
            cancelAnimationFrame(transitionFrameRef.current);
            indicator.style.transition = 'none';
        }

        indicator.style.height = `${itemHeight}px`;
        indicator.style.transform = `translateY(${sidebarItemOffsetTop(root, activeItem)}px)`;
        indicator.style.opacity = '1';

        if (skipTransition) {
            indicatorPlacedRef.current = true;
            indicator.getBoundingClientRect();
            transitionFrameRef.current = requestAnimationFrame(() => {
                indicator.style.transition = '';
            });
        }
    }, []);

    useLayoutEffect(() => {
        const root = contentRef.current;
        const indicator = indicatorRef.current;
        if (!root || !indicator) {
            if (indicator) indicator.style.opacity = '0';
            return;
        }

        if (indicatorPlacedRef.current) {
            indicator.style.transition = '';
        }

        if (!indicatorPlacedRef.current) {
            updateActiveIndicator(false);
        }

        let frame = 0;
        let nextFrame = 0;
        const scheduleUpdate = () => {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(nextFrame);
            frame = requestAnimationFrame(() => {
                nextFrame = requestAnimationFrame(() => updateActiveIndicator());
            });
        };
        scheduleUpdate();

        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(scheduleUpdate);
            resizeObserver.observe(root);
            const activeItem = root.querySelector<HTMLElement>('[data-sidebar-active="true"]');
            if (activeItem) resizeObserver.observe(activeItem);
        }
        window.addEventListener('resize', scheduleUpdate);

        return () => {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(nextFrame);
            cancelAnimationFrame(transitionFrameRef.current);
            indicator.style.transition = '';
            resizeObserver?.disconnect();
            window.removeEventListener('resize', scheduleUpdate);
        };
    }, [activeKey, groups, updateActiveIndicator]);

    return (
        <aside
            ref={ref}
            className={cn('oui-app-sidebar', className)}
            data-side={side}
            data-testid={testId}
            style={sidebarStyle}
            {...restProps}
        >
            {header ? <div className="oui-app-sidebar-head">{header}</div> : null}

            <ScrollArea type="auto" scrollbars="vertical" className="oui-app-sidebar-scroll">
                <div ref={contentRef} className="oui-app-sidebar-content">
                    <div ref={indicatorRef} className="oui-app-sidebar-indicator" />
                    <div className="oui-app-sidebar-groups">
                        {groups.map((group, index) => (
                            <div className="oui-app-sidebar-group" key={group.key}>
                                {index > 0 ? (
                                    <Separator className="oui-app-sidebar-separator" />
                                ) : null}
                                <nav className="oui-app-sidebar-nav">
                                    {group.items.map((item) => (
                                        <AppSidebarNavItem
                                            key={item.key}
                                            item={item}
                                            onNavigate={onNavigate}
                                        />
                                    ))}
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>

            {footer ? (
                <>
                    <Separator className="oui-app-sidebar-footer-separator" />
                    <div className="oui-app-sidebar-footer">{footer}</div>
                </>
            ) : null}
        </aside>
    );
});

function sidebarItemOffsetTop(root: HTMLElement, item: HTMLElement) {
    let top = 0;
    let node: HTMLElement | null = item;

    while (node && node !== root) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
    }

    return node === root ? top : item.offsetTop;
}

function AppSidebarNavItem({
    item,
    onNavigate,
}: {
    item: AppSidebarItem;
    onNavigate?: (item: AppSidebarItem) => void;
}) {
    const content = (
        <>
            {item.icon ? <span className="oui-app-sidebar-item-icon">{item.icon}</span> : null}
            <span className="oui-app-sidebar-item-label">{item.label}</span>
        </>
    );
    const commonProps = {
        className: 'oui-app-sidebar-item',
        'data-sidebar-active': item.active ? 'true' : undefined,
        'aria-current': item.active ? ('page' as const) : undefined,
        onClick: () => {
            item.onSelect?.();
            onNavigate?.(item);
        },
    };

    if (item.href && !item.disabled) {
        const LinkComponent = item.component ?? 'a';
        return (
            <LinkComponent href={item.href} {...commonProps}>
                {content}
            </LinkComponent>
        );
    }

    return (
        <button type="button" disabled={item.disabled} {...commonProps}>
            {content}
        </button>
    );
}
