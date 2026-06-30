'use client';

import {useState} from 'react';

import {
    AppShellNav,
    Badge,
    Box,
    Button,
    Collapse,
    Flex,
    Grid,
    PageTitleBlock,
    ScrollArea,
    Skeleton,
    Stack,
    Text,
    TopHighlight,
    BottomHighlight,
} from '..';
import {ExampleTile} from './CodePreview';
import {codeSamples, type CodeExample} from './codeSamples';
import {UiExampleSection} from './UiExampleSection';

type ExampleSectionProps = {
    onOpenCode: (example: CodeExample) => void;
};

export function TypographySection({onOpenCode}: ExampleSectionProps) {
    return (
        <>
        <UiExampleSection
            id='typography'
            title='Typography'
            description='Text and shared system props.'
        >
                <ExampleTile
                        title='Typography'
                        code={codeSamples.typography}
                        onOpen={onOpenCode}
                    >
                    <Stack g={3}>
                        <Stack g={1}>
                            <Text as='h1' fs='28px' fw={780} lh={1.1}>
                                Workflow review
                            </Text>
                            <Text as='h2' fs='20px' fw={720} lh={1.2}>
                                Review window and status
                            </Text>
                            <Text tone='muted' fs='13px' lh={1.5}>
                                Compact operational text with muted metadata and predictable line height.
                            </Text>
                        </Stack>
                        <Stack g={1}>
                            <Text fs='15px' fw={700}>Body strong text</Text>
                            <Text fs='14px' lh={1.55}>Body regular text for dense forms and tables.</Text>
                            <Text fs='12px' tone='muted' lh={1.4}>Caption text, helper text and quiet labels.</Text>
                        </Stack>
                        <Flex g={2} wrap>
                            <Text tone='brand' fw={700}>Brand</Text>
                            <Text tone='success' fw={700}>Success</Text>
                            <Text tone='warning' fw={700}>Warning</Text>
                            <Text tone='danger' fw={700}>Danger</Text>
                            <Text tone='info' fw={700}>Info</Text>
                        </Flex>
                        <Box w='100%' p={2} r={3} style={{background: 'var(--oui-gray-a3)'}}>
                            <Text display='block' truncate>
                                This is a long single line value that truncates cleanly inside a constrained row.
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
                    </Stack>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='skeleton-example'
            title='Skeleton'
            description='Loading placeholder primitives.'
        >
                <ExampleTile
                        title='Skeleton'
                        code={codeSamples.skeleton}
                        onOpen={onOpenCode}
                    >
                    <Stack g={2}>
                        <Skeleton h={16} w='80%' />
                        <Skeleton h={16} w='64%' />
                        <Skeleton h={36} />
                    </Stack>
                </ExampleTile>
        </UiExampleSection>
        </>
    );
}

export function LayoutSection({onOpenCode}: ExampleSectionProps) {
    const [detailsOpen, setDetailsOpen] = useState(true);

    return (
        <>
        <UiExampleSection
            id='app-shell-example'
            title='AppShell'
            description='Shared module frame primitives.'
        >
                <ExampleTile
                        title='AppShell primitives'
                        code={codeSamples.appShell}
                        onOpen={onOpenCode}
                    >
                    <Stack g={3}>
                        <PageTitleBlock
                            title='Operations'
                            caption='Shared module frame with themed navigation and page actions.'
                            badge='shell'
                            action={<Button size={1}>Create</Button>}
                        />
                        <AppShellNav
                            items={[
                                {key: 'queue', label: 'Queue', caption: 'Daily operations', active: true},
                                {key: 'status', label: 'Status', caption: 'Inventory control', badge: 12},
                                {key: 'reports', label: 'Reports', caption: 'Exports and analytics'},
                            ]}
                        />
                    </Stack>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='flex-example'
            title='Flex'
            description='Row and column alignment primitive.'
        >
                <ExampleTile
                        title='Flex'
                        code={codeSamples.layoutFlex}
                        onOpen={onOpenCode}
                    >
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
                                <Flex
                                    key={item}
                                    col
                                    g={1}
                                    p={2}
                                    r={3}
                                    flex='1 1 150px'
                                    style={{background: 'var(--oui-gray-a3)'}}
                                >
                                    <Text fs='12px' tone='muted'>Step {index + 1}</Text>
                                    <Text fw={700}>{item}</Text>
                                </Flex>
                            ))}
                        </Flex>
                    </Flex>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='stack-example'
            title='Stack'
            description='Vertical spacing primitive.'
        >
                <ExampleTile
                        title='Stack'
                        code={codeSamples.layoutStack}
                        onOpen={onOpenCode}
                    >
                    <Stack g={2}>
                        {[
                            ['Created', 'Draft created from intake'],
                            ['Reserved', 'Capacity is reserved for review'],
                            ['Scheduled', 'Review window is confirmed'],
                        ].map(([title, description]) => (
                            <Flex
                                key={title}
                                row
                                g={2}
                                p={2}
                                r={3}
                                a='s'
                                style={{background: 'var(--oui-gray-a3)'}}
                            >
                                <Box size={8} r={7} mt={1} style={{background: 'var(--oui-brand)'}} />
                                <Stack g={0}>
                                    <Text fs='13px' fw={700}>{title}</Text>
                                    <Text fs='12px' tone='muted' lh={1.45}>{description}</Text>
                                </Stack>
                            </Flex>
                        ))}
                    </Stack>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='collapse-example'
            title='Collapse'
            description='Expandable content primitive.'
        >
                <ExampleTile
                        title='Collapse'
                        code={codeSamples.layoutCollapse}
                        onOpen={onOpenCode}
                    >
                    <Stack g={2}>
                        <Flex row g={2} a='c' j='sb'>
                            <Text fw={700}>Item details</Text>
                            <Button size={1} v='surface' onClick={() => setDetailsOpen((open) => !open)}>
                                {detailsOpen ? 'Hide' : 'Show'}
                            </Button>
                        </Flex>
                        <Collapse open={detailsOpen}>
                            <Stack g={2} p={2} r={3} style={{background: 'var(--oui-gray-a3)'}}>
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
                    </Stack>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='grid-example'
            title='Grid'
            description='Grid layout primitive.'
        >
                <ExampleTile
                        title='Grid'
                        code={codeSamples.layoutGrid}
                        onOpen={onOpenCode}
                    >
                    <Grid columns='repeat(3, minmax(0, 1fr))' g={2}>
                        {['A', 'B', 'C', 'D', 'E', 'F'].map((item) => (
                            <Box
                                key={item}
                                p={2}
                                r={3}
                                ta='center'
                                style={{background: 'var(--oui-gray-a3)'}}
                            >
                                <Text fs='13px' fw={700}>{item}</Text>
                            </Box>
                        ))}
                    </Grid>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='highlight-primitives-example'
            title='Highlight primitives'
            description='Standalone edge mask primitives.'
        >
                <ExampleTile
                        title='Highlight primitives'
                        code={codeSamples.highlights}
                        onOpen={onOpenCode}
                    >
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
                    </div>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='scroll-area-example'
            title='ScrollArea'
            description='Themed scroll container with optional edge highlights.'
        >
                <ExampleTile
                        title='ScrollArea'
                        code={codeSamples.scrollArea}
                        onOpen={onOpenCode}
                    >
                    <Stack g={2}>
                        <ScrollArea h={116} pr={1}>
                            <Stack g={1}>
                                {Array.from({length: 10}, (_, index) => (
                                    <Box
                                        key={index}
                                        p={2}
                                        r={3}
                                        style={{background: 'var(--oui-gray-a3)'}}
                                    >
                                        <Text fs='13px'>Scroll row {index + 1}</Text>
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
                                {Array.from({length: 8}, (_, index) => (
                                    <Box
                                        key={index}
                                        p={2}
                                        r={3}
                                        style={{background: 'var(--oui-gray-a3)'}}
                                    >
                                        <Text fs='13px'>Both edges row {index + 1}</Text>
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
                                {[
                                    ['Queued', 'No top shade at the initial position.'],
                                    ['Reserved', 'The top shade starts after 50px.'],
                                    ['Packed', 'Opacity reaches maximum over 160px.'],
                                    ['Labeled', 'Bottom shade fades near the end.'],
                                    ['Reviewed', 'Each edge has its own configuration.'],
                                    ['Delivered', 'The gradient uses the solid surface color.'],
                                    ['Checked', 'Content remains readable under the fade.'],
                                    ['Archived', 'The bottom edge disappears at the end.'],
                                ].map(([title, description], index) => (
                                    <Flex
                                        key={title}
                                        row
                                        g={2}
                                        p={2}
                                        r={3}
                                        a='c'
                                        style={{background: 'var(--oui-gray-a3)'}}
                                    >
                                        <Badge tone={index < 3 ? 'brand' : 'info'}>
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
                    </Stack>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='system-radius-example'
            title='System radius'
            description='Radius system prop scale.'
        >
                <ExampleTile
                        title='System radius'
                        code={codeSamples.systemRadius}
                        onOpen={onOpenCode}
                    >
                    <Flex g={2} a='c' wrap>
                        {([0, 2, 4, 6, 7] as const).map((radius) => (
                            <Box
                                key={radius}
                                size={32}
                                r={radius}
                                display='flex'
                                a='c'
                                j='c'
                                style={{background: 'var(--oui-gray-a3)'}}
                            >
                                <Text fs='12px' fw={700}>{radius}</Text>
                            </Box>
                        ))}
                    </Flex>
                    <Button mt={2} v='pad' r={7}>
                        Button r=7
                    </Button>
                </ExampleTile>
        </UiExampleSection>
        </>
    );
}
