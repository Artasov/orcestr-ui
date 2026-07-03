'use client';

import {
    forwardRef,
    useLayoutEffect,
    useRef,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type ElementType,
    type ReactNode,
} from 'react';

import {splitSystemProps, type SystemProps} from '../../theme/systemProps';
import {cn} from '../../utils/cn';
import {ScrollArea} from '../ScrollArea/ScrollArea';
import {Separator} from '../Separator/Separator';

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
    const activeKey = groups
        .flatMap((group) => group.items)
        .find((item) => item.active)?.key;
    const {systemStyle, restProps} = splitSystemProps(props);
    const sidebarStyle = {
        '--oui-app-sidebar-item-h': `${itemH}px`,
        ...systemStyle,
        ...style,
    } as CSSProperties;

    useLayoutEffect(() => {
        const root = contentRef.current;
        const indicator = indicatorRef.current;
        const activeItem = root?.querySelector<HTMLElement>('[data-sidebar-active="true"]');
        if (!root || !indicator || !activeItem) {
            if (indicator) indicator.style.opacity = '0';
            return;
        }

        const rootRect = root.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        indicator.style.height = `${itemRect.height}px`;
        indicator.style.transform = `translateY(${itemRect.top - rootRect.top}px)`;
        indicator.style.opacity = '1';
    }, [activeKey, groups]);

    return (
        <aside
            ref={ref}
            className={cn('oui-app-sidebar', className)}
            data-side={side}
            data-testid={testId}
            style={sidebarStyle}
            {...restProps}
        >
            {header ? <div className='oui-app-sidebar-head'>{header}</div> : null}

            <ScrollArea
                type='auto'
                scrollbars='vertical'
                className='oui-app-sidebar-scroll'
            >
                <div ref={contentRef} className='oui-app-sidebar-content'>
                    <div ref={indicatorRef} className='oui-app-sidebar-indicator' />
                    <div className='oui-app-sidebar-groups'>
                        {groups.map((group, index) => (
                            <div className='oui-app-sidebar-group' key={group.key}>
                                {index > 0 ? (
                                    <Separator className='oui-app-sidebar-separator' />
                                ) : null}
                                <nav className='oui-app-sidebar-nav'>
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
                    <Separator className='oui-app-sidebar-footer-separator' />
                    <div className='oui-app-sidebar-footer'>{footer}</div>
                </>
            ) : null}
        </aside>
    );
});

function AppSidebarNavItem({
    item,
    onNavigate,
}: {
    item: AppSidebarItem;
    onNavigate?: (item: AppSidebarItem) => void;
}) {
    const content = (
        <>
            {item.icon ? <span className='oui-app-sidebar-item-icon'>{item.icon}</span> : null}
            <span className='oui-app-sidebar-item-label'>{item.label}</span>
        </>
    );
    const commonProps = {
        className: 'oui-app-sidebar-item',
        'data-sidebar-active': item.active ? 'true' : undefined,
        'aria-current': item.active ? 'page' as const : undefined,
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
        <button type='button' disabled={item.disabled} {...commonProps}>
            {content}
        </button>
    );
}
