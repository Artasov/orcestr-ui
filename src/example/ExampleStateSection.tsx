'use client';

import { useState } from 'react';
import {
    LuCircleAlert,
    LuCircleCheck,
    LuCircleX,
    LuClock3,
    LuInfo,
    LuLoaderCircle,
    LuPackageCheck,
    LuShieldCheck,
} from 'react-icons/lu';

import {
    Badge,
    BadgeSelectMenu,
    Button,
    EmptyState,
    ErrorState,
    Flex,
    Grid,
    IconText,
    LoadingState,
    Stack,
    StateCard,
    Text,
} from '../index.js';
import { ExampleTile } from './CodePreview.js';
import { type CodeExample } from './codeSamples.js';
import { UiExampleSection } from './UiExampleSection.js';

const validationItems = [
    { key: 'quantity', label: 'Quantity', message: 'Required value is missing' },
    { key: 'files', label: 'Files', message: 'Add at least one document' },
] as const;

const stateCardSample: CodeExample = {
    title: 'StateCard',
    code: `import {
    Button,
    EmptyState,
    ErrorState,
    Grid,
    LoadingState,
    Stack,
    StateCard,
    Text,
} from '@orcestr/ui';

const validationItems = [
    {key: 'quantity', label: 'Quantity', message: 'Required value is missing'},
    {key: 'files', label: 'Files', message: 'Add at least one document'},
];

<Stack g={2}>
    <StateCard
        tone='info'
        title='General state'
        description='One card for informational, empty, loading and error states.'
    />
    <Grid columns='repeat(auto-fit, minmax(min(100%, 260px), 1fr))' g={2}>
        <StateCard
            v='surface'
            tone='primary'
            title='Surface'
            titleTone='primary'
            description='Uses the regular surface with a toned title.'
            descriptionTone='muted'
        />
        <StateCard
            v='outline'
            tone='warning'
            title='Outline'
            description='Useful when the card should stay quiet.'
        />
        <StateCard
            v='ghost'
            tone='success'
            title='Ghost'
            description='No extra background.'
        />
    </Grid>
    <StateCard tone='danger' title='Validation failed'>
        <Stack g={1}>
            {validationItems.map((item) => (
                <Text key={item.key} fs='13px' lh={1.3}>
                    <strong>{item.label}: </strong>
                    {item.message}
                </Text>
            ))}
        </Stack>
    </StateCard>
    <Grid columns='repeat(auto-fit, minmax(min(100%, 260px), 1fr))' g={2}>
        <EmptyState compact description='No records yet.' />
        <LoadingState compact description='Loading the next page.' />
        <ErrorState compact description='Request failed.' onRetry={reload} />
    </Grid>
    <StateCard
        tone='success'
        title='Saved'
        description='Changes were applied.'
        action={<Button size={1} v='surface'>Open</Button>}
    />
</Stack>`,
};

const badgeSample: CodeExample = {
    title: 'Badge',
    code: `import {useState} from 'react';
import {Badge, BadgeSelectMenu, Flex} from '@orcestr/ui';
import {LuClock3, LuPackageCheck, LuShieldCheck} from 'react-icons/lu';

const [status, setStatus] = useState('review');
const statusItems = [
    {value: 'draft', label: 'Draft'},
    {value: 'review', label: 'Review'},
    {value: 'accepted', label: 'Accepted'},
];

<Flex g={2} wrap>
    <Badge tone='neutral'>Requested <strong>43</strong></Badge>
    <Badge tone='info' icon={<LuClock3 />}>Ordered <strong>12</strong></Badge>
    <Badge tone='success' icon={<LuPackageCheck />}>Accepted <strong>8</strong></Badge>
    <Badge tone='warning' v='surface' icon={<LuShieldCheck />}>Review</Badge>
    <Badge tone='danger' v='outline'>Blocked</Badge>
    <Badge tone='primary' v='solid'>Primary</Badge>
    <BadgeSelectMenu value={status} items={statusItems} onValueChange={setStatus} tone='warning' />
</Flex>`,
};

const iconTextSample: CodeExample = {
    title: 'IconText',
    code: `import {Flex, IconText} from '@orcestr/ui';
import {LuCircleAlert, LuCircleCheck, LuCircleX, LuInfo, LuLoaderCircle} from 'react-icons/lu';

<Flex g={2} wrap>
    <IconText icon={<LuLoaderCircle />} iconTone='info' iconSpin>Saving changes</IconText>
    <IconText icon={<LuCircleCheck />} iconTone='success'>Saved</IconText>
    <IconText icon={<LuCircleX />} iconTone='danger'>Save failed</IconText>
    <IconText icon={<LuCircleAlert />} iconTone='warning' fw={760}>Review required</IconText>
    <IconText icon={<LuInfo />} iconTone='info' fs='13px'>Sync scheduled</IconText>
</Flex>`,
};

export function BadgeSection({ onOpenCode }: { onOpenCode: (example: CodeExample) => void }) {
    const [status, setStatus] = useState('review');
    const statusItems = [
        { value: 'draft', label: 'Draft' },
        { value: 'review', label: 'Review' },
        { value: 'accepted', label: 'Accepted' },
    ];

    return (
        <UiExampleSection
            id="badges-example"
            title="Badge"
            description="Compact counters and statuses without a special wrapper."
        >
            <ExampleTile title="Badge" code={badgeSample.code} onOpen={onOpenCode}>
                <Flex g={2} wrap>
                    <Badge tone="neutral">
                        Requested <strong>43</strong>
                    </Badge>
                    <Badge tone="info" icon={<LuClock3 />}>
                        Ordered <strong>12</strong>
                    </Badge>
                    <Badge tone="success" icon={<LuPackageCheck />}>
                        Accepted <strong>8</strong>
                    </Badge>
                    <Badge tone="warning" v="surface" icon={<LuShieldCheck />}>
                        Review
                    </Badge>
                    <Badge tone="danger" v="outline">
                        Blocked
                    </Badge>
                    <Badge tone="primary" v="solid">
                        Primary
                    </Badge>
                    <BadgeSelectMenu
                        value={status}
                        items={statusItems}
                        onValueChange={setStatus}
                        tone="warning"
                    />
                </Flex>
            </ExampleTile>
        </UiExampleSection>
    );
}

export function StateCardSection({ onOpenCode }: { onOpenCode: (example: CodeExample) => void }) {
    return (
        <UiExampleSection
            id="state-card-example"
            title="StateCard"
            description="Block-level state for empty, loading, error, access and status surfaces."
        >
            <ExampleTile title="StateCard" code={stateCardSample.code} onOpen={onOpenCode}>
                <Stack g={2}>
                    <StateCard
                        tone="info"
                        title="General state"
                        description="One card for informational, empty, loading and error states."
                    />
                    <Grid columns="repeat(auto-fit, minmax(min(100%, 260px), 1fr))" g={2}>
                        <StateCard
                            v="surface"
                            tone="primary"
                            title="Surface"
                            titleTone="primary"
                            description="Uses the regular surface with a toned title."
                            descriptionTone="muted"
                        />
                        <StateCard
                            v="outline"
                            tone="warning"
                            title="Outline"
                            description="Useful when the card should stay quiet."
                        />
                        <StateCard
                            v="ghost"
                            tone="success"
                            title="Ghost"
                            description="No extra background."
                        />
                    </Grid>
                    <StateCard tone="danger" title="Validation failed">
                        <Stack g={1}>
                            {validationItems.map((item) => (
                                <Text key={item.key} fs="13px" lh={1.3}>
                                    <strong>{item.label}: </strong>
                                    {item.message}
                                </Text>
                            ))}
                        </Stack>
                    </StateCard>
                    <Grid columns="repeat(auto-fit, minmax(min(100%, 260px), 1fr))" g={2}>
                        <EmptyState compact description="No records yet." />
                        <LoadingState compact description="Loading the next page." />
                        <ErrorState
                            compact
                            description="Request failed."
                            onRetry={() => undefined}
                        />
                    </Grid>
                    <StateCard
                        tone="success"
                        title="Saved"
                        description="Changes were applied."
                        action={
                            <Button size={1} v="surface">
                                Open
                            </Button>
                        }
                    />
                </Stack>
            </ExampleTile>
        </UiExampleSection>
    );
}

export function IconTextSection({ onOpenCode }: { onOpenCode: (example: CodeExample) => void }) {
    return (
        <UiExampleSection
            id="icon-text-example"
            title="IconText"
            description="Inline text primitive with an icon, text props and independent icon tone."
        >
            <ExampleTile title="IconText" code={iconTextSample.code} onOpen={onOpenCode}>
                <Flex g={2} wrap>
                    <IconText icon={<LuLoaderCircle />} iconTone="info" iconSpin>
                        Saving changes
                    </IconText>
                    <IconText icon={<LuCircleCheck />} iconTone="success">
                        Saved
                    </IconText>
                    <IconText icon={<LuCircleX />} iconTone="danger">
                        Save failed
                    </IconText>
                    <IconText icon={<LuCircleAlert />} iconTone="warning" fw={760}>
                        Review required
                    </IconText>
                    <IconText icon={<LuInfo />} iconTone="info" fs="13px">
                        Sync scheduled
                    </IconText>
                </Flex>
            </ExampleTile>
        </UiExampleSection>
    );
}
