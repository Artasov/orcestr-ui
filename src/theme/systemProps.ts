import type {CSSProperties} from 'react';

export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type UiSize = 1 | 2 | 3 | 4;
export type RadiusScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type AlignShort = 's' | 'c' | 'e' | 'st' | 'b';
export type JustifyShort = 's' | 'c' | 'e' | 'sb' | 'sa' | 'se';

export type SystemProps = {
    m?: number | string;
    mt?: number | string;
    mr?: number | string;
    mb?: number | string;
    ml?: number | string;
    mx?: number | string;
    my?: number | string;
    p?: number | string;
    pt?: number | string;
    pr?: number | string;
    pb?: number | string;
    pl?: number | string;
    px?: number | string;
    py?: number | string;
    g?: number | string;
    w?: number | string;
    minW?: number | string;
    maxW?: number | string;
    size?: number | string;
    h?: number | string;
    minH?: number | string;
    maxH?: number | string;
    display?: CSSProperties['display'];
    position?: CSSProperties['position'];
    overflow?: CSSProperties['overflow'];
    flex?: CSSProperties['flex'];
    a?: AlignShort;
    j?: JustifyShort;
    row?: boolean;
    col?: boolean;
    wrap?: boolean;
    nowrap?: boolean;
    inline?: boolean;
    fs?: number | string;
    fw?: CSSProperties['fontWeight'];
    lh?: number | string;
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
    'maxW',
    'size',
    'h',
    'minH',
    'maxH',
    'display',
    'position',
    'overflow',
    'flex',
    'a',
    'j',
    'row',
    'col',
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

const spacing = ['0', '4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px'];
const radiusScale = ['0', '2px', '4px', '6px', '8px', '10px', '12px', '999px'];

function sizeValue(value: number | string | undefined): string | number | undefined {
    if (value === undefined) return undefined;
    if (typeof value === 'number') return spacing[value] ?? `${value}px`;
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
        case 's':
            return 'flex-start';
        case 'c':
            return 'center';
        case 'e':
            return 'flex-end';
        case 'st':
            return 'stretch';
        case 'b':
            return 'baseline';
    }
}

function justifyValue(value: JustifyShort): CSSProperties['justifyContent'] {
    switch (value) {
        case 's':
            return 'flex-start';
        case 'c':
            return 'center';
        case 'e':
            return 'flex-end';
        case 'sb':
            return 'space-between';
        case 'sa':
            return 'space-around';
        case 'se':
            return 'space-evenly';
    }
}

export function splitSystemProps<P extends Record<string, unknown>>(props: P): {
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
                systemStyle.minWidth = sizeValue(value as number | string);
                break;
            case 'maxW':
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
                systemStyle.minHeight = sizeValue(value as number | string);
                break;
            case 'maxH':
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

    return {systemStyle, restProps: restProps as Omit<P, keyof SystemProps>};
}
