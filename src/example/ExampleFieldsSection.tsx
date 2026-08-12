'use client';

import { useMemo, useState } from 'react';
import {
    LuCalendarDays,
    LuCalendarRange,
    LuCheck,
    LuHistory,
    LuPencil,
    LuSearch,
} from 'react-icons/lu';

import {
    Badge,
    Button,
    DatePicker,
    DateRangePicker,
    DateRangePresetPicker,
    Flex,
    Field,
    FloatingTextField,
    Grid,
    IconButton,
    InlineEditField,
    InlineEditMultiField,
    Listbox,
    NumberField,
    Popover,
    Section,
    Stack,
    StepperInput,
    Text,
    TextArea,
    TextField,
} from '../index.js';
import { ExampleTile } from './CodePreview.js';
import { codeSamples, type CodeExample } from './codeSamples.js';
import { UiExampleSection } from './UiExampleSection.js';

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

const inlineSupplierOptions = [
    { key: 'northwind', label: 'Northwind Trading LLC' },
    { key: 'aqua', label: 'Aqua Industrial Co.' },
    { key: 'comfort', label: 'Comfort Sanitary Ware' },
];

const inlineOwnerOptions = [
    { key: 'michael', label: 'Michael Sokolov' },
    { key: 'anna', label: 'Anna Petrova' },
    { key: 'team', label: 'Purchasing team' },
    { key: 'ops', label: 'Operations team' },
];

const inlinePaymentTermOptions = [
    { key: 'prepay', label: 'Prepayment' },
    { key: 'net15', label: 'Net 15' },
    { key: 'net30', label: 'Net 30' },
];

export function FieldsSection({
    stepperValue,
    onStepperValueChange,
    dateValue,
    onDateValueChange,
    dateRange,
    onDateRangeChange,
    onOpenCode,
}: FieldsSectionProps) {
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [ownerOpen, setOwnerOpen] = useState(false);
    const [supplierKey, setSupplierKey] = useState<string | null>('northwind');
    const [paymentTermKey, setPaymentTermKey] = useState<string | null>('net30');
    const [ownerKeys, setOwnerKeys] = useState<string[]>(['michael', 'team']);
    const selectedSupplier = inlineSupplierOptions.find((item) => item.key === supplierKey);
    const selectedPaymentTerm = inlinePaymentTermOptions.find(
        (item) => item.key === paymentTermKey,
    );
    const selectedOwners = useMemo(
        () => inlineOwnerOptions.filter((item) => ownerKeys.includes(item.key)),
        [ownerKeys],
    );
    const toggleOwner = (key: string) => {
        setOwnerKeys((current) =>
            current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
        );
    };

    return (
        <>
            <UiExampleSection
                id="text-fields-example"
                title="Text fields"
                description="Standard and floating-label text inputs in supported sizes."
            >
                <ExampleTile title="Text fields" code={codeSamples.textFields} onOpen={onOpenCode}>
                    <Field label="Search" helperText="Clearable field with left slot.">
                        <Flex g={2} a="c">
                            <TextField
                                size={2}
                                placeholder="Search item"
                                clearable
                                leftSlot={<LuSearch size={16} />}
                            />
                            <Button size={2} v="surface">
                                Search
                            </Button>
                        </Flex>
                    </Field>
                    <Field label="Comment">
                        <TextArea rows={4} placeholder="Internal note" />
                    </Field>
                    <Stack g={3}>
                        <Text fs="12px" fw={760} tone="muted">
                            Floating labels
                        </Text>
                        <Grid columns="repeat(auto-fit, minmax(min(100%, 210px), 1fr))" g={3}>
                            <FloatingTextField size={1} label="Compact" />
                            <FloatingTextField size={2} label="Customer name" />
                            <FloatingTextField
                                size={3}
                                label="Work email"
                                defaultValue="team@orcestr.com"
                            />
                            <FloatingTextField size={4} label="Project title" invalid />
                        </Grid>
                        <Section
                            className="oui-ui-floating-field-color-demo"
                            sectionColor="var(--oui-primary-surface)"
                            sectionOpacity={100}
                            p={4}
                            g={2}
                        >
                            <Text fs="12px" fw={760} tone="primary">
                                Different surface color
                            </Text>
                            <FloatingTextField
                                label="Workspace name"
                                defaultValue="Operations hub"
                            />
                        </Section>
                    </Stack>
                </ExampleTile>
            </UiExampleSection>
            <UiExampleSection
                id="grouped-fields-example"
                title="Grouped fields"
                description="Layout primitives group fields without owning form state."
            >
                <ExampleTile
                    title="Grouped fields"
                    code={codeSamples.groupedFields}
                    onOpen={onOpenCode}
                >
                    <Section g={3} p={4}>
                        <Stack g={1}>
                            <Text fw={760}>Request details</Text>
                            <Text fs="12px" tone="muted">
                                Layout primitives group fields without owning state.
                            </Text>
                        </Stack>
                        <Stack g={3}>
                            <Grid columns="repeat(auto-fit, minmax(min(100%, 180px), 1fr))" g={3}>
                                <Field label="Source" required error="Choose a source">
                                    <TextField placeholder="Search source" invalid />
                                </Field>
                                <Field label="Contact">
                                    <TextField placeholder="Name or email" />
                                </Field>
                            </Grid>
                            <Field label="Review note" helperText="Visible to operators.">
                                <TextArea rows={3} placeholder="Internal instructions" />
                            </Field>
                            <Flex g={2} j="e" wrap>
                                <Button type="button" v="surface">
                                    Cancel
                                </Button>
                                <Button type="button">Save request</Button>
                            </Flex>
                        </Stack>
                    </Section>
                </ExampleTile>
            </UiExampleSection>
            <UiExampleSection
                id="inline-edit-example"
                title="Inline edit"
                description="Compact value displays for editable entity fields."
            >
                <ExampleTile title="Inline edit" code={codeSamples.inlineEdit} onOpen={onOpenCode}>
                    <Stack g={3}>
                        <Field label="Single value">
                            <InlineEditField
                                label={selectedSupplier?.label ?? 'Choose supplier'}
                                meta="Supplier"
                                onOpen={() => setSupplierOpen(true)}
                                action={
                                    <Popover
                                        open={supplierOpen}
                                        onOpenChange={setSupplierOpen}
                                        trigger={
                                            <IconButton
                                                size={1}
                                                v="ghost"
                                                icon={<LuPencil size={13} />}
                                                aria-label="Edit supplier"
                                            />
                                        }
                                        className="oui-combobox-content oui-ui-inline-edit-popover"
                                        sideOffset={4}
                                    >
                                        <Listbox
                                            className="oui-combobox-options"
                                            items={inlineSupplierOptions.map((item) => ({
                                                value: item.key,
                                                label: item.label,
                                            }))}
                                            value={supplierKey}
                                            onValueChange={(nextKey) => {
                                                setSupplierKey(nextKey);
                                                setSupplierOpen(false);
                                            }}
                                        />
                                    </Popover>
                                }
                                clearable={Boolean(selectedSupplier)}
                                onClear={() => setSupplierKey(null)}
                            />
                        </Field>
                        <Field label="Single value without meta">
                            <InlineEditField
                                label={selectedPaymentTerm?.label ?? 'Choose payment terms'}
                                onOpen={() => setPaymentOpen(true)}
                                action={
                                    <Popover
                                        open={paymentOpen}
                                        onOpenChange={setPaymentOpen}
                                        trigger={
                                            <IconButton
                                                size={1}
                                                v="ghost"
                                                icon={<LuPencil size={13} />}
                                                aria-label="Edit payment terms"
                                            />
                                        }
                                        className="oui-combobox-content oui-ui-inline-edit-popover"
                                        sideOffset={4}
                                    >
                                        <Listbox
                                            className="oui-combobox-options"
                                            items={inlinePaymentTermOptions.map((item) => ({
                                                value: item.key,
                                                label: item.label,
                                            }))}
                                            value={paymentTermKey}
                                            onValueChange={(nextKey) => {
                                                setPaymentTermKey(nextKey);
                                                setPaymentOpen(false);
                                            }}
                                        />
                                    </Popover>
                                }
                                clearable={Boolean(selectedPaymentTerm)}
                                onClear={() => setPaymentTermKey(null)}
                            />
                        </Field>
                        <Field label="Multiple values">
                            <InlineEditMultiField
                                onOpen={() => setOwnerOpen(true)}
                                action={
                                    <span onClick={(event) => event.stopPropagation()}>
                                        <Popover
                                            open={ownerOpen}
                                            onOpenChange={setOwnerOpen}
                                            trigger={
                                                <IconButton
                                                    size={1}
                                                    v="ghost"
                                                    icon={<LuPencil size={13} />}
                                                    aria-label="Edit owners"
                                                />
                                            }
                                            className="oui-combobox-content oui-ui-inline-edit-popover"
                                            sideOffset={4}
                                        >
                                            <Stack g={1} p={1}>
                                                {inlineOwnerOptions.map((item) => {
                                                    const selected = ownerKeys.includes(item.key);
                                                    return (
                                                        <button
                                                            key={item.key}
                                                            type="button"
                                                            className="oui-combobox-option oui-ui-inline-edit-option"
                                                            data-selected={
                                                                selected ? 'true' : 'false'
                                                            }
                                                            onClick={() => toggleOwner(item.key)}
                                                        >
                                                            <span className="oui-multi-select-check">
                                                                {selected ? (
                                                                    <LuCheck size={13} />
                                                                ) : null}
                                                            </span>
                                                            <span className="oui-combobox-option-main">
                                                                {item.label}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </Stack>
                                        </Popover>
                                    </span>
                                }
                                col
                                empty="No owners selected"
                            >
                                {selectedOwners.length
                                    ? selectedOwners.map((item, index) => (
                                          <Badge
                                              key={item.key}
                                              tone={index === 0 ? 'info' : 'neutral'}
                                              v="soft"
                                          >
                                              {item.label}
                                          </Badge>
                                      ))
                                    : null}
                            </InlineEditMultiField>
                        </Field>
                        <Field label="Pending update">
                            <InlineEditField label="Payment terms" meta="Saving" busy />
                        </Field>
                    </Stack>
                </ExampleTile>
            </UiExampleSection>
            <UiExampleSection
                id="number-date-fields-example"
                title="Number and date fields"
                description="StepperInput, NumberField and DatePicker."
            >
                <ExampleTile
                    title="Number and date fields"
                    code={codeSamples.numberAndDateFields}
                    onOpen={onOpenCode}
                >
                    <Field label="Quantity">
                        <StepperInput
                            value={stepperValue}
                            onChange={onStepperValueChange}
                            min={0}
                            max={200}
                        />
                    </Field>
                    <Field label="Price">
                        <NumberField defaultValue={1250} min={0} />
                    </Field>
                    <Field label="Date">
                        <DatePicker value={dateValue} onValueChange={onDateValueChange} />
                    </Field>
                </ExampleTile>
            </UiExampleSection>
            <UiExampleSection
                id="date-range-example"
                title="Date range"
                description="DateRangePicker and preset helper."
            >
                <ExampleTile
                    title="Date range"
                    code={codeSamples.dateRangeFields}
                    onOpen={onOpenCode}
                >
                    <Field label="Range">
                        <DateRangePicker value={dateRange} onValueChange={onDateRangeChange} />
                    </Field>
                    <Flex g={2} wrap a="c">
                        <DateRangePresetPicker
                            today="2026-06-26"
                            onValueChange={onDateRangeChange}
                        />
                        <DateRangePresetPicker
                            today="2026-06-26"
                            triggerIcon={<LuCalendarRange size={16} />}
                            triggerLabel="Choose period"
                            triggerButtonProps={{ v: 'surface', tone: 'primary', size: 3 }}
                            triggerLabelProps={{ fs: '13px', fw: 650 }}
                            presets={[
                                'today',
                                {
                                    key: 'previous-week',
                                    label: 'Previous week',
                                    description: 'The seven days before this week',
                                    icon: <LuHistory size={15} />,
                                    range: { from: '2026-06-15', to: '2026-06-21' },
                                },
                                {
                                    key: 'quarter-to-date',
                                    label: 'Quarter to date',
                                    icon: <LuCalendarDays size={15} />,
                                    range: (today) => ({
                                        from: `${today.slice(0, 4)}-04-01`,
                                        to: today,
                                    }),
                                },
                            ]}
                            onValueChange={onDateRangeChange}
                        />
                    </Flex>
                    <Text fs="12px" tone="muted">
                        Date inputs stay as controls. Form ownership belongs to the application.
                    </Text>
                </ExampleTile>
            </UiExampleSection>
        </>
    );
}
