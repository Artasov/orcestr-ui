import {Flex} from '../Flex/Flex';
import {DatePicker, type DatePickerProps} from '../DatePicker/DatePicker';

export type DateRangePickerValue = {from: string; to: string};

export function DateRangePicker({
    value,
    onValueChange,
    min,
    max,
    disabledDate,
    fromPlaceholder,
    toPlaceholder,
    clearable,
    disabled,
    readOnly,
    testId,
}: {
    value: DateRangePickerValue;
    onValueChange: (value: DateRangePickerValue) => void;
    min?: string;
    max?: string;
    disabledDate?: DatePickerProps['disabledDate'];
    fromPlaceholder?: string;
    toPlaceholder?: string;
    clearable?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    testId?: string;
}) {
    return (
        <Flex g={2} testId={testId}>
            <DatePicker
                value={value.from}
                min={min}
                max={value.to || max}
                disabledDate={disabledDate}
                placeholder={fromPlaceholder}
                clearable={clearable}
                disabled={disabled}
                readOnly={readOnly}
                testId={testId ? `${testId}-from` : undefined}
                onValueChange={(from) => onValueChange({...value, from})}
            />
            <DatePicker
                value={value.to}
                min={value.from || min}
                max={max}
                disabledDate={disabledDate}
                placeholder={toPlaceholder}
                clearable={clearable}
                disabled={disabled}
                readOnly={readOnly}
                testId={testId ? `${testId}-to` : undefined}
                onValueChange={(to) => onValueChange({...value, to})}
            />
        </Flex>
    );
}
