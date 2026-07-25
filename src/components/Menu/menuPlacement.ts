export type MenuSubmenuSide = 'left' | 'right';

export type MenuSubmenuPlacement = {
    side: MenuSubmenuSide;
    shiftX: number;
    shiftY: number;
};

export function resolveMenuSubmenuPlacement({
    rowLeft,
    rowRight,
    submenuWidth,
    submenuTop,
    submenuBottom,
    viewportWidth,
    viewportHeight,
    collisionPadding = 12,
    sideGap = 4,
}: {
    rowLeft: number;
    rowRight: number;
    submenuWidth: number;
    submenuTop: number;
    submenuBottom: number;
    viewportWidth: number;
    viewportHeight: number;
    collisionPadding?: number;
    sideGap?: number;
}): MenuSubmenuPlacement {
    const rightSpace = viewportWidth - collisionPadding - rowRight - sideGap;
    const leftSpace = rowLeft - collisionPadding - sideGap;
    const side = rightSpace >= submenuWidth || rightSpace >= leftSpace ? 'right' : 'left';
    const naturalLeft = side === 'right' ? rowRight + sideGap : rowLeft - sideGap - submenuWidth;
    const minLeft = collisionPadding;
    const maxLeft = Math.max(minLeft, viewportWidth - collisionPadding - submenuWidth);
    const clampedLeft = Math.min(Math.max(naturalLeft, minLeft), maxLeft);
    const shiftX = clampedLeft - naturalLeft;

    let shiftY = 0;
    if (submenuBottom > viewportHeight - collisionPadding) {
        shiftY = viewportHeight - collisionPadding - submenuBottom;
    }
    if (submenuTop + shiftY < collisionPadding) {
        shiftY += collisionPadding - (submenuTop + shiftY);
    }

    return { side, shiftX, shiftY };
}
