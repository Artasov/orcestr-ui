import type {ReactNode} from 'react';

import type {Tone} from '../../theme/systemProps';

export type OrcestrActionTone = Extract<
    Tone,
    'danger' | 'info' | 'neutral' | 'success' | 'warning'
>;

export type OrcestrActionConfirmation = {
    title?: ReactNode;
    message?: ReactNode;
    confirmLabel?: ReactNode;
    cancelLabel?: ReactNode;
    tone?: OrcestrActionTone;
};

export type OrcestrActionItem<TContext = void> = {
    key: string;
    label: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    info?: ReactNode;
    shortcut?: ReactNode;
    disabled?: boolean;
    loading?: boolean;
    tone?: OrcestrActionTone;
    confirm?: OrcestrActionConfirmation;
    separatorBefore?: boolean;
    children?: ReadonlyArray<OrcestrActionItem<TContext>>;
    onSelect?: TContext extends void ? () => void : (context: TContext) => void;
};

export type OrcestrNormalizedActionItem<TContext = void> = {
    key: string;
    label: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    info?: ReactNode;
    shortcut?: ReactNode;
    disabled: boolean;
    loading: boolean;
    tone?: OrcestrActionTone;
    confirm?: OrcestrActionConfirmation;
    separatorBefore?: boolean;
    searchText: string;
    source: OrcestrActionItem<TContext>;
    children?: ReadonlyArray<OrcestrNormalizedActionItem<TContext>>;
};

export function actionItemText(label: ReactNode): string {
    if (label === null || label === undefined || label === false) return '';
    if (typeof label === 'string') return label;
    if (typeof label === 'number') return String(label);
    if (Array.isArray(label)) return label.map(actionItemText).join('');
    if (typeof label === 'object' && 'props' in label) {
        const props = label.props as {children?: ReactNode};
        return actionItemText(props.children);
    }
    return '';
}

export function isActionItemDisabled<TContext>(item: OrcestrActionItem<TContext>): boolean {
    return Boolean(item.disabled || item.loading);
}

export function actionItemSearchText<TContext>(item: OrcestrActionItem<TContext>): string {
    return [
        actionItemText(item.label),
        actionItemText(item.description),
        actionItemText(item.shortcut),
    ]
        .filter(Boolean)
        .join(' ')
        .trim();
}

export function normalizeActionItem<TContext>(
    item: OrcestrActionItem<TContext>,
): OrcestrNormalizedActionItem<TContext> {
    return {
        key: item.key,
        label: item.label,
        description: item.description,
        icon: item.icon,
        info: item.info,
        shortcut: item.shortcut,
        disabled: isActionItemDisabled(item),
        loading: Boolean(item.loading),
        tone: item.tone,
        confirm: item.confirm,
        separatorBefore: item.separatorBefore,
        searchText: actionItemSearchText(item),
        source: item,
        children: item.children?.map(normalizeActionItem),
    };
}

export function normalizeActionItems<TContext>(
    items: ReadonlyArray<OrcestrActionItem<TContext>>,
): OrcestrNormalizedActionItem<TContext>[] {
    return items.map(normalizeActionItem);
}
