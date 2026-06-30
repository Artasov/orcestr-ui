'use client';

import {Badge, Stack, Text} from '..';
import {ExampleTile} from './CodePreview';
import {type CodeExample} from './codeSamples';
import {UiExampleSection} from './UiExampleSection';

const providerSample: CodeExample = {
    title: 'OrcestrUiProvider',
    code: `import {OrcestrUiProvider} from '@orcestr/ui';

<OrcestrUiProvider
    surface='operations'
    locale='ru'
>
    <App />
</OrcestrUiProvider>`,
};

export function FoundationsSection({
    onOpenCode,
}: {
    onOpenCode: (example: CodeExample) => void;
}) {
    return (
        <UiExampleSection
            id='foundations'
            title='Контракты библиотеки'
            description='Базовые правила подключения Orcestr UI: provider, публичный API, токены и проверки.'
        >
            <Stack g={3}>
                <ExampleTile
                    id='provider-contract-example'
                    title='OrcestrUiProvider'
                    code={providerSample.code}
                    onOpen={onOpenCode}
                >
                    <div className='oui-ui-contract-grid'>
                        {[
                            ['Provider', 'theme, locale, portal, overlays, toast'],
                            ['Публичный API', 'size, tone, v, disabled, loading, invalid, testId'],
                            ['Стили', 'только oui-* классы внутри @orcestr/ui/styles.css'],
                            ['Проверки', 'tsc, contract tests, diff check, /ui smoke'],
                        ].map(([title, description]) => (
                            <div key={title} className='oui-ui-contract-item'>
                                <Badge tone='brand'>{title}</Badge>
                                <Text fs='12px' tone='muted'>
                                    {description}
                                </Text>
                            </div>
                        ))}
                    </div>
                </ExampleTile>
            </Stack>
        </UiExampleSection>
    );
}
