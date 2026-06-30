'use client';

import {useCallback} from 'react';
import {LuHistory, LuListChecks, LuPlus} from 'react-icons/lu';

import {
    Checkbox,
    Combobox,
    EntityPicker,
    MultiSelect,
    RadioGroup,
    SegmentedControl,
    Select,
    Switch,
    Tabs,
    Text,
    type OrcestrUiLocale,
} from '..';
import {ExampleTile} from './CodePreview';
import {codeSamples, type CodeExample} from './codeSamples';
import {
    getOptionItems,
    getOwnerItems,
    loadEntityPage,
    type EntityOption,
} from './exampleData';
import {UiExampleSection} from './UiExampleSection';

type ToastTone = 'info' | 'success' | 'danger';

type SelectionSectionProps = {
    locale: OrcestrUiLocale;
    segment: string;
    onSegmentChange: (value: string) => void;
    selectValue: string | null;
    onSelectValueChange: (value: string | null) => void;
    selectNoChevronValue: string | null;
    onSelectNoChevronValueChange: (value: string | null) => void;
    selectPlainValue: string | null;
    onSelectPlainValueChange: (value: string | null) => void;
    comboValue: string | null;
    onComboValueChange: (value: string | null) => void;
    entityValue: EntityOption | null;
    onEntityValueChange: (value: EntityOption | null) => void;
    ownerValues: string[];
    onOwnerValuesChange: (value: string[]) => void;
    radioValue: string;
    onRadioValueChange: (value: string) => void;
    tabValue: string;
    onTabValueChange: (value: string) => void;
    onOpenCode: (example: CodeExample) => void;
    onToast: (title: string, tone?: ToastTone) => void;
};

export function SelectionSection({
    locale,
    segment,
    onSegmentChange,
    selectValue,
    onSelectValueChange,
    selectNoChevronValue,
    onSelectNoChevronValueChange,
    selectPlainValue,
    onSelectPlainValueChange,
    comboValue,
    onComboValueChange,
    entityValue,
    onEntityValueChange,
    ownerValues,
    onOwnerValuesChange,
    radioValue,
    onRadioValueChange,
    tabValue,
    onTabValueChange,
    onOpenCode,
    onToast,
}: SelectionSectionProps) {
    const optionItems = getOptionItems(locale);
    const ownerItems = getOwnerItems(locale);
    const copy = selectionCopy[locale];
    const loadLocalizedEntityPage = useCallback(
        (page: number, search: string) => loadEntityPage(locale, page, search),
        [locale],
    );

    return (
        <>
        <UiExampleSection
            id='selects-example'
            title='Selects'
            description='Select, Combobox, MultiSelect, EntityPicker and SegmentedControl.'
        >
                <ExampleTile
                        title='Selects and comboboxes'
                        code={codeSamples.selection}
                        onOpen={onOpenCode}
                    >
                    <Select
                        items={optionItems}
                        value={selectValue}
                        onValueChange={onSelectValueChange}
                        clearable
                    />
                    <Select
                        items={optionItems}
                        value={selectNoChevronValue}
                        onValueChange={onSelectNoChevronValueChange}
                        clearable
                        showChevron={false}
                        placeholder='Clearable without chevron'
                    />
                    <Select
                        items={optionItems}
                        value={selectPlainValue}
                        onValueChange={onSelectPlainValueChange}
                        clearable={false}
                        showChevron={false}
                        placeholder='Plain select'
                    />
                    <Combobox
                        items={optionItems}
                        value={comboValue}
                        onValueChange={onComboValueChange}
                        placeholder='Find status'
                    />
                    <MultiSelect
                        items={ownerItems}
                        value={ownerValues}
                        onValueChange={onOwnerValuesChange}
                        placeholder={copy.responsibleUsers}
                        clearable
                        renderValue={(items) =>
                            items.length === 1
                                ? items[0]?.label
                                : copy.responsibleCount(items.length)
                        }
                    />
                    <EntityPicker<EntityOption>
                        value={entityValue}
                        onValueChange={onEntityValueChange}
                        loadPage={loadLocalizedEntityPage}
                        getEntityId={(item) => item.id}
                        renderValue={(item) => item.article}
                        renderEntity={(item) => (
                            <>
                                <span className='oui-entity-option-main'>
                                    <span className='oui-entity-option-code'>
                                        {item.article}
                                    </span>
                                    <span className='oui-entity-option-meta'>
                                        {item.name}
                                    </span>
                                </span>
                                <span className='oui-entity-option-badge'>
                                    {item.status}
                                </span>
                            </>
                        )}
                        placeholder={copy.entityPicker}
                        clearable
                        createAction={{
                            label: copy.createEntityFromSearch,
                            onCreate: (search) =>
                                onToast(copy.createEntityToast(search), 'info'),
                        }}
                        optionAction={{
                            icon: <LuPlus size={14} />,
                            label: (item) => copy.addEntity(item.article),
                            onClick: (item) =>
                                onToast(copy.entityAction(item.article), 'success'),
                        }}
                    />
                    <SegmentedControl
                        items={[
                            {value: 'active', label: 'Active'},
                            {value: 'drafts', label: 'Drafts'},
                            {value: 'archive', label: 'Archive'},
                        ]}
                        value={segment}
                        onValueChange={onSegmentChange}
                    />
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='choice-controls-example'
            title='Checkbox, switch and radio'
            description='Binary and single-choice controls.'
        >
                <ExampleTile
                        title='Checkbox, switch and radio'
                        code={codeSamples.selectionGroup}
                        onOpen={onOpenCode}
                    >
                    <Checkbox defaultChecked>Confirmed</Checkbox>
                    <Checkbox>Needs review</Checkbox>
                    <Checkbox disabled>Locked option</Checkbox>
                    <Switch defaultChecked>Auto updates</Switch>
                    <Switch>Manual mode</Switch>
                    <Switch disabled>Disabled switch</Switch>
                    <RadioGroup
                        value={radioValue}
                        onValueChange={onRadioValueChange}
                        name='oui-example-mode'
                        items={[
                            {value: 'manual', label: 'Manual'},
                            {value: 'auto', label: 'Automatic'},
                        ]}
                    />
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='tabs-example'
            title='Tabs'
            description='Segmented content navigation with icons, badges and controlled value.'
        >
                <ExampleTile
                        title='Tabs'
                        code={codeSamples.tabs}
                        onOpen={onOpenCode}
                    >
                    <Tabs
                        value={tabValue}
                        onValueChange={onTabValueChange}
                        items={[
                            {
                                value: 'overview',
                                label: 'Overview',
                                icon: <LuListChecks size={16} />,
                                badge: '12',
                                content: <Text color='var(--oui-muted)'>Main summary tab.</Text>,
                            },
                            {
                                value: 'history',
                                label: 'History',
                                icon: <LuHistory size={16} />,
                                content: <Text color='var(--oui-muted)'>History and changes.</Text>,
                            },
                        ]}
                    />
                </ExampleTile>
        </UiExampleSection>
        </>
    );
}

const selectionCopy = {
    ru: {
        responsibleUsers: 'Ответственные',
        responsibleCount: (count: number) => `${count} ответственных`,
        entityPicker: 'Выбор объекта',
        createEntityFromSearch: 'Создать объект из поиска',
        createEntityToast: (search: string) => `Создать объект: ${search}`,
        addEntity: (article: string) => `Добавить ${article}`,
        entityAction: (article: string) => `Действие: ${article}`,
    },
    en: {
        responsibleUsers: 'Responsible users',
        responsibleCount: (count: number) => `${count} responsible`,
        entityPicker: 'Entity picker',
        createEntityFromSearch: 'Create entity from search',
        createEntityToast: (search: string) => `Create entity: ${search}`,
        addEntity: (article: string) => `Add ${article}`,
        entityAction: (article: string) => `Action: ${article}`,
    },
} satisfies Record<OrcestrUiLocale, {
    responsibleUsers: string;
    responsibleCount: (count: number) => string;
    entityPicker: string;
    createEntityFromSearch: string;
    createEntityToast: (search: string) => string;
    addEntity: (article: string) => string;
    entityAction: (article: string) => string;
}>;
