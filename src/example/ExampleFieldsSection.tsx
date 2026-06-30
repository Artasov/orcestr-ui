'use client';

import {LuSearch} from 'react-icons/lu';

import {
    Button,
    DatePicker,
    DateRangePicker,
    DateRangePresetPicker,
    Flex,
    Field,
    Grid,
    NumberField,
    Section,
    Stack,
    StepperInput,
    Text,
    TextArea,
    TextField,
} from '..';
import {ExampleTile} from './CodePreview';
import {codeSamples, type CodeExample} from './codeSamples';
import {UiExampleSection} from './UiExampleSection';

type DateRangeValue = {
    from: string;
    to: string;
};

type FieldsSectionProps = {
    stepperValue: number;
    onStepperValueChange: (value: number) => void;
    dateValue: string;
    onDateValueChange: (value: string) => void;
    dateRange: DateRangeValue;
    onDateRangeChange: (value: DateRangeValue) => void;
    onOpenCode: (example: CodeExample) => void;
};

export function FieldsSection({
    stepperValue,
    onStepperValueChange,
    dateValue,
    onDateValueChange,
    dateRange,
    onDateRangeChange,
    onOpenCode,
}: FieldsSectionProps) {
    return (
        <>
        <UiExampleSection
            id='text-fields-example'
            title='Text fields'
            description='TextField and TextArea inside Field.'
        >
                <ExampleTile
                    title='Text fields'
                    code={codeSamples.textFields}
                    onOpen={onOpenCode}
                >
                    <Field label='Search' helperText='Clearable field with left slot.'>
                        <Flex g={2} a='c'>
                            <TextField
                                size={2}
                                placeholder='Search item'
                                clearable
                                leftSlot={<LuSearch size={16} />}
                            />
                            <Button size={2} v='surface'>
                                Search
                            </Button>
                        </Flex>
                    </Field>
                    <Field label='Comment'>
                        <TextArea rows={4} placeholder='Internal note' />
                    </Field>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='grouped-fields-example'
            title='Grouped fields'
            description='Layout primitives group fields without owning form state.'
        >
                <ExampleTile
                    title='Grouped fields'
                    code={codeSamples.groupedFields}
                    onOpen={onOpenCode}
                >
                    <Section g={3}>
                        <Stack g={1}>
                            <Text fw={760}>Request details</Text>
                            <Text fs='12px' tone='muted'>
                                Layout primitives group fields without owning state.
                            </Text>
                        </Stack>
                        <Stack g={3}>
                            <Grid columns='repeat(auto-fit, minmax(min(100%, 180px), 1fr))' g={3}>
                                <Field label='Source' required error='Choose a source'>
                                    <TextField placeholder='Search source' invalid />
                                </Field>
                                <Field label='Contact'>
                                    <TextField placeholder='Name or email' />
                                </Field>
                            </Grid>
                            <Field
                                label='Review note'
                                helperText='Visible to operators.'
                            >
                                <TextArea rows={3} placeholder='Internal instructions' />
                            </Field>
                            <Flex g={2} j='e' wrap>
                                <Button type='button' v='surface'>
                                    Cancel
                                </Button>
                                <Button type='button'>Save request</Button>
                            </Flex>
                        </Stack>
                    </Section>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='number-date-fields-example'
            title='Number and date fields'
            description='StepperInput, NumberField and DatePicker.'
        >
                <ExampleTile
                    title='Number and date fields'
                    code={codeSamples.numberAndDateFields}
                    onOpen={onOpenCode}
                >
                    <Field label='Quantity'>
                        <StepperInput
                            value={stepperValue}
                            onChange={onStepperValueChange}
                            min={0}
                            max={200}
                        />
                    </Field>
                    <Field label='Price'>
                        <NumberField defaultValue={1250} min={0} />
                    </Field>
                    <Field label='Date'>
                        <DatePicker value={dateValue} onValueChange={onDateValueChange} />
                    </Field>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='date-range-example'
            title='Date range'
            description='DateRangePicker and preset helper.'
        >
                <ExampleTile
                    title='Date range'
                    code={codeSamples.dateRangeFields}
                    onOpen={onOpenCode}
                >
                    <Field label='Range'>
                        <DateRangePicker value={dateRange} onValueChange={onDateRangeChange} />
                    </Field>
                    <DateRangePresetPicker
                        today='2026-06-26'
                        onValueChange={onDateRangeChange}
                    />
                    <Text fs='12px' tone='muted'>
                        Date inputs stay as controls. Form ownership belongs to the application.
                    </Text>
                </ExampleTile>
        </UiExampleSection>
        </>
    );
}
