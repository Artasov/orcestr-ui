'use client';

import {
    createContext,
    useContext,
    useMemo,
    type ReactNode,
} from 'react';

export type OrcestrUiLocale = 'en' | 'ru';

export type OrcestrUiCopy = {
    common: {
        clear: string;
        close: string;
        retry: string;
        reset: string;
        save: string;
        previous: string;
        next: string;
        loading: string;
        noData: string;
        noOptions: string;
        selectValue: string;
        selectEntity: string;
        search: string;
        dismissNotification: string;
        openNavigation: string;
        closeNavigation: string;
        primaryNavigation: string;
        send: string;
        voice: string;
        cancelRecording: string;
        openCalendar: string;
        resizeColumn: string;
        commandPaletteResults: string;
        clearRange: string;
        clearSelectedValues: string;
        details: string;
        decrease: string;
        increase: string;
        compare: string;
        from: string;
        to: string;
    };
    table: {
        selectAllRows: string;
        selectRow: string;
        clearSelection: string;
        selected: (count: number) => string;
        shownOfTotal: (shown: number, total: number) => string;
        unableToLoad: string;
        loadingRows: string;
        expandRow: string;
        collapseRow: string;
        moveColumnLeft: string;
        moveColumnRight: string;
        columnSettings: string;
    };
    filters: {
        active: (count: number) => string;
        advanced: string;
        pageSize: string;
        saveView: string;
        visibleFilters: string;
        savedFilters: string;
    };
    command: {
        title: string;
        description: string;
        placeholder: string;
        empty: string;
        recent: string;
        group: string;
    };
    dates: {
        today: string;
        week: string;
        month: string;
        quickPeriods: string;
    };
};

export type OrcestrUiLocaleContextValue = {
    locale: OrcestrUiLocale;
    copy: OrcestrUiCopy;
};

export type OrcestrUiLocaleProviderProps = {
    children: ReactNode;
    locale?: OrcestrUiLocale;
    copy?: PartialOrcestrUiCopy;
};

type PartialOrcestrUiCopy = Partial<{
    [K in keyof OrcestrUiCopy]: Partial<OrcestrUiCopy[K]>;
}>;

const ruCopy: OrcestrUiCopy = {
    common: {
        clear: 'Очистить',
        close: 'Закрыть',
        retry: 'Повторить',
        reset: 'Сбросить',
        save: 'Сохранить',
        previous: 'Назад',
        next: 'Далее',
        loading: 'Загрузка',
        noData: 'Нет данных',
        noOptions: 'Нет вариантов',
        selectValue: 'Не выбрано',
        selectEntity: 'Выбрать',
        search: 'Поиск',
        dismissNotification: 'Закрыть уведомление',
        openNavigation: 'Открыть навигацию',
        closeNavigation: 'Закрыть навигацию',
        primaryNavigation: 'Основная навигация',
        send: 'Отправить',
        voice: 'Голос',
        cancelRecording: 'Отменить запись',
        openCalendar: 'Открыть календарь',
        resizeColumn: 'Изменить ширину колонки',
        commandPaletteResults: 'Результаты командной палитры',
        clearRange: 'Очистить диапазон',
        clearSelectedValues: 'Очистить выбранные значения',
        details: 'Подробности',
        decrease: 'Уменьшить',
        increase: 'Увеличить',
        compare: 'Сравнить',
        from: 'От',
        to: 'До',
    },
    table: {
        selectAllRows: 'Выбрать все строки',
        selectRow: 'Выбрать строку',
        clearSelection: 'Очистить',
        selected: (count) => `Выбрано: ${count}`,
        shownOfTotal: (shown, total) => `Показано ${shown} из ${total}`,
        unableToLoad: 'Не удалось загрузить данные',
        loadingRows: 'Загрузка строк',
        expandRow: 'Развернуть строку',
        collapseRow: 'Свернуть строку',
        moveColumnLeft: 'Переместить колонку влево',
        moveColumnRight: 'Переместить колонку вправо',
        columnSettings: 'Колонки',
    },
    filters: {
        active: (count) => `Активно: ${count}`,
        advanced: 'Фильтры',
        pageSize: 'На странице',
        saveView: 'Сохранить вид',
        visibleFilters: 'Видимые фильтры',
        savedFilters: 'Сохраненные фильтры',
    },
    command: {
        title: 'Командная палитра',
        description: 'Найдите и выполните доступное действие.',
        placeholder: 'Найти команду',
        empty: 'Команды не найдены',
        recent: 'Недавние',
        group: 'Команды',
    },
    dates: {
        today: 'Сегодня',
        week: 'Последние 7 дней',
        month: 'Текущий месяц',
        quickPeriods: 'Быстрые периоды',
    },
};

const enCopy: OrcestrUiCopy = {
    common: {
        clear: 'Clear',
        close: 'Close',
        retry: 'Retry',
        reset: 'Reset',
        save: 'Save',
        previous: 'Previous',
        next: 'Next',
        loading: 'Loading',
        noData: 'No data',
        noOptions: 'No options',
        selectValue: 'Not selected',
        selectEntity: 'Select entity',
        search: 'Search',
        dismissNotification: 'Dismiss notification',
        openNavigation: 'Open navigation',
        closeNavigation: 'Close navigation',
        primaryNavigation: 'Primary navigation',
        send: 'Send',
        voice: 'Voice',
        cancelRecording: 'Cancel recording',
        openCalendar: 'Open calendar',
        resizeColumn: 'Resize column',
        commandPaletteResults: 'Command palette results',
        clearRange: 'Clear range',
        clearSelectedValues: 'Clear selected values',
        details: 'Details',
        decrease: 'Decrease',
        increase: 'Increase',
        compare: 'Compare',
        from: 'From',
        to: 'To',
    },
    table: {
        selectAllRows: 'Select all rows',
        selectRow: 'Select row',
        clearSelection: 'Clear',
        selected: (count) => `${count} selected`,
        shownOfTotal: (shown, total) => `Shown ${shown} of ${total}`,
        unableToLoad: 'Unable to load data',
        loadingRows: 'Loading rows',
        expandRow: 'Expand row',
        collapseRow: 'Collapse row',
        moveColumnLeft: 'Move column left',
        moveColumnRight: 'Move column right',
        columnSettings: 'Columns',
    },
    filters: {
        active: (count) => `${count} active`,
        advanced: 'Filters',
        pageSize: 'Page size',
        saveView: 'Save view',
        visibleFilters: 'Visible filters',
        savedFilters: 'Saved filters',
    },
    command: {
        title: 'Command palette',
        description: 'Search and run available actions.',
        placeholder: 'Search command',
        empty: 'No commands found',
        recent: 'Recent',
        group: 'Commands',
    },
    dates: {
        today: 'Today',
        week: 'Last 7 days',
        month: 'Current month',
        quickPeriods: 'Quick periods',
    },
};

const defaultCopyByLocale: Record<OrcestrUiLocale, OrcestrUiCopy> = {
    en: enCopy,
    ru: ruCopy,
};

const OrcestrUiLocaleContext = createContext<OrcestrUiLocaleContextValue>({
    locale: 'ru',
    copy: ruCopy,
});

export function OrcestrUiLocaleProvider({
    children,
    locale = 'ru',
    copy,
}: OrcestrUiLocaleProviderProps) {
    const value = useMemo<OrcestrUiLocaleContextValue>(
        () => ({
            locale,
            copy: mergeCopy(defaultCopyByLocale[locale], copy),
        }),
        [copy, locale],
    );

    return (
        <OrcestrUiLocaleContext.Provider value={value}>
            {children}
        </OrcestrUiLocaleContext.Provider>
    );
}

export function useOrcestrUiLocale() {
    return useContext(OrcestrUiLocaleContext);
}

function mergeCopy(base: OrcestrUiCopy, overrides?: PartialOrcestrUiCopy) {
    if (!overrides) return base;
    return {
        common: {...base.common, ...overrides.common},
        table: {...base.table, ...overrides.table},
        filters: {...base.filters, ...overrides.filters},
        command: {...base.command, ...overrides.command},
        dates: {...base.dates, ...overrides.dates},
    };
}
