'use client';

import {forwardRef, useContext} from 'react';
import {LuMenu} from 'react-icons/lu';
import {useOrcestrUiLocale} from '../../locale/LocaleProvider.js';
import {composeRefs} from '../../utils/composeRefs.js';
import {AppShellSidebarContext} from '../AppShell/sidebar-preview.js';
import {IconButton, type IconButtonProps} from '../IconButton/IconButton.js';

/** Toggles the containing AppShell and previews its collapsed sidebar on mouse hover. */
export const AppShellSidebarToggle = forwardRef<HTMLButtonElement, IconButtonProps>(function AppShellSidebarToggle(
    {children, onClick, onPointerEnter, onPointerLeave, 'aria-label': label, ...props}, ref,
) {
    const context = useContext(AppShellSidebarContext);
    const {copy} = useOrcestrUiLocale();
    if (!context) throw new Error('AppShellSidebarToggle must be rendered inside AppShell.');
    return <IconButton {...props} ref={composeRefs(ref, context.triggerRef)}
        aria-label={label ?? (context.pinned ? copy.common.closeNavigation : copy.common.openNavigation)}
        aria-expanded={context.open} aria-controls={context.id}
        onClick={(event) => {onClick?.(event); if (!event.defaultPrevented) context.toggle();}}
        onPointerEnter={(event) => {onPointerEnter?.(event); if (!event.defaultPrevented) context.enter(event);}}
        onPointerLeave={(event) => {onPointerLeave?.(event); if (!event.defaultPrevented) context.leave();}}>
        {children ?? <LuMenu size={20} />}
    </IconButton>;
});
