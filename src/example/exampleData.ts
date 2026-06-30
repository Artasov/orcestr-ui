import {type CommandPaletteItem, type ListboxItem, type OrcestrUiLocale} from '..';

export type ExampleNavItem = {
    id: string;
    label: string;
};

export type ExampleNavGroup = {
    key: string;
    label: string;
    items: readonly ExampleNavItem[];
};

export const navGroups: ExampleNavGroup[] = [
    {
        key: 'base',
        label: 'Base',
        items: [
            {id: 'theme', label: 'Themes'},
            {id: 'foundations', label: 'Foundations'},
            {id: 'typography', label: 'Typography'},
            {id: 'skeleton-example', label: 'Skeleton'},
            {id: 'icon-text-example', label: 'IconText'},
        ],
    },
    {
        key: 'layout',
        label: 'Layout',
        items: [
            {id: 'app-shell-example', label: 'AppShell'},
            {id: 'flex-example', label: 'Flex'},
            {id: 'stack-example', label: 'Stack'},
            {id: 'collapse-example', label: 'Collapse'},
            {id: 'grid-example', label: 'Grid'},
            {id: 'highlight-primitives-example', label: 'Highlights'},
            {id: 'scroll-area-example', label: 'ScrollArea'},
            {id: 'system-radius-example', label: 'Radius'},
        ],
    },
    {
        key: 'actions',
        label: 'Actions',
        items: [
            {id: 'buttons-example', label: 'Buttons'},
            {id: 'icon-buttons-example', label: 'Icon buttons'},
        ],
    },
    {
        key: 'fields',
        label: 'Fields',
        items: [
            {id: 'text-fields-example', label: 'Text fields'},
            {id: 'grouped-fields-example', label: 'Grouped fields'},
            {id: 'number-date-fields-example', label: 'Number and date'},
            {id: 'date-range-example', label: 'Date range'},
        ],
    },
    {
        key: 'selection',
        label: 'Selection',
        items: [
            {id: 'selects-example', label: 'Selects'},
            {id: 'choice-controls-example', label: 'Checkbox, switch, radio'},
            {id: 'tabs-example', label: 'Tabs'},
        ],
    },
    {
        key: 'states',
        label: 'States',
        items: [
            {id: 'state-card-example', label: 'StateCard'},
        ],
    },
    {
        key: 'data',
        label: 'Data',
        items: [
            {id: 'data-table-example', label: 'DataTable'},
        ],
    },
    {
        key: 'overlays',
        label: 'Overlays',
        items: [
            {id: 'overlay-primitives-example', label: 'Overlay primitives'},
            {id: 'toast-example', label: 'Toast'},
            {id: 'overlay-settings-example', label: 'Overlay settings'},
        ],
    },
];

export const navItems: ExampleNavItem[] = navGroups.flatMap((group) => group.items);
export const navItemLabels = navItems.map((item) => [item.id, item.label] as const);

const ruOptionItems: ListboxItem[] = [
    {value: 'new', label: 'Новая заявка'},
    {value: 'work', label: 'В работе'},
    {value: 'ready', label: 'Готово'},
    {value: 'blocked', label: 'Заблокировано'},
];

const enOptionItems: ListboxItem[] = [
    {value: 'new', label: 'New request'},
    {value: 'work', label: 'In progress'},
    {value: 'ready', label: 'Ready'},
    {value: 'blocked', label: 'Blocked'},
];

const ruCommandItems: CommandPaletteItem[] = [
    {
        key: 'create-record',
        label: 'Создать запись',
        description: 'Запустить новый рабочий процесс.',
        shortcut: 'C',
        group: 'Создание',
    },
    {
        key: 'create-entity',
        label: 'Создать объект',
        description: 'Добавить объект без выхода с текущего экрана.',
        shortcut: 'P',
        group: 'Создание',
    },
    {
        key: 'open-entities',
        label: 'Открыть объекты',
        description: 'Перейти к объектам.',
        shortcut: 'G P',
        group: 'Навигация',
    },
    {
        key: 'open-operations',
        label: 'Открыть очередь',
        description: 'Перейти к рабочей очереди.',
        shortcut: 'G D',
        group: 'Навигация',
    },
    {
        key: 'invite-user',
        label: 'Пригласить пользователя',
        description: 'Отправить приглашение участнику команды.',
        shortcut: 'I',
        group: 'Команда',
    },
];

const enCommandItems: CommandPaletteItem[] = [
    {
        key: 'create-record',
        label: 'Create record',
        description: 'Start a new workflow.',
        shortcut: 'C',
        group: 'Create',
    },
    {
        key: 'create-entity',
        label: 'Create entity',
        description: 'Add an entity without leaving the current screen.',
        shortcut: 'P',
        group: 'Create',
    },
    {
        key: 'open-entities',
        label: 'Open entities',
        description: 'Go to entities.',
        shortcut: 'G P',
        group: 'Navigation',
    },
    {
        key: 'open-operations',
        label: 'Open queue',
        description: 'Go to the work queue.',
        shortcut: 'G D',
        group: 'Navigation',
    },
    {
        key: 'invite-user',
        label: 'Invite user',
        description: 'Send an invitation to a team member.',
        shortcut: 'I',
        group: 'Team',
    },
];

const ruOwnerItems = [
    {value: 'anna', label: 'Анна Петрова'},
    {value: 'roman', label: 'Роман Соколов'},
    {value: 'dina', label: 'Дина Волкова'},
    {value: 'ops', label: 'Операционная команда'},
];

const enOwnerItems = [
    {value: 'anna', label: 'Anna Petrova'},
    {value: 'roman', label: 'Roman Sokolov'},
    {value: 'dina', label: 'Dina Volkova'},
    {value: 'ops', label: 'Operations team'},
];

export type EntityOption = {
    id: number;
    article: string;
    name: string;
    status: number;
};

const ruEntityOptions: EntityOption[] = Array.from({length: 86}, (_, index) => ({
    id: index + 1,
    article: `ITEM-${String(index + 1).padStart(4, '0')}`,
    name: `Объект ${index + 1}`,
    status: (index * 7) % 43,
}));

const enEntityOptions: EntityOption[] = Array.from({length: 86}, (_, index) => ({
    id: index + 1,
    article: `ITEM-${String(index + 1).padStart(4, '0')}`,
    name: `Entity ${index + 1}`,
    status: (index * 7) % 43,
}));

export function getOptionItems(locale: OrcestrUiLocale) {
    return locale === 'ru' ? ruOptionItems : enOptionItems;
}

export function getCommandItems(locale: OrcestrUiLocale) {
    return locale === 'ru' ? ruCommandItems : enCommandItems;
}

export function getOwnerItems(locale: OrcestrUiLocale) {
    return locale === 'ru' ? ruOwnerItems : enOwnerItems;
}

function getEntityOptions(locale: OrcestrUiLocale) {
    return locale === 'ru' ? ruEntityOptions : enEntityOptions;
}

export async function loadEntityPage(
    locale: OrcestrUiLocale,
    page: number,
    search: string,
) {
    await new Promise((resolve) => window.setTimeout(resolve, 260));
    const pageSize = 18;
    const normalized = search.toLowerCase();
    const entityOptions = getEntityOptions(locale);
    const filtered = entityOptions.filter((item) =>
        `${item.article} ${item.name}`.toLowerCase().includes(normalized),
    );
    const start = (page - 1) * pageSize;
    return {
        items: filtered.slice(start, start + pageSize),
        page,
        page_size: pageSize,
        total: filtered.length,
        has_next: start + pageSize < filtered.length,
    };
}
