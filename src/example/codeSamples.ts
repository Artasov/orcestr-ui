export type CodeExample = {
    title: string;
    code: string;
};

export const codeSamples = {
    typography: `import {Badge, Box, Flex, Stack, Text} from '@orcestr/ui';

<Stack g={3}>
    <Stack g={1}>
        <Text as='h1' fs='28px' fw={780} lh={1.1}>
            Workflow review
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
        <Text tone='brand' fw={700}>Brand</Text>
        <Text tone='success' fw={700}>Success</Text>
        <Text tone='warning' fw={700}>Warning</Text>
        <Text tone='danger' fw={700}>Danger</Text>
        <Text tone='info' fw={700}>Info</Text>
    </Flex>

    <Box w='100%' p={2} r={3}>
        <Text display='block' truncate>
            This is a long single line value that truncates cleanly.
        </Text>
    </Box>

    <Flex g={2} wrap>
        <Badge>Neutral</Badge>
        <Badge tone='brand'>Brand</Badge>
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
    appShell: `import {
    AppShell,
    AppShellContent,
    AppShellHeader,
    AppShellNav,
    AppShellSidebar,
    Button,
    OrcestrUiProvider,
    Stack,
    Text,
} from '@orcestr/ui';

<OrcestrUiProvider surface='operations' locale='ru'>
    <AppShell
        sidebarOpen={mobileOpen}
        onSidebarOpenChange={setMobileOpen}
        header={
            <AppShellHeader
                visibility='mobile'
                title='Operations'
                sidebarOpen={mobileOpen}
                onSidebarOpenChange={setMobileOpen}
                actions={<Button size={1}>Create</Button>}
            />
        }
        sidebar={
            <AppShellSidebar
                title='Operations'
                description='Operational module shell with themed navigation.'
                onClose={() => setMobileOpen(false)}
                footer={<Button fullWidth v='surface'>Settings</Button>}
            >
                <AppShellNav items={navigationItems} />
            </AppShellSidebar>
        }
    >
        <AppShellContent>
            <Stack g={1}>
                <Text as='h1' fs='22px' fw={760}>Queue</Text>
                <Text tone='muted'>Daily workspace operations and status movement.</Text>
            </Stack>
            {children}
        </AppShellContent>
    </AppShell>
</OrcestrUiProvider>`,
    layoutFlex: `import {Badge, Button, Flex, Text} from '@orcestr/ui';

<Flex col g={3}>
    <Flex row g={2} a='c' j='sb' wrap>
        <Flex row g={2} a='c' wrap>
            <Badge tone='brand'>status</Badge>
            <Text fw={700}>Task TASK-2048</Text>
        </Flex>
        <Flex row g={1} a='c'>
            <Button size={1} v='surface'>Cancel</Button>
            <Button size={1}>Apply</Button>
        </Flex>
    </Flex>
    <Flex row g={2} wrap>
        {['Intake', 'Review', 'Complete'].map((item, index) => (
            <Flex key={item} col g={1} p={2} r={3} flex='1 1 150px'>
                <Text fs='12px' tone='muted'>Step {index + 1}</Text>
                <Text fw={700}>{item}</Text>
            </Flex>
        ))}
    </Flex>
</Flex>`,
    layoutStack: `import {Box, Flex, Stack, Text} from '@orcestr/ui';

<Stack g={2}>
    {[
        ['Created', 'Draft created from intake'],
        ['Reserved', 'Capacity is reserved for review'],
        ['Scheduled', 'Review window is confirmed'],
    ].map(([title, description]) => (
        <Flex key={title} row g={2} p={2} r={3} a='s'>
            <Box size={8} r={7} mt={1} />
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
        <Stack g={2} p={2} r={3}>
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
        <Box key={item} p={2} r={3} ta='center'>
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
    scrollArea: `import {Badge, Flex, ScrollArea, Stack, Text} from '@orcestr/ui';

<Stack g={2}>
    <ScrollArea h={116} pr={1}>
        <Stack g={1}>{rows}</Stack>
    </ScrollArea>

    <ScrollArea
        h={112}
        pr={1}
        highlights
        highlightColor='var(--oui-section-nested-solid-bg)'
        highlightTop={{h: 28, mode: 'static', maxOpacity: 0.96}}
        highlightBottom={{h: 28, mode: 'static', maxOpacity: 0.96}}
    >
        <Stack g={1}>{rows}</Stack>
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
            {rows.map((row, index) => (
                <Flex key={row.id} row g={2} p={2} r={3} a='c'>
                    <Badge tone={index < 3 ? 'brand' : 'info'}>
                        {index + 1}
                    </Badge>
                    <Stack g={0}>
                        <Text fs='13px' fw={700}>{row.title}</Text>
                        <Text fs='12px' tone='muted'>{row.description}</Text>
                    </Stack>
                </Flex>
            ))}
        </Stack>
    </ScrollArea>
</Stack>`,
    systemRadius: `import {Box, Button, Flex, Text} from '@orcestr/ui';

<Flex g={2} a='c' wrap>
    {[0, 2, 4, 6, 7].map((radius) => (
        <Box key={radius} size={32} r={radius} display='flex' a='c' j='c'>
            <Text fs='12px'>{radius}</Text>
        </Box>
    ))}
</Flex>
<Button mt={2} v='pad' r={7}>
    Button r=7
</Button>`,
    buttons: `import {Button, Spinner} from '@orcestr/ui';
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

<Button size={3} loading>Loading</Button>
<Button size={3} v='surface' loading leftIcon={<LuCheck size={16} />}>Save</Button>
<Button size={3} tone='success' loading leftIcon={<LuCheck size={16} />}>Success</Button>
<Spinner />`,
    iconButtons: `import {Button, IconButton, Menu, Tooltip} from '@orcestr/ui';
import {LuBell, LuCheck, LuCommand, LuEllipsis, LuInfo} from 'react-icons/lu';

<IconButton v='solid' icon={<LuCheck size={17} />} aria-label='Solid icon' />
<IconButton v='soft' icon={<LuBell size={17} />} aria-label='Soft icon' />
<IconButton v='surface' icon={<LuBell size={17} />} aria-label='Surface icon' />
<IconButton v='pad' icon={<LuBell size={17} />} aria-label='Pad icon' />
<IconButton v='outline' icon={<LuInfo size={17} />} aria-label='Outline icon' />
<IconButton v='ghost' icon={<LuEllipsis size={17} />} aria-label='Ghost icon' />

<IconButton size={1} v='surface' icon={<LuBell size={13} />} aria-label='Size 1 icon' />
<IconButton size={2} v='surface' icon={<LuBell size={15} />} aria-label='Size 2 icon' />
<IconButton size={3} v='surface' icon={<LuBell size={17} />} aria-label='Size 3 icon' />
<IconButton size={4} v='surface' icon={<LuBell size={19} />} aria-label='Size 4 icon' />

<IconButton size={3} v='pad' round={false} r={3} icon={<LuCommand size={17} />} aria-label='Square pad icon' />
<IconButton size={3} v='outline' loading icon={<LuBell size={17} />} aria-label='Loading icon' />

<IconButton size={1} v='ghost' icon={<LuEllipsis size={13} />} aria-label='Ghost size 1' />
<IconButton size={2} v='ghost' icon={<LuEllipsis size={15} />} aria-label='Ghost size 2' />
<IconButton size={3} v='ghost' icon={<LuEllipsis size={17} />} aria-label='Ghost size 3' />
<IconButton size={4} v='ghost' icon={<LuEllipsis size={19} />} aria-label='Ghost size 4' />

<Tooltip content='Notifications'>
    <IconButton v='surface' icon={<LuBell size={17} />} aria-label='Notifications' />
</Tooltip>
<IconButton v='surface' loading icon={<LuBell size={17} />} aria-label='Loading action' />
<IconButton v='pad' icon={<LuBell size={17} />} aria-label='Pad action' />
<Menu
    trigger={<IconButton v='surface' icon={<LuEllipsis size={17} />} aria-label='Actions' />}
    items={menuItems}
/>
<Button v='surface' leftIcon={<LuCommand size={16} />} onClick={openPalette}>
    Commands
</Button>`,
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
    selection: `import {Combobox, EntityPicker, MultiSelect, Select, SegmentedControl} from '@orcestr/ui';
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
    borderColor='color-mix(in srgb, var(--oui-brand) 34%, var(--oui-border))'
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
    borderColor='color-mix(in srgb, var(--oui-brand) 38%, var(--oui-border))'
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
    borderColor='color-mix(in srgb, var(--oui-brand) 42%, var(--oui-border))'
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
    borderColor='color-mix(in srgb, var(--oui-brand) 42%, var(--oui-border))'
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
    description='Legacy rise animation kept as an explicit modal animation variant.'
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
    borderColor='color-mix(in srgb, var(--oui-danger) 46%, var(--oui-border))'
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
            description: 'Start a workflow.',
            shortcut: 'C',
            group: 'Create',
            keywords: ['new', 'workflow'],
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
            message: 'Custom blur and translucent background.',
            position: 'bottom-right',
            background: 'rgb(18 24 34 / 72%)',
            blur: 18,
            borderColor: 'rgb(255 255 255 / 18%)',
            duration: 5200,
        })
    }
>
    Glass
</Button>
<Button
    onClick={() =>
        toast.info({
            title: 'Static background',
            message: 'Blur can be disabled per toast.',
            position: 'bottom-left',
            background: 'var(--oui-floating-bg)',
            blur: false,
            duration: 5200,
        })
    }
>
    Static
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
    background?: string;
    blur?: number | string | false;
}> = [
    {
        position: 'top-left',
        label: 'Status synced',
        tone: 'success',
        message: 'Glass toast from the left edge.',
        blur: 14,
    },
    {
        position: 'top-center',
        label: 'Command ready',
        tone: 'info',
        message: 'Centered toast drops from the top.',
        background: 'rgb(18 28 42 / 88%)',
        blur: 10,
    },
    {
        position: 'top-right',
        label: 'Needs attention',
        tone: 'warning',
        message: 'Right edge bubble animation.',
        blur: 12,
    },
    {
        position: 'bottom-left',
        label: 'Import queued',
        tone: 'info',
        message: 'Static background, no blur.',
        blur: false,
    },
    {
        position: 'bottom-center',
        label: 'Batch completed',
        tone: 'success',
        message: 'Bottom center rises into place.',
        blur: 16,
    },
    {
        position: 'bottom-right',
        label: 'Export failed',
        tone: 'danger',
        message: 'Actionable toast from the right edge.',
        blur: 12,
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
                message: 'Positioned toast with directional bubble animation.',
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
                    background: item.background,
                    blur: item.blur,
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
/>`,} satisfies Record<string, string>;
