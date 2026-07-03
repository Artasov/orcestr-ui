'use client';

import {Children, isValidElement, type ReactNode} from 'react';

import type {UiSize} from '../../theme/systemProps';
import {cn} from '../../utils/cn';

export type SegmentedControlItem = {
    value: string;
    label: string;
    disabled?: boolean;
};

export function SegmentedControl({
    value,
    onValueChange,
    items,
    size,
    className,
    testId,
}: {
    value: string;
    onValueChange: (value: string) => void;
    items: ReadonlyArray<SegmentedControlItem>;
    size?: UiSize;
    className?: string;
    testId?: string;
}) {
    return (
        <div className={cn('oui-segmented', className)} data-size={size} data-testid={testId}>
            {items.map((item) => (
                <button
                    key={item.value}
                    type='button'
                    className='oui-segmented-item'
                    data-active={value === item.value ? 'true' : undefined}
                    data-testid={testId ? `${testId}-${item.value}` : undefined}
                    disabled={item.disabled}
                    onClick={() => onValueChange(item.value)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}

type SegmentedRootProps = {
    value: string;
    onValueChange: (value: string) => void;
    children: ReactNode;
    size?: UiSize;
    className?: string;
    testId?: string;
};

type SegmentedItemProps = {
    value: string;
    disabled?: boolean;
    children: ReactNode;
};

function SegmentedRoot({
    value,
    onValueChange,
    children,
    size,
    className,
    testId,
}: SegmentedRootProps) {
    const items: SegmentedControlItem[] = [];
    Children.forEach(children, (child) => {
        if (!isValidElement(child) || child.type !== SegmentedItem) return;
        const props = child.props as SegmentedItemProps;
        items.push({
            value: props.value,
            label: String(props.children ?? ''),
            disabled: props.disabled,
        });
    });

    return (
        <SegmentedControl
            value={value}
            onValueChange={onValueChange}
            items={items}
            size={size}
            className={className}
            testId={testId}
        />
    );
}

function SegmentedItem(_props: SegmentedItemProps) {
    return null;
}

Object.assign(SegmentedControl, {
    Root: SegmentedRoot,
    Item: SegmentedItem,
});

export namespace SegmentedControl {
    export const Root = SegmentedRoot;
    export const Item = SegmentedItem;
}
