import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { splitSystemProps, type SystemProps, type UiSize } from '../../theme/systemProps';
import { cn } from '../../utils/cn';

type Align = 'left' | 'center' | 'right';

export type TableRootProps = ComponentPropsWithoutRef<'table'> &
    SystemProps & {
        size?: UiSize;
        v?: 'ghost' | 'surface';
        testId?: string;
    };

export const TableRoot = forwardRef<HTMLTableElement, TableRootProps>(function TableRoot(
    { className, style, size = 2, v = 'ghost', testId, ...props },
    ref,
) {
    const { systemStyle, restProps } = splitSystemProps(props);
    return (
        <table
            ref={ref}
            className={cn('oui-table', className)}
            data-size={size}
            data-variant={v}
            data-testid={testId}
            style={{ ...systemStyle, ...style }}
            {...restProps}
        />
    );
});

export const TableHeader = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'thead'>>(
    function TableHeader({ className, ...props }, ref) {
        return <thead ref={ref} className={cn('oui-table-header', className)} {...props} />;
    },
);

export const TableBody = forwardRef<HTMLTableSectionElement, ComponentPropsWithoutRef<'tbody'>>(
    function TableBody({ className, ...props }, ref) {
        return <tbody ref={ref} className={cn('oui-table-body', className)} {...props} />;
    },
);

export const TableRow = forwardRef<HTMLTableRowElement, ComponentPropsWithoutRef<'tr'>>(
    function TableRow({ className, ...props }, ref) {
        return <tr ref={ref} className={cn('oui-table-row', className)} {...props} />;
    },
);

export type TableCellProps = ComponentPropsWithoutRef<'td'> &
    SystemProps & {
        align?: Align;
        testId?: string;
    };

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
    { className, style, align, testId, ...props },
    ref,
) {
    const { systemStyle, restProps } = splitSystemProps(props);
    return (
        <td
            ref={ref}
            className={cn('oui-table-cell', className)}
            data-align={align}
            data-testid={testId}
            style={{ ...systemStyle, ...style }}
            {...restProps}
        />
    );
});

export type TableHeaderCellProps = ComponentPropsWithoutRef<'th'> &
    SystemProps & {
        align?: Align;
        testId?: string;
    };

export const TableColumnHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
    function TableColumnHeaderCell({ className, style, align, testId, ...props }, ref) {
        const { systemStyle, restProps } = splitSystemProps(props);
        return (
            <th
                ref={ref}
                scope="col"
                className={cn('oui-table-column-header-cell', className)}
                data-align={align}
                data-testid={testId}
                style={{ ...systemStyle, ...style }}
                {...restProps}
            />
        );
    },
);

export const TableRowHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
    function TableRowHeaderCell({ className, style, align, testId, ...props }, ref) {
        const { systemStyle, restProps } = splitSystemProps(props);
        return (
            <th
                ref={ref}
                scope="row"
                className={cn('oui-table-row-header-cell', className)}
                data-align={align}
                data-testid={testId}
                style={{ ...systemStyle, ...style }}
                {...restProps}
            />
        );
    },
);

export const Table = Object.assign(TableRoot, {
    Root: TableRoot,
    Header: TableHeader,
    Body: TableBody,
    Row: TableRow,
    Cell: TableCell,
    ColumnHeaderCell: TableColumnHeaderCell,
    RowHeaderCell: TableRowHeaderCell,
});
