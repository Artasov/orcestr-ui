import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from 'react';

import { cn } from '../../utils/cn.js';
import { splitSystemProps, type SystemProps } from '../../theme/systemProps.js';

export type GridProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        columns?: GridColumns;
        testId?: string;
    };

export type GridColumns =
    | number
    | string
    | {
          initial?: number | string;
          sm?: number | string;
          md?: number | string;
          lg?: number | string;
          xl?: number | string;
      };

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
    { className, style, columns, testId, ...props },
    ref,
) {
    const { systemStyle, restProps } = splitSystemProps(props);
    const columnStyle = gridColumnStyle(columns);
    return (
        <div
            ref={ref}
            className={cn('oui-grid', className)}
            data-testid={testId}
            style={{
                ...columnStyle,
                ...systemStyle,
                ...style,
            }}
            {...restProps}
        />
    );
});

function gridColumnStyle(columns: GridColumns | undefined): CSSProperties {
    if (columns === undefined) return {};
    if (typeof columns === 'number' || typeof columns === 'string') {
        return { '--oui-grid-columns': columnValue(columns) } as CSSProperties;
    }
    return {
        '--oui-grid-columns': columnValue(columns.initial ?? 1),
        '--oui-grid-columns-sm': columns.sm ? columnValue(columns.sm) : undefined,
        '--oui-grid-columns-md': columns.md ? columnValue(columns.md) : undefined,
        '--oui-grid-columns-lg': columns.lg ? columnValue(columns.lg) : undefined,
        '--oui-grid-columns-xl': columns.xl ? columnValue(columns.xl) : undefined,
    } as CSSProperties;
}

function columnValue(value: number | string) {
    const normalized = String(value).trim();
    if (/^\d+$/.test(normalized)) return `repeat(${normalized}, minmax(0, 1fr))`;
    return normalized;
}
