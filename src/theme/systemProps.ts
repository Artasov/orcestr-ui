import type { CSSProperties } from 'react';

export type SemanticTone =
    'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type ColorTone = 'gray' | 'blue' | 'cyan' | 'green' | 'yellow' | 'orange' | 'red' | 'purple';
export type Tone = SemanticTone | ColorTone;
export type ToneInput = Tone | 'muted';
export type UiSize = 1 | 2 | 3 | 4 | '1' | '2' | '3' | '4';
export type RadiusScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type AlignShort =
    's' | 'c' | 'e' | 'st' | 'b' | 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type JustifyShort =
    | 's'
    | 'c'
    | 'e'
    | 'sb'
    | 'sa'
    | 'se'
    | 'start'
    | 'center'
    | 'end'
    | 'between'
    | 'around'
    | 'evenly';
export type ResponsiveValue<T> =
    | T
    | {
          initial?: T;
          sm?: T;
          md?: T;
          lg?: T;
          xl?: T;
      };

export type SystemProps = {
    m?: ResponsiveValue<number | string>;
    mt?: ResponsiveValue<number | string>;
    mr?: ResponsiveValue<number | string>;
    mb?: ResponsiveValue<number | string>;
    ml?: ResponsiveValue<number | string>;
    mx?: ResponsiveValue<number | string>;
    my?: ResponsiveValue<number | string>;
    p?: ResponsiveValue<number | string>;
    pt?: ResponsiveValue<number | string>;
    pr?: ResponsiveValue<number | string>;
    pb?: ResponsiveValue<number | string>;
    pl?: ResponsiveValue<number | string>;
    px?: ResponsiveValue<number | string>;
    py?: ResponsiveValue<number | string>;
    g?: ResponsiveValue<number | string>;
    w?: ResponsiveValue<number | string>;
    minW?: ResponsiveValue<number | string>;
    minWidth?: ResponsiveValue<number | string>;
    maxW?: ResponsiveValue<number | string>;
    maxWidth?: ResponsiveValue<number | string>;
    size?: ResponsiveValue<number | string>;
    h?: ResponsiveValue<number | string>;
    minH?: ResponsiveValue<number | string>;
    minHeight?: ResponsiveValue<number | string>;
    maxH?: ResponsiveValue<number | string>;
    maxHeight?: ResponsiveValue<number | string>;
    display?: CSSProperties['display'];
    position?: CSSProperties['position'];
    overflow?: CSSProperties['overflow'];
    flex?: CSSProperties['flex'];
    flexGrow?: CSSProperties['flexGrow'];
    flexShrink?: CSSProperties['flexShrink'];
    flexBasis?: CSSProperties['flexBasis'];
    alignSelf?: CSSProperties['alignSelf'];
    a?: AlignShort;
    j?: JustifyShort;
    row?: boolean;
    col?: boolean;
    direction?: CSSProperties['flexDirection'];
    wrap?: boolean;
    nowrap?: boolean;
    inline?: boolean;
    fs?: ResponsiveValue<number | string>;
    fw?: CSSProperties['fontWeight'];
    lh?: ResponsiveValue<number | string>;
    ta?: CSSProperties['textAlign'];
    color?: CSSProperties['color'];
    r?: RadiusScale | `${RadiusScale}` | string;
    truncate?: boolean;
};

const systemKeys = new Set<keyof SystemProps>([
    'm',
    'mt',
    'mr',
    'mb',
    'ml',
    'mx',
    'my',
    'p',
    'pt',
    'pr',
    'pb',
    'pl',
    'px',
    'py',
    'g',
    'w',
    'minW',
    'minWidth',
    'maxW',
    'maxWidth',
    'size',
    'h',
    'minH',
    'minHeight',
    'maxH',
    'maxHeight',
    'display',
    'position',
    'overflow',
    'flex',
    'flexGrow',
    'flexShrink',
    'flexBasis',
    'alignSelf',
    'a',
    'j',
    'row',
    'col',
    'direction',
    'wrap',
    'nowrap',
    'inline',
    'fs',
    'fw',
    'lh',
    'ta',
    'color',
    'r',
    'truncate',
]);

const spacing = ['0', '4px', '8px', '12px', '16px', '24px', '32px', '40px', '48px', '64px'];
const radiusScale = ['0', '2px', '4px', '6px', '8px', '10px', '12px', '999px'];

function sizeValue(
    value: ResponsiveValue<number | string> | undefined,
): string | number | undefined {
    if (value === undefined) return undefined;
    if (typeof value === 'object') {
        return sizeValue(value.initial ?? value.md ?? value.lg ?? value.sm ?? value.xl);
    }
    if (typeof value === 'number') return spacing[value] ?? `${value}px`;
    const normalized = value.trim();
    if (/^[0-9]$/.test(normalized)) return spacing[Number(normalized)];
    return value;
}

function radiusValue(
    value: RadiusScale | `${RadiusScale}` | string | undefined,
): string | number | undefined {
    if (value === undefined) return undefined;
    if (typeof value === 'number') return radiusScale[value] ?? `${value}px`;
    const normalized = value.trim();
    if (/^[0-7]$/.test(normalized)) return radiusScale[Number(normalized)];
    return value;
}

function alignValue(value: AlignShort): CSSProperties['alignItems'] {
    switch (value) {
        case 'start':
        case 's':
            return 'flex-start';
        case 'center':
        case 'c':
            return 'center';
        case 'end':
        case 'e':
            return 'flex-end';
        case 'stretch':
        case 'st':
            return 'stretch';
        case 'baseline':
        case 'b':
            return 'baseline';
    }
}

function justifyValue(value: JustifyShort): CSSProperties['justifyContent'] {
    switch (value) {
        case 'start':
        case 's':
            return 'flex-start';
        case 'center':
        case 'c':
            return 'center';
        case 'end':
        case 'e':
            return 'flex-end';
        case 'between':
        case 'sb':
            return 'space-between';
        case 'around':
        case 'sa':
            return 'space-around';
        case 'evenly':
        case 'se':
            return 'space-evenly';
    }
}

export function splitSystemProps<P extends Record<string, unknown>>(
    props: P,
): {
    systemStyle: CSSProperties;
    restProps: Omit<P, keyof SystemProps>;
} {
    const systemStyle: CSSProperties = {};
    const restProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
        if (!systemKeys.has(key as keyof SystemProps)) {
            restProps[key] = value;
            continue;
        }
        if (value === undefined || value === null) continue;
        switch (key as keyof SystemProps) {
            case 'm':
                systemStyle.margin = sizeValue(value as number | string);
                break;
            case 'mt':
                systemStyle.marginTop = sizeValue(value as number | string);
                break;
            case 'mr':
                systemStyle.marginRight = sizeValue(value as number | string);
                break;
            case 'mb':
                systemStyle.marginBottom = sizeValue(value as number | string);
                break;
            case 'ml':
                systemStyle.marginLeft = sizeValue(value as number | string);
                break;
            case 'mx':
                systemStyle.marginInline = sizeValue(value as number | string);
                break;
            case 'my':
                systemStyle.marginBlock = sizeValue(value as number | string);
                break;
            case 'p':
                systemStyle.padding = sizeValue(value as number | string);
                break;
            case 'pt':
                systemStyle.paddingTop = sizeValue(value as number | string);
                break;
            case 'pr':
                systemStyle.paddingRight = sizeValue(value as number | string);
                break;
            case 'pb':
                systemStyle.paddingBottom = sizeValue(value as number | string);
                break;
            case 'pl':
                systemStyle.paddingLeft = sizeValue(value as number | string);
                break;
            case 'px':
                systemStyle.paddingInline = sizeValue(value as number | string);
                break;
            case 'py':
                systemStyle.paddingBlock = sizeValue(value as number | string);
                break;
            case 'g':
                systemStyle.gap = sizeValue(value as number | string);
                break;
            case 'w':
                systemStyle.width = sizeValue(value as number | string);
                break;
            case 'minW':
            case 'minWidth':
                systemStyle.minWidth = sizeValue(value as number | string);
                break;
            case 'maxW':
            case 'maxWidth':
                systemStyle.maxWidth = sizeValue(value as number | string);
                break;
            case 'size': {
                const resolvedSize = sizeValue(value as number | string);
                systemStyle.width = resolvedSize;
                systemStyle.height = resolvedSize;
                break;
            }
            case 'h':
                systemStyle.height = sizeValue(value as number | string);
                break;
            case 'minH':
            case 'minHeight':
                systemStyle.minHeight = sizeValue(value as number | string);
                break;
            case 'maxH':
            case 'maxHeight':
                systemStyle.maxHeight = sizeValue(value as number | string);
                break;
            case 'display':
                systemStyle.display = value as CSSProperties['display'];
                break;
            case 'position':
                systemStyle.position = value as CSSProperties['position'];
                break;
            case 'overflow':
                systemStyle.overflow = value as CSSProperties['overflow'];
                break;
            case 'flex':
                systemStyle.flex = value as CSSProperties['flex'];
                break;
            case 'flexGrow':
                systemStyle.flexGrow = value as CSSProperties['flexGrow'];
                break;
            case 'flexShrink':
                systemStyle.flexShrink = value as CSSProperties['flexShrink'];
                break;
            case 'flexBasis':
                systemStyle.flexBasis = value as CSSProperties['flexBasis'];
                break;
            case 'alignSelf':
                systemStyle.alignSelf = value as CSSProperties['alignSelf'];
                break;
            case 'a':
                systemStyle.alignItems = alignValue(value as AlignShort);
                break;
            case 'j':
                systemStyle.justifyContent = justifyValue(value as JustifyShort);
                break;
            case 'row':
                if (value) systemStyle.flexDirection = 'row';
                break;
            case 'col':
                if (value) systemStyle.flexDirection = 'column';
                break;
            case 'direction':
                systemStyle.flexDirection = value as CSSProperties['flexDirection'];
                break;
            case 'wrap':
                if (value) systemStyle.flexWrap = 'wrap';
                break;
            case 'nowrap':
                if (value) systemStyle.flexWrap = 'nowrap';
                break;
            case 'inline':
                if (value) systemStyle.display = 'inline-flex';
                break;
            case 'fs':
                systemStyle.fontSize = sizeValue(value as number | string);
                break;
            case 'fw':
                systemStyle.fontWeight = value as CSSProperties['fontWeight'];
                break;
            case 'lh':
                systemStyle.lineHeight = value as CSSProperties['lineHeight'];
                break;
            case 'ta':
                systemStyle.textAlign = value as CSSProperties['textAlign'];
                break;
            case 'color':
                systemStyle.color = value as CSSProperties['color'];
                break;
            case 'r':
                systemStyle.borderRadius = radiusValue(
                    value as RadiusScale | `${RadiusScale}` | string,
                );
                break;
            case 'truncate':
                if (value) {
                    systemStyle.overflow = 'hidden';
                    systemStyle.textOverflow = 'ellipsis';
                    systemStyle.whiteSpace = 'nowrap';
                }
                break;
            default:
                break;
        }
    }

    return { systemStyle, restProps: restProps as Omit<P, keyof SystemProps> };
}

export function normalizeTone(value: ToneInput | undefined, fallback: Tone = 'neutral'): Tone {
    switch (value) {
        case undefined:
        case 'muted':
            return fallback;
        default:
            return isTone(value) ? value : fallback;
    }
}

function isTone(value: string): value is Tone {
    return (
        value === 'neutral' ||
        value === 'primary' ||
        value === 'secondary' ||
        value === 'success' ||
        value === 'warning' ||
        value === 'danger' ||
        value === 'info' ||
        value === 'gray' ||
        value === 'blue' ||
        value === 'cyan' ||
        value === 'green' ||
        value === 'yellow' ||
        value === 'orange' ||
        value === 'red' ||
        value === 'purple'
    );
}
