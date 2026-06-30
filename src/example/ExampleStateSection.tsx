'use client';

import {
    LuCircleAlert,
    LuCircleCheck,
    LuCircleX,
    LuInfo,
    LuLoaderCircle,
} from 'react-icons/lu';

import {
    Button,
    EmptyState,
    ErrorState,
    IconText,
    LoadingState,
    Stack,
    StateCard,
    Text,
} from '..';
import {ExampleTile} from './CodePreview';
import {type CodeExample} from './codeSamples';
import {UiExampleSection} from './UiExampleSection';

const validationItems = [
    {key: 'quantity', label: 'Quantity', message: 'Required value is missing'},
    {key: 'files', label: 'Files', message: 'Add at least one document'},
] as const;

const stateCardSample: CodeExample = {
    title: 'StateCard',
    code: `import {
    Button,
    EmptyState,
    ErrorState,
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
    <div className='oui-ui-state-grid'>
        <EmptyState compact description='No records yet.' />
        <LoadingState compact description='Loading the next page.' />
        <ErrorState compact description='Request failed.' onRetry={reload} />
    </div>
    <StateCard
        tone='success'
        title='Saved'
        description='Changes were applied.'
        action={<Button size={1} v='surface'>Open</Button>}
    />
</Stack>`,
};

const iconTextSample: CodeExample = {
    title: 'IconText',
    code: `import {IconText, Stack} from '@orcestr/ui';
import {LuCircleAlert, LuCircleCheck, LuCircleX, LuInfo, LuLoaderCircle} from 'react-icons/lu';

<Stack g={1}>
    <IconText icon={<LuLoaderCircle />} iconTone='info' iconSpin>Saving changes</IconText>
    <IconText icon={<LuCircleCheck />} iconTone='success'>Saved</IconText>
    <IconText icon={<LuCircleX />} iconTone='danger'>Save failed</IconText>
    <IconText icon={<LuCircleAlert />} iconTone='warning' fw={760}>Review required</IconText>
    <IconText icon={<LuInfo />} iconTone='info' fs='13px'>Sync scheduled</IconText>
</Stack>`,
};

export function StateCardSection({
    onOpenCode,
}: {
    onOpenCode: (example: CodeExample) => void;
}) {
    return (
        <UiExampleSection
            id='state-card-example'
            title='StateCard'
            description='Block-level state for empty, loading, error, access and status surfaces.'
        >
            <ExampleTile
                title='StateCard'
                code={stateCardSample.code}
                onOpen={onOpenCode}
            >
                <Stack g={2}>
                    <StateCard
                        tone='info'
                        title='General state'
                        description='One card for informational, empty, loading and error states.'
                    />
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
                    <div className='oui-ui-state-grid'>
                        <EmptyState compact description='No records yet.' />
                        <LoadingState compact description='Loading the next page.' />
                        <ErrorState
                            compact
                            description='Request failed.'
                            onRetry={() => undefined}
                        />
                    </div>
                    <StateCard
                        tone='success'
                        title='Saved'
                        description='Changes were applied.'
                        action={<Button size={1} v='surface'>Open</Button>}
                    />
                </Stack>
            </ExampleTile>

        </UiExampleSection>
    );
}

export function IconTextSection({
    onOpenCode,
}: {
    onOpenCode: (example: CodeExample) => void;
}) {
    return (
        <UiExampleSection
            id='icon-text-example'
            title='IconText'
            description='Inline text primitive with an icon, text props and independent icon tone.'
        >
            <ExampleTile
                title='IconText'
                code={iconTextSample.code}
                onOpen={onOpenCode}
            >
                <div className='oui-ui-icon-text-list'>
                    <IconText icon={<LuLoaderCircle />} iconTone='info' iconSpin>
                        Saving changes
                    </IconText>
                    <IconText icon={<LuCircleCheck />} iconTone='success'>
                        Saved
                    </IconText>
                    <IconText icon={<LuCircleX />} iconTone='danger'>
                        Save failed
                    </IconText>
                    <IconText icon={<LuCircleAlert />} iconTone='warning' fw={760}>
                        Review required
                    </IconText>
                    <IconText icon={<LuInfo />} iconTone='info' fs='13px'>
                        Sync scheduled
                    </IconText>
                </div>
            </ExampleTile>
        </UiExampleSection>
    );
}
