'use client';

import {
    forwardRef,
    useEffect,
    useState,
    type ComponentPropsWithoutRef,
    type CSSProperties,
    type ReactNode,
} from 'react';
import {LuMenu, LuX} from 'react-icons/lu';

import {useOrcestrUiLocale} from '../../locale/LocaleProvider';
import {splitSystemProps, type SystemProps} from '../../theme/systemProps';
import {cn} from '../../utils/cn';
import {Badge} from '../Badge/Badge';
import {Drawer} from '../Drawer/Drawer';
import {IconButton} from '../IconButton/IconButton';
import {ScrollArea} from '../ScrollArea/ScrollArea';
import {Separator} from '../Separator/Separator';
import {Text} from '../Text/Text';

export type AppShellNavItem = {
    key: string;
    label: ReactNode;
    caption?: ReactNode;
    icon?: ReactNode;
    badge?: ReactNode;
    active?: boolean;
    disabled?: boolean;
    href?: string;
    onSelect?: () => void;
};

export type AppShellProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        sidebar: ReactNode;
        header?: ReactNode;
        sidebarOpen?: boolean;
        onSidebarOpenChange?: (open: boolean) => void;
        sidebarWidth?: number | string;
        maxWidth?: number | string;
        contentInset?: number | string;
        testId?: string;
    };

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
    {
        className,
        style,
        sidebar,
        header,
        sidebarOpen = false,
        onSidebarOpenChange,
        sidebarWidth = 260,
        maxWidth = 1440,
        contentInset = 28,
        children,
        testId,
        ...props
    },
    ref,
) {
    const [drawerMode, setDrawerMode] = useState(false);
    const {systemStyle, restProps} = splitSystemProps(props);
    const shellStyle = {
        '--oui-app-shell-sidebar-width': shellSizeValue(sidebarWidth),
        '--oui-app-shell-max-width': shellSizeValue(maxWidth),
        '--oui-app-shell-inset': shellSizeValue(contentInset),
        ...systemStyle,
        ...style,
    } as CSSProperties;

    useEffect(() => {
        const media = window.matchMedia('(max-width: 860px)');
        const update = () => setDrawerMode(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    return (
        <div
            ref={ref}
            className={cn('oui-app-shell', className)}
            data-sidebar-open={sidebarOpen ? 'true' : 'false'}
            data-testid={testId}
            style={shellStyle}
            {...restProps}
        >
            {header}
            <div className='oui-app-shell-frame'>
                {!drawerMode ? (
                    <div className='oui-app-shell-sidebar-desktop'>
                        {sidebar}
                    </div>
                ) : null}
                {drawerMode ? (
                    <Drawer
                        open={sidebarOpen}
                        onOpenChange={(nextOpen) => onSidebarOpenChange?.(nextOpen)}
                        side='left'
                        size={sidebarWidth}
                        showCloseButton={false}
                        panelClassName='oui-app-shell-sidebar-drawer-panel'
                        bodyClassName='oui-app-shell-sidebar-drawer-body'
                        testId={testId ? `${testId}-sidebar-drawer` : undefined}
                    >
                        {sidebar}
                    </Drawer>
                ) : null}
                <main className='oui-app-shell-main'>{children}</main>
            </div>
        </div>
    );
});

export type AppShellHeaderProps = Omit<ComponentPropsWithoutRef<'header'>, 'title'> &
    SystemProps & {
        title?: ReactNode;
        actions?: ReactNode;
        sidebarOpen?: boolean;
        onSidebarOpenChange?: (open: boolean) => void;
        navigationLabel?: string;
        visibility?: 'always' | 'mobile';
        testId?: string;
    };

export const AppShellHeader = forwardRef<HTMLElement, AppShellHeaderProps>(
    function AppShellHeader(
        {
            className,
            style,
            title,
            actions,
            sidebarOpen = false,
            onSidebarOpenChange,
            navigationLabel,
            visibility = 'always',
            children,
            testId,
            ...props
        },
        ref,
    ) {
        const {copy} = useOrcestrUiLocale();
        const actualNavigationLabel =
            navigationLabel ??
            (sidebarOpen ? copy.common.closeNavigation : copy.common.openNavigation);
        const {systemStyle, restProps} = splitSystemProps(props);
        return (
            <header
                ref={ref}
                className={cn('oui-app-shell-header', className)}
                data-visibility={visibility}
                data-testid={testId}
                style={{...systemStyle, ...style}}
                {...restProps}
            >
                {onSidebarOpenChange ? (
                    <IconButton
                        v='pad'
                        icon={sidebarOpen ? <LuX size={19} /> : <LuMenu size={19} />}
                        aria-label={actualNavigationLabel}
                        aria-expanded={sidebarOpen}
                        onClick={() => onSidebarOpenChange(!sidebarOpen)}
                    />
                ) : null}
                {title ? <div className='oui-app-shell-header-title'>{title}</div> : null}
                {children}
                {actions ? <div className='oui-app-shell-header-actions'>{actions}</div> : null}
            </header>
        );
    },
);

export type AppShellSidebarProps = Omit<ComponentPropsWithoutRef<'aside'>, 'title'> &
    SystemProps & {
        title?: ReactNode;
        description?: ReactNode;
        footer?: ReactNode;
        onClose?: () => void;
        closeLabel?: string;
        testId?: string;
    };

export const AppShellSidebar = forwardRef<HTMLElement, AppShellSidebarProps>(
    function AppShellSidebar(
        {
            className,
            style,
            title,
            description,
            footer,
            onClose,
            closeLabel,
            children,
            testId,
            ...props
        },
        ref,
    ) {
        const {copy} = useOrcestrUiLocale();
        const {systemStyle, restProps} = splitSystemProps(props);
        return (
            <aside
                ref={ref}
                className={cn('oui-app-shell-sidebar', className)}
                data-testid={testId}
                style={{...systemStyle, ...style}}
                {...restProps}
            >
                {title || description || onClose ? (
                    <div className='oui-app-shell-sidebar-head'>
                        <div className='oui-app-shell-sidebar-head-main'>
                            {title ? (
                                <div className='oui-app-shell-sidebar-title'>{title}</div>
                            ) : null}
                            {description ? (
                                <Text
                                    className='oui-app-shell-sidebar-description'
                                    color='var(--oui-muted)'
                                    fs='13px'
                                    lh={1.45}
                                >
                                    {description}
                                </Text>
                            ) : null}
                        </div>
                        {onClose ? (
                            <IconButton
                                className='oui-app-shell-sidebar-close'
                                v='ghost'
                                icon={<LuX size={18} />}
                                aria-label={closeLabel ?? copy.common.closeNavigation}
                                onClick={onClose}
                            />
                        ) : null}
                    </div>
                ) : null}
                {(title || description) && children ? (
                    <Separator className='oui-app-shell-sidebar-separator' />
                ) : null}
                <ScrollArea
                    className='oui-app-shell-sidebar-scroll'
                    highlights
                    highlightH={52}
                    highlightColor='var(--oui-app-shell-sidebar-highlight-bg)'
                    highlightTop={{
                        start: 50,
                        fadeDistance: 200,
                        maxOpacity: 0.92,
                    }}
                    highlightBottom={{
                        start: 16,
                        fadeDistance: 140,
                        maxOpacity: 0.92,
                    }}
                >
                    <div className='oui-app-shell-sidebar-body'>{children}</div>
                </ScrollArea>
                {footer ? <div className='oui-app-shell-sidebar-footer'>{footer}</div> : null}
            </aside>
        );
    },
);

export type AppShellContentProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        scroll?: boolean;
        testId?: string;
    };

export const AppShellContent = forwardRef<HTMLDivElement, AppShellContentProps>(
    function AppShellContent(
        {className, style, scroll = true, children, testId, ...props},
        ref,
    ) {
        const {systemStyle, restProps} = splitSystemProps(props);
        const content = (
            <div
                ref={ref}
                className={cn('oui-app-shell-content', className)}
                data-testid={testId}
                style={{...systemStyle, ...style}}
                {...restProps}
            >
                {children}
            </div>
        );

        if (!scroll) return content;
        return (
            <ScrollArea
                className='oui-app-shell-content-scroll'
                highlights
                highlightH={52}
                highlightColor='var(--oui-bg)'
                highlightTop={{
                    start: 50,
                    fadeDistance: 200,
                    maxOpacity: 0.94,
                }}
                highlightBottom={{
                    start: 16,
                    fadeDistance: 140,
                    maxOpacity: 0.94,
                }}
            >
                {content}
            </ScrollArea>
        );
    },
);

export type AppShellNavProps = ComponentPropsWithoutRef<'nav'> &
    SystemProps & {
        items: AppShellNavItem[];
        onNavigate?: (item: AppShellNavItem) => void;
        label?: string;
        testId?: string;
    };

export const AppShellNav = forwardRef<HTMLElement, AppShellNavProps>(
    function AppShellNav(
        {
            className,
            style,
            items,
            onNavigate,
            label,
            testId,
            ...props
        },
        ref,
    ) {
        const {copy} = useOrcestrUiLocale();
        const {systemStyle, restProps} = splitSystemProps(props);
        return (
            <nav
                ref={ref}
                className={cn('oui-app-shell-nav', className)}
                aria-label={label ?? copy.common.primaryNavigation}
                data-testid={testId}
                style={{...systemStyle, ...style}}
                {...restProps}
            >
                {items.map((item) => (
                    <AppShellNavButton
                        key={item.key}
                        item={item}
                        onNavigate={onNavigate}
                        testId={testId ? `${testId}-${item.key}` : undefined}
                    />
                ))}
            </nav>
        );
    },
);

export type PageTitleBlockProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        title: ReactNode;
        caption?: ReactNode;
        action?: ReactNode;
        badge?: ReactNode;
        testId?: string;
    };

export const PageTitleBlock = forwardRef<HTMLDivElement, PageTitleBlockProps>(
    function PageTitleBlock(
        {className, style, title, caption, action, badge, testId, ...props},
        ref,
    ) {
        const {systemStyle, restProps} = splitSystemProps(props);
        return (
            <div
                ref={ref}
                className={cn('oui-page-title-block', className)}
                data-testid={testId}
                style={{...systemStyle, ...style}}
                {...restProps}
            >
                <div className='oui-page-title-main'>
                    <div className='oui-page-title-row'>
                        <h1 className='oui-page-title'>{title}</h1>
                        {badge ? <Badge tone='brand'>{badge}</Badge> : null}
                    </div>
                    {caption ? <p className='oui-page-title-caption'>{caption}</p> : null}
                </div>
                {action ? <div className='oui-page-title-actions'>{action}</div> : null}
            </div>
        );
    },
);

function AppShellNavButton({
    item,
    onNavigate,
    testId,
}: {
    item: AppShellNavItem;
    onNavigate?: (item: AppShellNavItem) => void;
    testId?: string;
}) {
    const content = (
        <>
            {item.icon ? <span className='oui-app-shell-nav-icon'>{item.icon}</span> : null}
            <span className='oui-app-shell-nav-text'>
                <span className='oui-app-shell-nav-label'>{item.label}</span>
                {item.caption ? (
                    <span className='oui-app-shell-nav-caption'>{item.caption}</span>
                ) : null}
            </span>
            {item.badge ? <span className='oui-app-shell-nav-badge'>{item.badge}</span> : null}
        </>
    );
    const commonProps = {
        className: 'oui-app-shell-nav-item',
        'data-active': item.active ? 'true' : undefined,
        'data-testid': testId,
        'aria-current': item.active ? 'page' as const : undefined,
        onClick: () => {
            item.onSelect?.();
            onNavigate?.(item);
        },
    };

    if (item.href && !item.disabled) {
        return (
            <a href={item.href} {...commonProps}>
                {content}
            </a>
        );
    }

    return (
        <button type='button' disabled={item.disabled} {...commonProps}>
            {content}
        </button>
    );
}

function shellSizeValue(value: number | string): string {
    return typeof value === 'number' ? `${value}px` : value;
}
