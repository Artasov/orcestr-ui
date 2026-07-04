'use client';

import { useState } from 'react';
import {
    LuArrowLeft,
    LuArrowLeftRight,
    LuBell,
    LuBox,
    LuBraces,
    LuCalendar,
    LuCheck,
    LuClipboardList,
    LuCog,
    LuEllipsis,
    LuFlaskConical,
    LuHeadphones,
    LuLanguages,
    LuLayoutDashboard,
    LuMessageSquare,
    LuSearch,
    LuSettings,
    LuShield,
    LuSun,
    LuTruck,
} from 'react-icons/lu';

import {
    AppShell,
    AppShellContent,
    AppShellHeader,
    type AppShellSide,
    AppSidebar,
    type AppSidebarGroup,
    type AppSidebarItem,
    Badge,
    Button,
    Flex,
    IconButton,
    IconTextButton,
    Menu,
    PageTitleBlock,
    SpecialModal,
    Stack,
    Text,
    Tooltip,
    type MenuItem,
} from '..';
import { ExampleTile } from './CodePreview';
import { codeSamples, type CodeExample } from './codeSamples';
import { UiExampleSection } from './UiExampleSection';

type ExampleSectionProps = {
    onOpenCode: (example: CodeExample) => void;
};

type AppShellPreviewMode = 'desktop' | 'phone';

export function ApplicationSection({ onOpenCode }: ExampleSectionProps) {
    const [appShellOpen, setAppShellOpen] = useState(false);
    const [appShellPreviewMode, setAppShellPreviewMode] = useState<AppShellPreviewMode>('desktop');
    const [appShellSidebarSide, setAppShellSidebarSide] = useState<AppShellSide>('left');
    const [specialModalOpen, setSpecialModalOpen] = useState(false);
    const [shellMobileOpen, setShellMobileOpen] = useState(false);
    const [shellActiveKey, setShellActiveKey] = useState('requests');
    const [sidebarActiveKey, setSidebarActiveKey] = useState('requests');
    const shellGroups = [
        {
            key: 'demand',
            items: [
                {
                    key: 'overview',
                    label: 'Overview',
                    icon: <LuLayoutDashboard size={17} />,
                    active: shellActiveKey === 'overview',
                },
                {
                    key: 'requests',
                    label: 'Requests',
                    icon: <LuTruck size={17} />,
                    active: shellActiveKey === 'requests',
                },
                {
                    key: 'orders',
                    label: 'Supplier orders',
                    icon: <LuClipboardList size={17} />,
                    active: shellActiveKey === 'orders',
                },
            ],
        },
        {
            key: 'operations',
            items: [
                {
                    key: 'products',
                    label: 'Products',
                    icon: <LuBox size={17} />,
                    active: shellActiveKey === 'products',
                },
                {
                    key: 'calendar',
                    label: 'Calendar',
                    icon: <LuCalendar size={17} />,
                    active: shellActiveKey === 'calendar',
                },
            ],
        },
    ];

    return (
        <>
            <UiExampleSection
                id="app-shell-example"
                title="AppShell"
                description="Application shell primitives for module frames."
            >
                <ExampleTile
                    title="Fullscreen AppShell preview"
                    code={codeSamples.appShell}
                    onOpen={onOpenCode}
                >
                    <IconTextButton
                        icon={<LuLayoutDashboard size={16} />}
                        onClick={() => setAppShellOpen(true)}
                    >
                        Open AppShell preview
                    </IconTextButton>
                </ExampleTile>
                <SpecialModal
                    open={appShellOpen}
                    onOpenChange={setAppShellOpen}
                    size="full"
                    scroll="body"
                    density="compact"
                    contentClassName="oui-ui-app-shell-modal"
                >
                    <SpecialModal.Header className="oui-ui-app-shell-modal-header">
                        <Flex a="c" g={2} minW={0}>
                            <Text fw={760}>AppShell preview</Text>
                        </Flex>
                        <Flex a="c" g={1}>
                            <Button
                                className="oui-ui-app-shell-mode-toggle"
                                size={2}
                                v="surface"
                                onClick={() => {
                                    setShellMobileOpen(false);
                                    setAppShellPreviewMode((mode) =>
                                        mode === 'desktop' ? 'phone' : 'desktop',
                                    );
                                }}
                            >
                                {appShellPreviewMode === 'desktop' ? 'Phone view' : 'Desktop view'}
                            </Button>
                            <SpecialModal.Close />
                        </Flex>
                    </SpecialModal.Header>
                    <SpecialModal.Body className="oui-ui-app-shell-modal-body">
                        <div
                            className="oui-ui-app-shell-preview-stage"
                            data-mode={appShellPreviewMode}
                        >
                            <DemoAppShellPreview
                                mode={appShellPreviewMode}
                                mobileOpen={shellMobileOpen}
                                onMobileOpenChange={setShellMobileOpen}
                                sidebarSide={appShellSidebarSide}
                                onToggleSidebarSide={() =>
                                    setAppShellSidebarSide((side) =>
                                        side === 'left' ? 'right' : 'left',
                                    )
                                }
                                groups={shellGroups}
                                onNavigate={(item) => setShellActiveKey(item.key)}
                            />
                        </div>
                    </SpecialModal.Body>
                </SpecialModal>
            </UiExampleSection>

            <UiExampleSection
                id="app-sidebar-example"
                title="AppSidebar"
                description="Deliveries-style sidebar with active indicator and footer actions."
            >
                <ExampleTile title="AppSidebar" code={codeSamples.appSidebar} onOpen={onOpenCode}>
                    <div className="oui-ui-app-sidebar-demo">
                        <AppSidebar
                            header={
                                <>
                                    <div className="oui-app-sidebar-brand">
                                        <span className="oui-app-sidebar-logo">
                                            <span className="oui-ui-demo-logo">O</span>
                                        </span>
                                        <span className="oui-app-sidebar-title">Deliveries</span>
                                    </div>
                                    <div className="oui-app-sidebar-actions">
                                        <IconButton
                                            size={2}
                                            v="ghost"
                                            icon={<LuEllipsis size={16} />}
                                            aria-label="Sidebar actions"
                                        />
                                    </div>
                                </>
                            }
                            itemH={38}
                            onNavigate={(item) => setSidebarActiveKey(item.key)}
                            groups={[
                                {
                                    key: 'main',
                                    items: [
                                        {
                                            key: 'overview',
                                            label: 'Overview',
                                            icon: <LuLayoutDashboard size={17} />,
                                            active: sidebarActiveKey === 'overview',
                                        },
                                        {
                                            key: 'requests',
                                            label: 'Requests',
                                            icon: <LuTruck size={17} />,
                                            active: sidebarActiveKey === 'requests',
                                        },
                                        {
                                            key: 'orders',
                                            label: 'Supplier orders',
                                            icon: <LuClipboardList size={17} />,
                                            active: sidebarActiveKey === 'orders',
                                        },
                                    ],
                                },
                                {
                                    key: 'inventory',
                                    items: [
                                        {
                                            key: 'products',
                                            label: 'Products',
                                            icon: <LuBox size={17} />,
                                            active: sidebarActiveKey === 'products',
                                        },
                                        {
                                            key: 'calendar',
                                            label: 'Calendar',
                                            icon: <LuCalendar size={17} />,
                                            disabled: true,
                                        },
                                    ],
                                },
                            ]}
                            footer={
                                <Flex col g={2}>
                                    <Flex g={1} a="c">
                                        <IconButton
                                            size={2}
                                            v="ghost"
                                            icon={<LuBell size={15} />}
                                            badge={64}
                                            aria-label="Notifications"
                                        />
                                        <IconButton
                                            size={2}
                                            v="ghost"
                                            icon={<LuSettings size={15} />}
                                            aria-label="Settings"
                                        />
                                        <IconButton
                                            size={2}
                                            v="ghost"
                                            icon={<LuCog size={15} />}
                                            aria-label="Developer tools"
                                        />
                                    </Flex>
                                    <Text fs="12px" tone="muted">
                                        Admin workspace
                                    </Text>
                                </Flex>
                            }
                        />
                    </div>
                </ExampleTile>
            </UiExampleSection>

            <UiExampleSection
                id="special-modal-example"
                title="SpecialModal"
                description="Large entity modal shell for rich operational dialogs."
            >
                <ExampleTile
                    title="SpecialModal"
                    code={codeSamples.specialModal}
                    onOpen={onOpenCode}
                >
                    <Button onClick={() => setSpecialModalOpen(true)}>Open special modal</Button>
                </ExampleTile>
                <SpecialModal
                    open={specialModalOpen}
                    onOpenChange={setSpecialModalOpen}
                    size="lg"
                    scroll="body"
                >
                    <SpecialModal.Header
                        title="Request PR-2026-0900"
                        meta={
                            <Flex g={2} a="c" wrap>
                                <Badge tone="success">Closed</Badge>
                                <Badge tone="neutral">RUB</Badge>
                            </Flex>
                        }
                        actions={<SpecialModal.Close />}
                    />
                    <SpecialModal.Body>
                        <Stack g={3}>
                            <Flex g={4} wrap>
                                <Stack g={0} w="min(100%, 220px)">
                                    <Text fs="12px" tone="muted">
                                        Supplier
                                    </Text>
                                    <Text fw={760}>Northwind Trading LLC</Text>
                                </Stack>
                                <Stack g={0} w="min(100%, 180px)">
                                    <Text fs="12px" tone="muted">
                                        Plan arrival
                                    </Text>
                                    <Text fw={760}>25.06.2026</Text>
                                </Stack>
                            </Flex>
                            <TableLikePreview />
                        </Stack>
                    </SpecialModal.Body>
                    <SpecialModal.Footer>
                        <Flex g={2} j="e" w="100%">
                            <Button v="surface" onClick={() => setSpecialModalOpen(false)}>
                                Close
                            </Button>
                            <Button>Save</Button>
                        </Flex>
                    </SpecialModal.Footer>
                </SpecialModal>
            </UiExampleSection>
        </>
    );
}

function DemoAppShellPreview({
    mode,
    mobileOpen,
    onMobileOpenChange,
    sidebarSide,
    onToggleSidebarSide,
    groups,
    onNavigate,
}: {
    mode: AppShellPreviewMode;
    mobileOpen: boolean;
    onMobileOpenChange: (open: boolean) => void;
    sidebarSide: AppShellSide;
    onToggleSidebarSide: () => void;
    groups: readonly AppSidebarGroup[];
    onNavigate: (item: AppSidebarItem) => void;
}) {
    const isPhone = mode === 'phone';
    const isRight = sidebarSide === 'right';
    return (
        <AppShell
            className="oui-ui-app-shell-preview"
            sidebarMode={isPhone ? 'mobile' : 'desktop'}
            sidebarSide={sidebarSide}
            sidebarWidth={300}
            maxWidth="100%"
            contentInset={0}
            sidebarOpen={mobileOpen}
            desktopSidebarOpen
            onSidebarOpenChange={onMobileOpenChange}
            header={
                <AppShellHeader
                    visibility="always"
                    sidebarOpen={mobileOpen}
                    onSidebarOpenChange={onMobileOpenChange}
                    navigationVisibility="mobile"
                    actions={<DemoHeaderActions />}
                />
            }
            sidebar={
                <AppSidebar
                    side={sidebarSide}
                    header={
                        <>
                            <DemoShellBrand />
                            <div className="oui-app-sidebar-actions">
                                <Tooltip content="Back">
                                    <IconButton
                                        size={2}
                                        v="ghost"
                                        icon={<LuArrowLeft size={17} />}
                                        aria-label="Back"
                                    />
                                </Tooltip>
                                <Tooltip
                                    content={isRight ? 'Move sidebar left' : 'Move sidebar right'}
                                >
                                    <IconButton
                                        size={2}
                                        v="ghost"
                                        icon={<LuArrowLeftRight size={17} />}
                                        aria-label={
                                            isRight ? 'Move sidebar left' : 'Move sidebar right'
                                        }
                                        onClick={onToggleSidebarSide}
                                    />
                                </Tooltip>
                                <IconButton
                                    size={2}
                                    v="ghost"
                                    icon={<LuEllipsis size={16} />}
                                    aria-label="Sidebar actions"
                                />
                            </div>
                        </>
                    }
                    itemH={38}
                    onNavigate={onNavigate}
                    groups={groups}
                    footer={<DemoSidebarFooter />}
                />
            }
        >
            <AppShellContent scroll={false}>
                <PageTitleBlock
                    title="Requests"
                    caption="Module workspace with responsive header and AppSidebar navigation."
                    action={
                        <IconButton
                            size={2}
                            v="pad"
                            icon={<LuEllipsis size={16} />}
                            aria-label="More actions"
                        />
                    }
                />
                <TableLikePreview />
            </AppShellContent>
        </AppShell>
    );
}

function DemoShellBrand() {
    return (
        <div className="oui-app-sidebar-brand">
            <span className="oui-app-sidebar-logo">
                <span className="oui-ui-demo-logo">O</span>
            </span>
            <span className="oui-app-sidebar-title">Deliveries</span>
        </div>
    );
}

function DemoHeaderActions() {
    const [locale, setLocale] = useState<'ru' | 'en'>('en');
    const languageItems: MenuItem[] = [
        {
            key: 'ru',
            label: 'RU',
            icon: locale === 'ru' ? <LuCheck size={14} /> : undefined,
            onSelect: () => setLocale('ru'),
        },
        {
            key: 'en',
            label: 'EN',
            icon: locale === 'en' ? <LuCheck size={14} /> : undefined,
            onSelect: () => setLocale('en'),
        },
    ];

    return (
        <Flex className="oui-ui-app-shell-header-actions-demo" a="c" g={1}>
            <IconTextButton
                className="oui-ui-app-shell-quick-jump"
                size={2}
                v="soft"
                tone="neutral"
                icon={<LuSearch size={14} />}
            >
                Quick jump
            </IconTextButton>
            <IconButton
                size={2}
                v="ghost"
                icon={<LuBell size={18} />}
                badge={64}
                aria-label="Notifications"
            />
            <IconButton
                size={2}
                v="ghost"
                icon={<LuMessageSquare size={18} />}
                badge={99}
                aria-label="Messages"
            />
            <Menu
                align="end"
                items={languageItems}
                trigger={
                    <IconButton
                        size={2}
                        v="ghost"
                        icon={<LuLanguages size={18} />}
                        aria-label={`Language: ${locale.toUpperCase()}`}
                    />
                }
            />
            <IconButton size={2} v="ghost" icon={<LuSun size={18} />} aria-label="Theme" />
            <IconButton size={2} v="ghost" icon={<LuShield size={18} />} aria-label="Admin" />
        </Flex>
    );
}

function DemoSidebarFooter() {
    return (
        <Flex col g={2}>
            <Flex g={1} a="c">
                <IconButton
                    size={2}
                    v="ghost"
                    icon={<LuHeadphones size={15} />}
                    aria-label="Support"
                />
                <IconButton
                    size={2}
                    v="ghost"
                    icon={<LuBell size={15} />}
                    badge={64}
                    aria-label="Notifications"
                />
                <IconButton
                    size={2}
                    v="ghost"
                    icon={<LuSettings size={15} />}
                    aria-label="Settings"
                />
                <IconButton
                    size={2}
                    v="ghost"
                    icon={<LuFlaskConical size={15} />}
                    aria-label="Demo data"
                />
                <IconButton size={2} v="ghost" icon={<LuBraces size={15} />} aria-label="API" />
            </Flex>
            <Text fs="12px" tone="muted">
                Admin workspace
            </Text>
        </Flex>
    );
}

function TableLikePreview() {
    return (
        <div className="oui-ui-application-table-preview">
            {['Brand', 'Name', 'Article', 'Qty', 'Price'].map((item) => (
                <Text key={item} fs="12px" fw={760}>
                    {item}
                </Text>
            ))}
            {['Stalex', 'Lathe machine', 'LATHE-8191', '22', '1250'].map((item) => (
                <Text key={item} fs="13px">
                    {item}
                </Text>
            ))}
        </div>
    );
}
