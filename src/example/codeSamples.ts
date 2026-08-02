export type CodeExample = {
    title: string;
    code: string;
};

export const codeSamples = {
    text: `import {Badge, Box, Flex, Stack, Text} from '@orcestr/ui';

<Stack g={3}>
    <Stack g={1}>
        <Text as='h1' fs='28px' fw={780} lh={1.1}>
            Operations review
        </Text>
        <Text as='h2' fs='20px' fw={720} lh={1.2}>
            Review window and status
        </Text>
        <Text tone='muted' fs='13px' lh={1.5}>
            Compact operational text with muted metadata.
        </Text>
    </Stack>

    <Stack g={1}>
        <Text fs='15px' fw={700}>Body strong text</Text>
        <Text fs='14px' lh={1.55}>Body regular text.</Text>
        <Text fs='12px' tone='muted' lh={1.4}>Caption text.</Text>
    </Stack>

    <Flex g={2} wrap>
        <Text tone='primary' fw={700}>Primary</Text>
        <Text tone='success' fw={700}>Success</Text>
        <Text tone='warning' fw={700}>Warning</Text>
        <Text tone='danger' fw={700}>Danger</Text>
        <Text tone='info' fw={700}>Info</Text>
    </Flex>

    <Box w='100%' p={2} r={3} style={{background: 'var(--oui-pad-bg)'}}>
        <Text display='block' truncate>
            This is a long single line value that truncates cleanly inside a constrained row.
        </Text>
    </Box>

    <Flex g={2} wrap>
        <Badge>Neutral</Badge>
        <Badge tone='primary'>Primary</Badge>
        <Badge tone='success'>Success</Badge>
        <Badge tone='warning'>Warning</Badge>
        <Badge tone='danger'>Danger</Badge>
        <Badge tone='info'>Info</Badge>
    </Flex>
</Stack>`,
    skeleton: `import {Skeleton, Stack} from '@orcestr/ui';

<Stack g={2}>
    <Skeleton h={16} w='80%' />
    <Skeleton h={16} w='64%' />
    <Skeleton h={36} />
</Stack>`,
    appShell: `import {useState} from 'react';
import {
    AppShell,
    AppShellContent,
    AppShellHeader,
    type AppShellSide,
    AppSidebar,
    Button,
    Flex,
    IconButton,
    IconTextButton,
    Menu,
    PageTitleBlock,
    SpecialModal,
    Tooltip,
    type MenuItem,
} from '@orcestr/ui';
import {LuArrowLeft, LuArrowLeftRight, LuBell, LuBox, LuCalendar, LuCheck, LuClipboardList, LuEllipsis, LuLanguages, LuMessageSquare, LuSearch, LuTruck} from 'react-icons/lu';

const [open, setOpen] = useState(false);
const [mobileOpen, setMobileOpen] = useState(false);
const [previewMode, setPreviewMode] = useState<'desktop' | 'phone'>('desktop');
const [sidebarSide, setSidebarSide] = useState<AppShellSide>('left');
const [activeKey, setActiveKey] = useState('requests');
const [locale, setLocale] = useState<'ru' | 'en'>('en');
const isPhone = previewMode === 'phone';
const isRight = sidebarSide === 'right';
const toggleSidebarSide = () => {
    setSidebarSide((side) => side === 'left' ? 'right' : 'left');
};

const groups = [
    {
        key: 'demand',
        items: [
            {key: 'requests', label: 'Requests', icon: <LuTruck />, active: activeKey === 'requests'},
            {key: 'orders', label: 'Supplier orders', icon: <LuClipboardList />, active: activeKey === 'orders'},
        ],
    },
    {
        key: 'inventory',
        items: [
            {key: 'products', label: 'Products', icon: <LuBox />, active: activeKey === 'products'},
            {key: 'calendar', label: 'Calendar', icon: <LuCalendar />, active: activeKey === 'calendar'},
        ],
    },
];
const languageItems: MenuItem[] = [
    {key: 'ru', label: 'RU', icon: locale === 'ru' ? <LuCheck /> : undefined, onSelect: () => setLocale('ru')},
    {key: 'en', label: 'EN', icon: locale === 'en' ? <LuCheck /> : undefined, onSelect: () => setLocale('en')},
];

<>
    <Button onClick={() => setOpen(true)}>Open AppShell preview</Button>
    <SpecialModal open={open} onOpenChange={setOpen} size='full' scroll='body'>
        <SpecialModal.Header
            title='AppShell preview'
            actions={(
                <>
                    <Button size={2} v='surface' onClick={() => setPreviewMode((mode) => mode === 'desktop' ? 'phone' : 'desktop')}>
                        Toggle preview
                    </Button>
                    <SpecialModal.Close />
                </>
            )}
        />
        <SpecialModal.Body>
            <AppShell
                sidebarMode={isPhone ? 'mobile' : 'desktop'}
                sidebarSide={sidebarSide}
                sidebarOpen={mobileOpen}
                desktopSidebarOpen
                onSidebarOpenChange={setMobileOpen}
                sidebarWidth={300}
                contentInset={0}
                maxWidth='100%'
                header={(
                    <AppShellHeader
                        visibility='always'
                        sidebarOpen={mobileOpen}
                        onSidebarOpenChange={setMobileOpen}
                        navigationVisibility='mobile'
                        actions={(
                            <Flex a='c' g={1}>
                                <IconTextButton size={2} v='soft' tone='neutral' icon={<LuSearch />}>Quick jump</IconTextButton>
                                <IconButton size={2} v='ghost' icon={<LuBell />} badge={64} aria-label='Notifications' />
                                <IconButton size={2} v='ghost' icon={<LuMessageSquare />} badge={99} aria-label='Messages' />
                                <Menu
                                    align='end'
                                    items={languageItems}
                                    trigger={<IconButton size={2} v='ghost' icon={<LuLanguages />} aria-label={'Language: ' + locale.toUpperCase()} />}
                                />
                            </Flex>
                        )}
                    />
                )}
                sidebar={(
                    <AppSidebar
                        side={sidebarSide}
                        header={(
                            <>
                                <div className='oui-app-sidebar-brand'><span className='oui-app-sidebar-logo'>W</span><span className='oui-app-sidebar-title'>Workspace</span></div>
                                <div className='oui-app-sidebar-actions'>
                                    <Tooltip content='Back'>
                                        <IconButton size={2} v='ghost' icon={<LuArrowLeft />} aria-label='Back' />
                                    </Tooltip>
                                    <Tooltip content={isRight ? 'Move sidebar left' : 'Move sidebar right'}>
                                        <IconButton size={2} v='ghost' icon={<LuArrowLeftRight />} aria-label={isRight ? 'Move sidebar left' : 'Move sidebar right'} onClick={toggleSidebarSide} />
                                    </Tooltip>
                                    <IconButton size={2} v='ghost' icon={<LuEllipsis />} aria-label='Sidebar actions' />
                                </div>
                            </>
                        )}
                        itemH={38}
                        onNavigate={(item) => setActiveKey(item.key)}
                        groups={groups}
                    />
                )}
            >
                <AppShellContent scroll={false}>
                    <PageTitleBlock
                        title='Requests'
                        caption='Module workspace with responsive header and AppSidebar navigation.'
                        action={<IconButton size={2} v='pad' icon={<LuEllipsis />} aria-label='More actions' />}
                    />
                    {children}
                </AppShellContent>
            </AppShell>
        </SpecialModal.Body>
    </SpecialModal>
</>`,
    layoutFlex: `import {Badge, Button, Flex, Text} from '@orcestr/ui';

<Flex col g={3}>
    <Flex row g={2} a='c' j='sb' wrap>
        <Flex row g={2} a='c' wrap>
            <Badge tone='primary'>status</Badge>
            <Text fw={700}>Task TASK-2048</Text>
        </Flex>
        <Flex row g={1} a='c'>
            <Button size={1} v='surface'>Cancel</Button>
            <Button size={1}>Apply</Button>
        </Flex>
    </Flex>
    <Flex row g={2} wrap>
        {['Intake', 'Review', 'Complete'].map((item, index) => (
            <Flex
                key={item}
                col
                g={1}
                p={2}
                r={3}
                flex='1 1 150px'
                style={{background: 'var(--oui-pad-bg)'}}
            >
                <Text fs='12px' tone='muted'>Step {index + 1}</Text>
                <Text fw={700}>{item}</Text>
            </Flex>
        ))}
    </Flex>
</Flex>`,
    layoutStack: `import {Flex, Stack, Text} from '@orcestr/ui';

<Stack g={2}>
    {[
        ['/gallery/cyberpunk-rain.webp', 'Created', 'Draft created from intake'],
        ['/gallery/hollywood-star.webp', 'Reserved', 'Capacity is reserved for review'],
        ['/gallery/ice-cave.webp', 'Scheduled', 'Review window is confirmed'],
    ].map(([image, title, description]) => (
        <Flex
            key={title}
            row
            g={2}
            a='c'
            w='min(100%, 360px)'
            p='8px 10px'
            r={2}
            style={{background: 'var(--oui-pad-bg)'}}
        >
            <img
                src={image}
                alt=''
                style={{
                    width: 34,
                    height: 34,
                    flex: '0 0 34px',
                    borderRadius: 999,
                    objectFit: 'cover',
                }}
            />
            <Stack g={0}>
                <Text fs='13px' fw={700}>{title}</Text>
                <Text fs='12px' tone='muted' lh={1.45}>{description}</Text>
            </Stack>
        </Flex>
    ))}
</Stack>`,
    layoutCollapse: `import {useState} from 'react';
import {Badge, Button, Collapse, Flex, Stack, Text} from '@orcestr/ui';

const [detailsOpen, setDetailsOpen] = useState(true);

<Stack g={2}>
    <Flex row g={2} a='c' j='sb'>
        <Text fw={700}>Item details</Text>
        <Button size={1} v='surface' onClick={() => setDetailsOpen((open) => !open)}>
            {detailsOpen ? 'Hide' : 'Show'}
        </Button>
    </Flex>
    <Collapse open={detailsOpen}>
        <Stack g={2} p={2} r={3} style={{background: 'var(--oui-pad-bg)'}}>
            <Flex row g={2} j='sb'>
                <Text tone='muted'>Owner</Text>
                <Text fw={700}>Core team</Text>
            </Flex>
            <Flex row g={2} j='sb'>
                <Text tone='muted'>Window</Text>
                <Text fw={700}>09:00 - 12:00</Text>
            </Flex>
            <Flex row g={2} j='sb'>
                <Text tone='muted'>Priority</Text>
                <Badge tone='warning'>High</Badge>
            </Flex>
        </Stack>
    </Collapse>
</Stack>`,
    layoutGrid: `import {Box, Grid, Text} from '@orcestr/ui';

<Grid columns='repeat(3, minmax(0, 1fr))' g={2}>
    {['A', 'B', 'C', 'D', 'E', 'F'].map((item) => (
        <Box key={item} p={2} r={3} ta='center' style={{background: 'var(--oui-pad-bg)'}}>
            <Text fs='13px' fw={700}>{item}</Text>
        </Box>
    ))}
</Grid>`,
    highlights: `import {BottomHighlight, Text, TopHighlight} from '@orcestr/ui';

<div
    className='oui-highlight-demo-surface'
    style={{background: 'var(--oui-section-nested-solid-bg)'}}
>
    <TopHighlight
        h={32}
        color='var(--oui-section-nested-solid-bg)'
        position='absolute'
    />
    <Text fs='13px' fw={700}>Top and bottom highlights</Text>
    <Text fs='12px' tone='muted'>
        One surface shows both edge masks at the same time.
    </Text>
    <BottomHighlight
        h={32}
        color='var(--oui-section-nested-solid-bg)'
        position='absolute'
    />
</div>`,
    scrollArea: `import {Badge, Box, Flex, ScrollArea, Stack, Text} from '@orcestr/ui';

const scrollRows = Array.from({length: 10}, (_, index) => index + 1);
const richRows = [
    ['Queued', 'No top shade at the initial position.'],
    ['Reserved', 'The top shade starts after 50px.'],
    ['Packed', 'Opacity reaches maximum over 160px.'],
    ['Labeled', 'Bottom shade fades near the end.'],
    ['Reviewed', 'Each edge has its own configuration.'],
    ['Delivered', 'The gradient uses the solid surface color.'],
    ['Checked', 'Content remains readable under the fade.'],
    ['Archived', 'The bottom edge disappears at the end.'],
];

<Stack g={2}>
    <ScrollArea h={116} pr={1}>
        <Stack g={1}>
            {scrollRows.map((row) => (
                <Box key={row} p={2} r={3} style={{background: 'var(--oui-pad-bg)'}}>
                    <Text fs='13px'>Scroll row {row}</Text>
                </Box>
            ))}
        </Stack>
    </ScrollArea>

    <ScrollArea
        h={112}
        pr={1}
        highlights
        highlightColor='var(--oui-section-nested-solid-bg)'
        highlightTop={{h: 28, mode: 'static', maxOpacity: 0.96}}
        highlightBottom={{h: 28, mode: 'static', maxOpacity: 0.96}}
    >
        <Stack g={1}>
            {scrollRows.slice(0, 8).map((row) => (
                <Box key={row} p={2} r={3} style={{background: 'var(--oui-pad-bg)'}}>
                    <Text fs='13px'>Both edges row {row}</Text>
                </Box>
            ))}
        </Stack>
    </ScrollArea>

    <ScrollArea
        h={176}
        pr={1}
        highlights
        highlightColor='var(--oui-section-nested-solid-bg)'
        highlightTop={{
            h: 42,
            mode: 'scroll',
            start: 50,
            fadeDistance: 160,
            maxOpacity: 0.94,
        }}
        highlightBottom={{
            h: 34,
            mode: 'scroll',
            start: 12,
            fadeDistance: 96,
            maxOpacity: 0.9,
        }}
    >
        <Stack g={1}>
            {richRows.map(([title, description], index) => (
                <Flex
                    key={title}
                    row
                    g={2}
                    p={2}
                    r={3}
                    a='c'
                    style={{background: 'var(--oui-pad-bg)'}}
                >
                    <Badge tone={index < 3 ? 'primary' : 'info'}>
                        {index + 1}
                    </Badge>
                    <Stack g={0}>
                        <Text fs='13px' fw={700}>{title}</Text>
                        <Text fs='12px' tone='muted'>{description}</Text>
                    </Stack>
                </Flex>
            ))}
        </Stack>
    </ScrollArea>
</Stack>`,
    systemRadius: `import {Box, Button, Flex, Text} from '@orcestr/ui';

<Flex g={2} a='c' wrap>
    {[0, 2, 4, 6, 7].map((radius) => (
        <Box
            key={radius}
            size={32}
            r={radius}
            display='flex'
            a='c'
            j='c'
            style={{background: 'var(--oui-pad-bg)'}}
        >
            <Text fs='12px' fw={700}>{radius}</Text>
        </Box>
    ))}
</Flex>
<Button mt={2} v='pad' r={7}>
    Button r=7
</Button>`,
    surfaces: `import {Alert, Button, Card, Grid, Section, Separator, Stack, Text} from '@orcestr/ui';

<Section g={3}>
    <Grid columns='repeat(auto-fit, minmax(min(100%, 180px), 1fr))' g={2}>
        <Card v='surface' interactive>
            <Stack g={1}>
                <Text fw={760}>Surface card</Text>
                <Text fs='12px' tone='muted'>Default operational surface.</Text>
            </Stack>
        </Card>
        <Card v='soft'>
            <Stack g={1}>
                <Text fw={760}>Soft card</Text>
                <Text fs='12px' tone='muted'>Quiet grouped content.</Text>
            </Stack>
        </Card>
        <Card v='classic'>
            <Stack g={1}>
                <Text fw={760}>Classic card</Text>
                <Text fs='12px' tone='muted'>More explicit border and background.</Text>
            </Stack>
        </Card>
    </Grid>
    <Separator />
    <Alert title='Inventory sync delayed' action={<Button size={1} v='surface'>Retry</Button>}>
        Check this status before creating the next shipment.
    </Alert>
</Section>`,
    buttons: `import {Button, CopyButton, CopyIconButton, Spinner} from '@orcestr/ui';
import {LuCheck, LuInfo, LuTrash2, LuTriangleAlert} from 'react-icons/lu';

<Button size={3}>Solid</Button>
<Button size={3} v='soft'>Soft</Button>
<Button size={3} v='surface'>Surface</Button>
<Button size={3} v='pad'>Pad</Button>
<Button size={3} v='outline'>Outline</Button>
<Button size={3} v='ghost'>Ghost</Button>

<Button tone='success' leftIcon={<LuCheck size={16} />}>Success</Button>
<Button tone='warning' v='soft' leftIcon={<LuTriangleAlert size={16} />}>Warning</Button>
<Button tone='info' v='soft' leftIcon={<LuInfo size={16} />}>Info</Button>
<Button tone='danger' v='soft' leftIcon={<LuTrash2 size={16} />}>Delete</Button>

<Button size={1} v='surface'>Size 1</Button>
<Button size={2} v='surface'>Size 2</Button>
<Button size={3} v='surface'>Size 3</Button>
<Button size={4} v='surface'>Size 4</Button>

<Button size={1}>Solid 1</Button>
<Button size={2} v='soft'>Soft 2</Button>
<Button size={3} v='surface'>Surface 3</Button>
<Button size={3} v='pad'>Pad 3</Button>
<Button size={4} v='outline'>Outline 4</Button>
<Button size={2} v='ghost'>Ghost 2</Button>

<Button v='surface' pressAnimation='translate'>Press translate</Button>
<Button v='surface' pressAnimation='scale'>Press scale</Button>
<Button v='surface' pressAnimation='soft'>Press soft</Button>
<Button v='surface' pressAnimation='none'>Press none</Button>

<CopyButton
    text='https://orcestr.dev/requests/PR-2026-0900'
    label='Copy link'
    successMessage='Link copied'
    v='surface'
/>
<CopyIconButton
    text='PR-2026-0900'
    label='Copy request number'
    successMessage='Request number copied'
    v='surface'
/>

<Button size={3} loading>Loading</Button>
<Button size={3} v='surface' loading leftIcon={<LuCheck size={16} />}>Save</Button>
<Button size={3} tone='success' loading leftIcon={<LuCheck size={16} />}>Success</Button>
<Spinner />`,
    iconButtons: `import {Button, IconButton, Menu, Tooltip} from '@orcestr/ui';
import {
    LuBell,
    LuCheck,
    LuCommand,
    LuDownload,
    LuEllipsis,
    LuInfo,
    LuMessageSquare,
    LuRefreshCw,
    LuSearch,
    LuSettings,
    LuShield,
    LuUpload,
} from 'react-icons/lu';

<IconButton v='solid' icon={<LuCheck size={17} />} aria-label='Solid icon' />
<IconButton v='soft' icon={<LuSearch size={17} />} aria-label='Search icon' />
<IconButton v='surface' icon={<LuUpload size={17} />} aria-label='Upload icon' />
<IconButton v='pad' icon={<LuShield size={17} />} aria-label='Security icon' />
<IconButton v='outline' icon={<LuInfo size={17} />} aria-label='Outline icon' />
<IconButton v='ghost' icon={<LuEllipsis size={17} />} aria-label='Ghost icon' />

<IconButton size={1} v='surface' icon={<LuSearch size={13} />} aria-label='Size 1 search' />
<IconButton size={2} v='surface' icon={<LuDownload size={15} />} aria-label='Size 2 download' />
<IconButton size={3} v='surface' icon={<LuRefreshCw size={17} />} aria-label='Size 3 refresh' />
<IconButton size={4} v='surface' icon={<LuSettings size={19} />} aria-label='Size 4 settings' />

<IconButton size={3} v='pad' round={false} r={3} icon={<LuCommand size={17} />} aria-label='Square pad icon' />
<IconButton size={3} v='outline' loading icon={<LuRefreshCw size={17} />} aria-label='Loading icon' />

<IconButton v='surface' icon={<LuBell size={17} />} badge={64} aria-label='Notifications' />
<IconButton v='surface' icon={<LuMessageSquare size={17} />} badge={99} aria-label='Unread chats' />
<IconButton v='pad' icon={<LuShield size={17} />} badge={3} badgeTone='warning' aria-label='Security warnings' />
<IconButton v='ghost' icon={<LuDownload size={17} />} badge='new' badgeTone='info' aria-label='New export' />

<IconButton size={1} v='ghost' icon={<LuEllipsis size={13} />} aria-label='Ghost size 1' />
<IconButton size={2} v='ghost' icon={<LuEllipsis size={15} />} aria-label='Ghost size 2' />
<IconButton size={3} v='ghost' icon={<LuEllipsis size={17} />} aria-label='Ghost size 3' />
<IconButton size={4} v='ghost' icon={<LuEllipsis size={19} />} aria-label='Ghost size 4' />

<Tooltip content='Notifications'>
    <IconButton v='surface' icon={<LuBell size={17} />} badge={8} aria-label='Notifications' />
</Tooltip>
<IconButton v='surface' loading icon={<LuRefreshCw size={17} />} aria-label='Loading action' />
<IconButton v='pad' icon={<LuSettings size={17} />} aria-label='Pad action' />
<Menu
    trigger={<IconButton v='surface' icon={<LuEllipsis size={17} />} aria-label='Actions' />}
    items={menuItems}
/>
<Button v='surface' leftIcon={<LuCommand size={16} />} onClick={openPalette}>
    Commands
</Button>`,
    iconTextButton: `import {IconTextButton} from '@orcestr/ui';
import {LuCopy, LuExternalLink, LuPackagePlus} from 'react-icons/lu';

<IconTextButton icon={<LuPackagePlus size={16} />}>
    Create PO
</IconTextButton>
<IconTextButton v='soft' tone='info' icon={<LuCopy size={16} />}>
    Duplicate
</IconTextButton>
<IconTextButton href='/requests' v='surface' icon={<LuExternalLink size={16} />}>
    Link action
</IconTextButton>
<IconTextButton v='outline' iconSide='end' icon={<LuExternalLink size={16} />}>
    Open details
</IconTextButton>`,
    contextMenu: `import {ContextMenu, Text, type MenuItem} from '@orcestr/ui';

const items: MenuItem[] = [
    {key: 'open', label: 'Open'},
    {key: 'copy', label: 'Copy link'},
    {key: 'delete', label: 'Delete', tone: 'danger', separatorBefore: true},
];

<ContextMenu items={items}>
    <div className='row'>
        <Text fs='13px' fw={760}>Right-click this row</Text>
        <Text fs='12px' tone='muted'>Context menu reuses Menu item styling.</Text>
    </div>
</ContextMenu>`,
    textFields: `import {Button, Flex, Field, TextArea, TextField} from '@orcestr/ui';
import {LuSearch} from 'react-icons/lu';

<Field label='Search' helperText='Clearable field with left slot.'>
    <Flex g={2} a='c'>
        <TextField
            size={2}
            placeholder='Search entity'
            clearable
            leftSlot={<LuSearch size={16} />}
        />
        <Button size={2} v='surface'>Search</Button>
    </Flex>
</Field>
<Field label='Comment'>
    <TextArea rows={4} placeholder='Internal note' />
</Field>`,
    inlineEdit: `import {useState} from 'react';
import {Badge, Field, IconButton, InlineEditField, InlineEditMultiField, Listbox, Popover, Stack} from '@orcestr/ui';
import {LuCheck, LuPencil} from 'react-icons/lu';

const [supplierOpen, setSupplierOpen] = useState(false);
const [paymentOpen, setPaymentOpen] = useState(false);
const [supplierKey, setSupplierKey] = useState('northwind');
const [paymentTermKey, setPaymentTermKey] = useState('net30');
const [ownerOpen, setOwnerOpen] = useState(false);
const [ownerKeys, setOwnerKeys] = useState(['michael', 'team']);
const supplier = suppliers.find((item) => item.key === supplierKey);
const paymentTerm = paymentTerms.find((item) => item.key === paymentTermKey);
const selectedOwners = owners.filter((item) => ownerKeys.includes(item.key));
const toggleOwner = (key) => {
    setOwnerKeys((current) =>
        current.includes(key)
            ? current.filter((item) => item !== key)
            : [...current, key],
    );
};

<Stack g={3}>
    <Field label='Single value'>
        <InlineEditField
            label={supplier?.label ?? 'Choose supplier'}
            meta='Supplier'
            onOpen={() => setSupplierOpen(true)}
            action={
                <Popover
                    open={supplierOpen}
                    onOpenChange={setSupplierOpen}
                    trigger={<IconButton size={1} v='ghost' icon={<LuPencil size={13} />} />}
                    className='oui-combobox-content'
                >
                    <Listbox
                        className='oui-combobox-options'
                        items={suppliers.map((item) => ({value: item.key, label: item.label}))}
                        value={supplierKey}
                        onValueChange={(next) => {
                            setSupplierKey(next);
                            setSupplierOpen(false);
                        }}
                    />
                </Popover>
            }
        />
    </Field>
    <Field label='Single value without meta'>
        <InlineEditField
            label={paymentTerm?.label ?? 'Choose payment terms'}
            onOpen={() => setPaymentOpen(true)}
            action={
                <Popover
                    open={paymentOpen}
                    onOpenChange={setPaymentOpen}
                    trigger={<IconButton size={1} v='ghost' icon={<LuPencil size={13} />} />}
                    className='oui-combobox-content'
                >
                    <Listbox
                        className='oui-combobox-options'
                        items={paymentTerms.map((item) => ({value: item.key, label: item.label}))}
                        value={paymentTermKey}
                        onValueChange={(next) => {
                            setPaymentTermKey(next);
                            setPaymentOpen(false);
                        }}
                    />
                </Popover>
            }
        />
    </Field>
    <Field label='Multiple values'>
        <InlineEditMultiField
            onOpen={() => setOwnerOpen(true)}
            action={(
                <span onClick={(event) => event.stopPropagation()}>
                    <Popover
                        open={ownerOpen}
                        onOpenChange={setOwnerOpen}
                        trigger={<IconButton size={1} v='ghost' icon={<LuPencil size={13} />} />}
                        className='oui-combobox-content'
                    >
                        <Stack g={1} p={1}>
                            {owners.map((item) => {
                                const selected = ownerKeys.includes(item.key);
                                return (
                                    <button
                                        key={item.key}
                                        type='button'
                                        className='oui-combobox-option'
                                        data-selected={selected ? 'true' : 'false'}
                                        onClick={() => toggleOwner(item.key)}
                                    >
                                        <span className='oui-multi-select-check'>
                                            {selected ? <LuCheck size={13} /> : null}
                                        </span>
                                        <span className='oui-combobox-option-main'>
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </Stack>
                    </Popover>
                </span>
            )}
            col
        >
            {selectedOwners.map((item) => (
                <Badge key={item.key} tone='neutral' v='soft'>{item.label}</Badge>
            ))}
        </InlineEditMultiField>
    </Field>
</Stack>`,
    groupedFields: `import {Button, Flex, Field, Grid, Section, Stack, Text, TextArea, TextField} from '@orcestr/ui';

<Section g={3}>
    <Stack g={1}>
        <Text fw={760}>Request details</Text>
        <Text fs='12px' tone='muted'>
            Layout primitives group fields without owning state.
        </Text>
    </Stack>
    <Grid columns='repeat(auto-fit, minmax(min(100%, 180px), 1fr))' g={3}>
        <Field label='Source' required error='Choose a source'>
            <TextField placeholder='Search source' invalid />
        </Field>
        <Field label='Contact'>
            <TextField placeholder='Name or email' />
        </Field>
    </Grid>
    <Field label='Review note' helperText='Visible to operators.'>
        <TextArea rows={3} placeholder='Internal instructions' />
    </Field>
    <Flex g={2} j='e' wrap>
        <Button type='button' v='surface'>Cancel</Button>
        <Button type='button'>Save request</Button>
    </Flex>
</Section>`,
    numberAndDateFields: `import {DatePicker, Field, NumberField, StepperInput} from '@orcestr/ui';

<Field label='Quantity'>
    <StepperInput value={quantity} onChange={setQuantity} min={0} max={200} />
</Field>
<Field label='Price'>
    <NumberField defaultValue={1250} min={0} />
</Field>
<Field label='Date'>
    <DatePicker value={date} onValueChange={setDate} />
</Field>`,
    dateRangeFields: `import {DateRangePicker, DateRangePresetPicker, Field} from '@orcestr/ui';

<Field label='Range'>
    <DateRangePicker value={dateRange} onValueChange={setDateRange} />
</Field>
<DateRangePresetPicker
    today='2026-06-26'
    onValueChange={setDateRange}
/>`,
    selection: `import {Combobox, EntityPicker, MultiSelect, PaginatedCombobox, Select, SegmentedControl} from '@orcestr/ui';
import {LuPlus} from 'react-icons/lu';

<Select items={items} value={status} onValueChange={setStatus} clearable />
<Select
    items={items}
    value={statusWithoutChevron}
    onValueChange={setStatusWithoutChevron}
    clearable
    showChevron={false}
    placeholder='Clearable without chevron'
/>
<Select
    items={items}
    value={plainStatus}
    onValueChange={setPlainStatus}
    clearable={false}
    showChevron={false}
    placeholder='Plain select'
/>
<Combobox
    items={items}
    value={comboValue}
    onValueChange={setComboValue}
    placeholder='Find status'
/>
<MultiSelect
    items={owners}
    value={ownerValues}
    onValueChange={setOwnerValues}
    placeholder='Responsible users'
    clearable
    renderValue={(items) =>
        items.length === 1 ? items[0]?.label : String(items.length) + ' responsible'
    }
/>
<EntityPicker
    value={entity}
    onValueChange={setEntity}
    loadPage={(page, search) => loadEntityPage(locale, page, search)}
    getEntityId={(item) => item.id}
    renderValue={(item) => item.article}
    renderEntity={(item) => (
        <>
            <span className='oui-entity-option-main'>
                <span className='oui-entity-option-code'>{item.article}</span>
                <span className='oui-entity-option-meta'>{item.name}</span>
            </span>
            <span className='oui-entity-option-badge'>{item.status}</span>
        </>
    )}
    placeholder='Entity picker'
    clearable
    createAction={{
        label: 'Create entity from search',
        onCreate: createEntity,
    }}
    optionAction={{
        icon: <LuPlus size={14} />,
        label: (item) => 'Add ' + item.article,
        onClick: addEntity,
    }}
/>
<PaginatedCombobox
    value={paginatedValue}
    onChange={setPaginatedValue}
    loadPage={(page, search) => loadEntityPage(locale, page, search)}
    getItemId={(item) => item.id}
    renderSelectedLabel={(item) => item.article}
    renderOption={(item) => (
        <span className='oui-entity-option-main'>
            <span className='oui-entity-option-code'>{item.article}</span>
            <span className='oui-entity-option-meta'>{item.name}</span>
        </span>
    )}
    placeholder='Paginated combobox'
    clearable
    searchAction={{label: 'Create entity from search', onClick: createEntity}}
    optionAction={{
        icon: <LuPlus size={14} />,
        label: (item) => 'Add ' + item.article,
        onClick: addEntity,
    }}
/>
<SegmentedControl
    items={[
        {value: 'active', label: 'Active'},
        {value: 'drafts', label: 'Drafts'},
        {value: 'archive', label: 'Archive'},
    ]}
    value={segment}
    onValueChange={setSegment}
/>`,
    selectionGroup: `import {Checkbox, RadioGroup, Switch} from '@orcestr/ui';

<Checkbox defaultChecked>Confirmed</Checkbox>
<Checkbox>Needs review</Checkbox>
<Checkbox disabled>Locked option</Checkbox>
<Switch defaultChecked>Auto updates</Switch>
<Switch>Manual mode</Switch>
<Switch disabled>Disabled switch</Switch>
<RadioGroup
    name='mode'
    value={mode}
    onValueChange={setMode}
    items={[
        {value: 'manual', label: 'Manual'},
        {value: 'auto', label: 'Automatic'},
    ]}
/>`,
    tabs: `import {Tabs} from '@orcestr/ui';
import {LuHistory, LuListChecks} from 'react-icons/lu';

<Tabs
    value={tab}
    onValueChange={setTab}
    items={[
        {value: 'overview', label: 'Overview', icon: <LuListChecks size={16} />, badge: '12', content},
        {value: 'history', label: 'History', icon: <LuHistory size={16} />, content},
    ]}
/>`,
    overlays: `import {Button, CommandPalette, Flex, Field, Modal, Popover, Stack, Text, TextField, Tooltip} from '@orcestr/ui';
import {LuChevronDown} from 'react-icons/lu';

<Popover
    trigger={
        <Button v='surface' rightIcon={<LuChevronDown size={16} />}>
            Open popover
        </Button>
    }
>
    <Stack g={2} p={1}>
        <Text fw={700}>Popover content</Text>
        <Text color='var(--oui-muted)' fs='13px'>Shared positioning and presence.</Text>
    </Stack>
</Popover>

<Tooltip content='Tooltip uses the same floating layer'>
    <Button v='outline'>Hover me</Button>
</Tooltip>

<Button onClick={() => setModalOpen(true)}>Default modal</Button>
<Button v='surface' onClick={() => setBlurModalOpen(true)}>Blur modal</Button>
<Button v='outline' onClick={() => setFastModalOpen(true)}>Fast modal</Button>
<Button v='outline' onClick={() => setRiseModalOpen(true)}>Rise modal</Button>
<Button v='outline' onClick={() => setSlowModalOpen(true)}>Very slow modal</Button>
<Button v='soft' tone='danger' onClick={() => setDangerModalOpen(true)}>
    Danger modal
</Button>

<Modal
    open={modalOpen}
    onOpenChange={setModalOpen}
    title='Custom modal'
    description='First modal layer with the default theme blur backdrop.'
    footer={
        <Flex g={2} j='e' w='100%'>
            <Button v='surface' onClick={() => setModalOpen(false)}>Close</Button>
            <Button onClick={() => setNestedOpen(true)}>Open nested</Button>
        </Flex>
    }
>
    <Stack g={3}>
        <Text color='var(--oui-muted)' lh={1.5}>
            Nested modals stack above the previous layer.
        </Text>
        <Field label='Modal field'>
            <TextField placeholder='Focus stays inside modal' />
        </Field>
    </Stack>
</Modal>

<Modal
    open={nestedOpen}
    onOpenChange={setNestedOpen}
    title='Nested modal'
    description='Second layer with the same default modal animation.'
    maxWidth={440}
>
    <Stack g={3}>
        <Text color='var(--oui-muted)' lh={1.5}>This checks layer indexes and focus trap.</Text>
        <Button onClick={() => toast.push('Nested modal action completed', 'success')}>
            Show toast
        </Button>
    </Stack>
</Modal>

<Modal
    open={blurModalOpen}
    onOpenChange={setBlurModalOpen}
    title='Blur modal'
    description='Default modal surface with pure backdrop blur and no overlay tint.'
    maxWidth={560}
    overlayColor='transparent'
    overlayOpacity={0}
    overlayBlur={10}
    borderColor='color-mix(in srgb, var(--oui-primary-base) 34%, var(--oui-border))'
    radius={10}
    shadow='0 24px 90px rgb(0 0 0 / 44%)'
    footer={
        <Flex g={2} j='e' w='100%'>
            <Button v='surface' onClick={() => setBlurModalOpen(false)}>Close</Button>
            <Button onClick={() => setBlurNestedOpen(true)}>Open nested blur</Button>
        </Flex>
    }
>
    <Stack g={3}>
        <Text color='var(--oui-muted)' lh={1.5}>
            This variant checks a strong backdrop blur with transparent overlay tint.
        </Text>
        <Field label='Reference'>
            <TextField placeholder='ORD-2048' />
        </Field>
    </Stack>
</Modal>

<Modal
    open={blurNestedOpen}
    onOpenChange={setBlurNestedOpen}
    title='Nested blur modal'
    description='Second blur layer without overlay tint.'
    maxWidth={500}
    overlayColor='transparent'
    overlayOpacity={0}
    overlayBlur={8}
    borderColor='color-mix(in srgb, var(--oui-primary-base) 38%, var(--oui-border))'
    radius={10}
    footer={
        <Flex g={2} j='e' w='100%'>
            <Button v='surface' onClick={() => setBlurNestedOpen(false)}>Close</Button>
            <Button onClick={() => setBlurFinalOpen(true)}>Open final blur</Button>
        </Flex>
    }
>
    <Stack g={3}>
        <Text color='var(--oui-muted)' lh={1.5}>This layer stacks above the first blur modal.</Text>
        <TextField placeholder='Nested value' />
    </Stack>
</Modal>

<Modal
    open={blurFinalOpen}
    onOpenChange={setBlurFinalOpen}
    title='Final blur modal'
    description='Top blur layer. Toast must appear above this modal.'
    maxWidth={440}
    overlayColor='transparent'
    overlayOpacity={0}
    overlayBlur={6}
    borderColor='color-mix(in srgb, var(--oui-primary-base) 42%, var(--oui-border))'
    radius={10}
>
    <Stack g={3}>
        <Text color='var(--oui-muted)' lh={1.5}>Verify blur stacking and toast z-index.</Text>
        <Button onClick={() => toast.push('Toast above nested blur modals', 'success')}>
            Show toast
        </Button>
    </Stack>
</Modal>

<Modal
    open={fastModalOpen}
    onOpenChange={setFastModalOpen}
    title='Fast modal'
    description='Short animationDuration passed directly to the modal.'
    maxWidth={460}
    overlayColor='#0b1020'
    overlayOpacity={0.28}
    overlayBlur={4}
    animationDuration='160ms'
>
    <Stack g={3}>
        <Text color='var(--oui-muted)' lh={1.5}>Fast open and close animation.</Text>
        <Button onClick={() => setFastModalOpen(false)}>Close</Button>
    </Stack>
</Modal>

<Modal
    open={slowModalOpen}
    onOpenChange={setSlowModalOpen}
    title='Very slow modal'
    description='Long animationDuration for checking smooth blur ramp.'
    maxWidth={520}
    overlayColor='transparent'
    overlayOpacity={0}
    overlayBlur={14}
    animationDuration='1200ms'
    borderColor='color-mix(in srgb, var(--oui-primary-base) 42%, var(--oui-border))'
    radius={10}
>
    <Stack g={3}>
        <Text color='var(--oui-muted)' lh={1.5}>Slow blur ramp for animation checks.</Text>
        <Button onClick={() => setSlowModalOpen(false)}>Close</Button>
    </Stack>
</Modal>

<Modal
    open={riseModalOpen}
    onOpenChange={setRiseModalOpen}
    title='Rise modal'
    description='Explicit rise animation variant with scale and vertical movement.'
    maxWidth={480}
    overlayColor='#0b1020'
    overlayOpacity={0.28}
    overlayBlur={4}
    animation='rise'
>
    <Stack g={3}>
        <Text color='var(--oui-muted)' lh={1.5}>Previous rise animation variant.</Text>
        <Button onClick={() => setRiseModalOpen(false)}>Close</Button>
    </Stack>
</Modal>

<Modal
    open={dangerModalOpen}
    onOpenChange={setDangerModalOpen}
    title='Danger modal'
    description='Strong colored overlay, danger border and compact radius.'
    maxWidth={500}
    overlayColor='#3b0712'
    overlayOpacity={0.48}
    overlayBlur={3}
    borderColor='color-mix(in srgb, var(--oui-danger-base) 46%, var(--oui-border))'
    radius={8}
    footer={
        <Flex g={2} j='e' w='100%'>
            <Button v='surface' onClick={() => setDangerModalOpen(false)}>Cancel</Button>
            <Button tone='danger' onClick={confirmDangerAction}>Confirm</Button>
        </Flex>
    }
>
    <Stack g={3}>
        <Text color='var(--oui-muted)' lh={1.5}>Colored backdrop without a hard flash.</Text>
        <TextField value='Archive selected record' readOnly />
    </Stack>
</Modal>

<CommandPalette
    open={paletteOpen}
    onOpenChange={setPaletteOpen}
    items={[
        {
            key: 'create-record',
            label: 'Create record',
            description: 'Start a new record.',
            shortcut: 'C',
            group: 'Create',
            keywords: ['new', 'record'],
            onSelect: () => toast.info('Create record action'),
        },
    ]}
    recentItems={recentCommands}
    globalOpenEvents={['orcestr:open-command-palette']}
    onSelect={(value) => toast.info('Command selected: ' + value)}
/>`,
    toast: `import {Button, type ToastPosition, type ToastTone, useToast} from '@orcestr/ui';

const toast = useToast();

<Button
    onClick={() =>
        toast.success({
            title: 'Saved successfully',
            message: 'The settings are synced with the current theme.',
            position: 'bottom-right',
        })
    }
>
    Success
</Button>
<Button
    onClick={() =>
        toast.success({
            title: 'Endless',
            message: 'This success toast stays until you click it.',
            position: 'bottom-right',
            duration: null,
            dedupeKey: 'endless-success-toast',
        })
    }
>
    Endless
</Button>
<Button
    onClick={() =>
        toast.warning({
            title: 'Needs attention',
            message: 'Only 4 items need attention in this view.',
            dedupeKey: 'needs-attention',
            position: 'top-right',
        })
    }
>
    Warning dedupe
</Button>
<Button
    onClick={() =>
        toast.error({
            title: 'Export failed',
            message: 'The report can be retried without closing this page.',
            position: 'bottom-right',
            action: {
                label: 'Retry',
                onClick: () => toast.info('Retry queued'),
            },
        })
    }
>
    Error action
</Button>
<Button
    onClick={() =>
        toast.info({
            title: 'Pinned note',
            message: 'duration: null keeps this toast visible.',
            position: 'top-center',
            duration: null,
            closeButton: true,
        })
    }
>
    Pinned
</Button>
<Button
    onClick={() =>
        toast.info({
            title: 'Glass background',
            message: 'Theme blur and translucent background.',
            position: 'bottom-right',
            duration: 5200,
        })
    }
>
    Glass
</Button>

const toastPositions: Array<{position: ToastPosition; label: string}> = [
    {position: 'top-left', label: 'Top left'},
    {position: 'top-center', label: 'Top center'},
    {position: 'top-right', label: 'Top right'},
    {position: 'bottom-left', label: 'Bottom left'},
    {position: 'bottom-center', label: 'Bottom center'},
    {position: 'bottom-right', label: 'Bottom right'},
];

const toastPositionVariants: Array<{
    position: ToastPosition;
    label: string;
    tone: ToastTone;
    message: string;
}> = [
    {
        position: 'top-left',
        label: 'Status synced',
        tone: 'success',
        message: 'Default glass toast from the left edge.',
    },
    {
        position: 'top-center',
        label: 'Command ready',
        tone: 'info',
        message: 'Centered toast uses the same glass surface.',
    },
    {
        position: 'top-right',
        label: 'Needs attention',
        tone: 'warning',
        message: 'Right edge toast keeps the same translucent surface.',
    },
    {
        position: 'bottom-left',
        label: 'Import queued',
        tone: 'info',
        message: 'Bottom left toast keeps the same theme blur.',
    },
    {
        position: 'bottom-center',
        label: 'Batch completed',
        tone: 'success',
        message: 'Bottom center toast uses the theme defaults.',
    },
    {
        position: 'bottom-right',
        label: 'Export failed',
        tone: 'danger',
        message: 'Actionable toast from the right edge.',
    },
];

{toastPositions.map((item) => (
    <Button
        key={item.position}
        size={1}
        v='surface'
        onClick={() =>
            toast.info({
                title: item.label,
                message: 'Positioned toast with the default glass surface.',
                position: item.position,
                duration: 3600,
            })
        }
    >
        {item.label}
    </Button>
))}

<Button
    size={1}
    tone='success'
    v='soft'
    onClick={() => {
        toastPositionVariants.forEach((item, index) => {
            window.setTimeout(() => {
                toast.push({
                    title: item.label,
                    message: item.message,
                    position: item.position,
                    tone: item.tone,
                    duration: 4200 + index * 220,
                });
            }, index * 120);
        });
    }}
>
    Show all positions
</Button>`,
    overlaySettings: `import {Button, Modal} from '@orcestr/ui';

<Modal
    open={open}
    onOpenChange={setOpen}
    title='Blur modal'
    overlayColor='transparent'
    overlayOpacity={0}
    overlayBlur={10}
    animation='zoom-blur'
    animationDuration='380ms'
    radius={10}
>
    Modal content
</Modal>

<Button onClick={() => setOpen(true)}>Open modal</Button>`,
    tablePagination: `import {Badge, Flex, Pagination, Stack, Table, Text} from '@orcestr/ui';

<Stack g={3}>
    <Table v='surface' w='100%'>
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeaderCell>Document</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align='right'>Qty</Table.ColumnHeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {rows.map((row) => (
                <Table.Row key={row.name}>
                    <Table.RowHeaderCell>{row.name}</Table.RowHeaderCell>
                    <Table.Cell><Badge>{row.status}</Badge></Table.Cell>
                    <Table.Cell align='right'>{row.quantity}</Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
    <Flex j='sb' a='c' wrap g={2}>
        <Text fs='13px' tone='muted'>Showing 25 items per page</Text>
        <Pagination page={page} pageCount={4} onPageChange={setPage} />
    </Flex>
</Stack>`,
    appSidebar: `import {useState} from 'react';
import {AppSidebar, Flex, IconButton, Text} from '@orcestr/ui';
import {LuBell, LuBox, LuLayoutDashboard, LuSettings, LuTruck} from 'react-icons/lu';

const [activeKey, setActiveKey] = useState('requests');

<AppSidebar
    header={(
        <>
            <div className='oui-app-sidebar-brand'>
                <span className='oui-app-sidebar-logo'>O</span>
                <span className='oui-app-sidebar-title'>Workspace</span>
            </div>
            <div className='oui-app-sidebar-actions'>
                <IconButton size={2} v='ghost' icon={<LuSettings />} />
            </div>
        </>
    )}
    itemH={38}
    onNavigate={(item) => setActiveKey(item.key)}
    groups={[
        {
            key: 'main',
            items: [
                {
                    key: 'overview',
                    label: 'Overview',
                    icon: <LuLayoutDashboard />,
                    active: activeKey === 'overview',
                },
                {
                    key: 'requests',
                    label: 'Requests',
                    icon: <LuTruck />,
                    active: activeKey === 'requests',
                },
                {
                    key: 'products',
                    label: 'Products',
                    icon: <LuBox />,
                    active: activeKey === 'products',
                },
            ],
        },
    ]}
    footer={(
        <Flex col g={2}>
            <Flex g={1}>
                <IconButton size={2} v='ghost' icon={<LuBell />} badge={64} />
                <IconButton size={2} v='ghost' icon={<LuSettings />} />
            </Flex>
            <Text fs='12px' tone='muted'>Admin workspace</Text>
        </Flex>
    )}
/>`,
    specialModal: `import {Badge, Button, Flex, SpecialModal, Stack, Text} from '@orcestr/ui';

<SpecialModal open={open} onOpenChange={setOpen} size='lg' scroll='body'>
    <SpecialModal.Header
        title='Request PR-2026-0900'
        meta={<Badge tone='success'>Closed</Badge>}
        actions={<SpecialModal.Close />}
    />
    <SpecialModal.Body>
        <Stack g={3}>
            <Flex g={4} wrap>
                <Stack g={0} w='min(100%, 220px)'>
                    <Text fs='12px' tone='muted'>Supplier</Text>
                    <Text fw={760}>Northwind Trading LLC</Text>
                </Stack>
                <Stack g={0} w='min(100%, 180px)'>
                    <Text fs='12px' tone='muted'>Plan arrival</Text>
                    <Text fw={760}>25.06.2026</Text>
                </Stack>
            </Flex>
        </Stack>
    </SpecialModal.Body>
    <SpecialModal.Footer>
        <Flex g={2} j='e' w='100%'>
            <Button v='surface' onClick={() => setOpen(false)}>Close</Button>
            <Button>Save</Button>
        </Flex>
    </SpecialModal.Footer>
</SpecialModal>`,
    data: `import {Button, DataTable, TextField, type DataTableSort} from '@orcestr/ui';

const [sort, setSort] = useState<DataTableSort | null>({key: 'name', direction: 'asc'});
const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
const [visibleColumnKeys, setVisibleColumnKeys] = useState(columns.map((column) => column.key));
const [columnOrder, setColumnOrder] = useState(columns.map((column) => column.key));
const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
const resetTable = () => {
    setVisibleColumnKeys(columns.map((column) => column.key));
    setColumnOrder(columns.map((column) => column.key));
    setColumnWidths({});
};

<DataTable
    toolbar={
        <>
            <TextField value={query} onChange={(event) => setQuery(event.target.value)} clearable />
            <Button onClick={resetTable}>Reset</Button>
        </>
    }
    rowKey={(row) => row.name}
    rows={rows}
    columns={columns}
    sort={sort}
    onSortChange={(nextSort) => setSort(Array.isArray(nextSort) ? nextSort[0] ?? null : nextSort)}
    selectable
    selectedRowKeys={selectedRowKeys}
    onSelectedRowKeysChange={setSelectedRowKeys}
    columnSettings={{
        columns,
        visibleColumnKeys,
        onVisibleColumnKeysChange: setVisibleColumnKeys,
        columnOrder,
        onColumnOrderChange: setColumnOrder,
        columnWidths,
        onColumnWidthsChange: setColumnWidths,
    }}
/>

<DataTable
    rowKey={(row) => row.name}
    rows={rows.slice(0, 4)}
    columns={columns}
/>`,
} satisfies Record<string, string>;
