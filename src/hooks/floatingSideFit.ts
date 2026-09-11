import type { FloatingSide } from './useFloatingPosition.js';

type Bounds = Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left'>;

/** Prefer the requested side, otherwise flip or constrain to the roomier side. */
export function floatingSideFit(
    side: FloatingSide,
    trigger: Bounds,
    boundary: Bounds,
    size: { width: number; height: number },
    padding: number,
    offset: number,
) {
    const opposite: Record<FloatingSide, FloatingSide> = {
        top: 'bottom', bottom: 'top', left: 'right', right: 'left',
    };
    const space = {
        top: Math.max(0, trigger.top - boundary.top - padding - offset),
        bottom: Math.max(0, boundary.bottom - trigger.bottom - padding - offset),
        left: Math.max(0, trigger.left - boundary.left - padding - offset),
        right: Math.max(0, boundary.right - trigger.right - padding - offset),
    };
    const length = side === 'top' || side === 'bottom' ? size.height : size.width;
    const flipped = opposite[side];
    const actualSide = length <= space[side] || space[side] >= space[flipped] ? side : flipped;
    return { side: actualSide, availableSize: space[actualSide] };
}
