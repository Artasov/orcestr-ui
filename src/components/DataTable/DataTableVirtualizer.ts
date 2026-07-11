export type DataTableVirtualWindow = {
    start: number;
    end: number;
    beforeHeight: number;
    afterHeight: number;
};

export function calculateDataTableVirtualWindow({
    rowCount,
    scrollTop,
    viewportHeight,
    rowHeight,
    overscan,
}: {
    rowCount: number;
    scrollTop: number;
    viewportHeight: number;
    rowHeight: number;
    overscan: number;
}): DataTableVirtualWindow {
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
    const end = Math.min(rowCount, start + visibleCount);
    return {
        start,
        end,
        beforeHeight: start * rowHeight,
        afterHeight: Math.max(0, rowCount - end) * rowHeight,
    };
}
