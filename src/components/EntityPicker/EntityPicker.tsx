'use client';

import type { ReactNode } from 'react';

import type { UiSize } from '../../theme/systemProps.js';
import { useOrcestrUiLocale } from '../../locale/LocaleProvider.js';
import {
    PaginatedCombobox,
    type PaginatedComboboxOptionAction,
    type PaginatedComboboxProps,
    type PaginatedResult,
} from '../PaginatedCombobox/PaginatedCombobox.js';

export type EntityPickerCreateAction = {
    label?: string | ((search: string) => string);
    onCreate: (search: string) => void;
    disabled?: boolean;
};

export type EntityPickerOptionAction<T> = PaginatedComboboxOptionAction<T>;

export type EntityPickerProps<T> = {
    loadPage: (page: number, search: string) => Promise<PaginatedResult<T>>;
    getEntityId: (item: T) => string | number;
    renderEntity: (item: T) => ReactNode;
    value: T | null;
    onValueChange: (item: T | null) => void;
    renderValue?: (item: T) => ReactNode;
    placeholder?: string;
    emptyText?: ReactNode;
    loadingText?: ReactNode;
    errorText?: ReactNode;
    retryLabel?: ReactNode;
    autoFocusSearch?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    showChevron?: boolean;
    trigger?: ReactNode;
    size?: UiSize;
    maxHeight?: number;
    closeOnSelect?: boolean;
    isEntitySelected?: (item: T) => boolean;
    createAction?: EntityPickerCreateAction;
    optionAction?: EntityPickerOptionAction<T>;
    resetKey?: unknown;
    debounceMs?: number;
    testId?: string;
    floatingLabel?: ReactNode;
    floatingColor?: string;
};

export function EntityPicker<T>({
    loadPage,
    getEntityId,
    renderEntity,
    renderValue,
    value,
    onValueChange,
    placeholder,
    emptyText,
    loadingText,
    errorText,
    retryLabel,
    autoFocusSearch = false,
    disabled = false,
    clearable = true,
    showChevron = true,
    trigger,
    size = 3,
    maxHeight = 280,
    closeOnSelect = true,
    isEntitySelected,
    createAction,
    optionAction,
    resetKey,
    debounceMs,
    testId,
    floatingLabel,
    floatingColor,
}: EntityPickerProps<T>) {
    const { copy } = useOrcestrUiLocale();
    const searchAction: PaginatedComboboxProps<T>['searchAction'] = createAction
        ? {
              label:
                  typeof createAction.label === 'string'
                      ? createAction.label
                      : (createAction.label ?? copy.common.selectEntity),
              disabled: createAction.disabled,
              onClick: (search) => createAction.onCreate(search),
          }
        : undefined;

    return (
        <PaginatedCombobox<T>
            loadPage={loadPage}
            getItemId={getEntityId}
            renderOption={(item) => (
                <div className="oui-entity-picker-option">{renderEntity(item)}</div>
            )}
            renderSelectedLabel={(item) => (
                <span className="oui-entity-picker-value">
                    {renderValue?.(item) ?? renderEntity(item)}
                </span>
            )}
            value={value}
            onChange={onValueChange}
            placeholder={placeholder ?? copy.common.selectEntity}
            emptyText={emptyText ?? copy.common.noOptions}
            loadingText={loadingText}
            errorText={errorText}
            retryLabel={retryLabel}
            autoFocusSearch={autoFocusSearch}
            disabled={disabled}
            clearable={clearable}
            showChevron={showChevron}
            trigger={trigger}
            size={size}
            maxHeight={maxHeight}
            closeOnSelect={closeOnSelect}
            isItemSelected={isEntitySelected}
            searchAction={searchAction}
            optionAction={optionAction}
            resetKey={resetKey}
            debounceMs={debounceMs}
            testId={testId}
            floatingLabel={floatingLabel}
            floatingColor={floatingColor}
        />
    );
}
