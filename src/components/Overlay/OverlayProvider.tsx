'use client';

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';

export type OverlayLayerKind = 'dropdown' | 'overlay' | 'modal' | 'toast';

export type OverlayZIndex = Record<OverlayLayerKind, number>;

type OverlayContextValue = {
    portalContainer: HTMLElement | null;
    portalReady: boolean;
    portalToBody: boolean;
    zIndex: OverlayZIndex;
    manager: OverlayManager;
    lockScroll: (ownerDocument?: Document) => () => void;
};

export type OverlayProviderProps = {
    children: ReactNode;
    container?: HTMLElement | null;
    zIndex?: Partial<OverlayZIndex>;
    testId?: string;
};

const defaultZIndex: OverlayZIndex = {
    dropdown: 980,
    overlay: 1000,
    modal: 1000,
    toast: 2147483000,
};

const OVERLAY_LAYER_STEP = 20;
const DROPDOWN_LAYER_OFFSET = 10;

type ScrollLockState = {
    count: number;
    scrollX: number;
    scrollY: number;
    styles: Pick<
        CSSStyleDeclaration,
        'overflow' | 'paddingRight' | 'position' | 'top' | 'left' | 'right' | 'width'
    >;
    ios: boolean;
};

type InertState = {
    count: number;
    inert: boolean;
    ariaHidden: string | null;
};

export type OverlayManager = {
    layers: symbol[];
    layerListeners: Set<() => void>;
    focusLayers: symbol[];
    scrollLocks: Map<Document, ScrollLockState>;
    inertElements: Map<HTMLElement, InertState>;
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

function createOverlayManager(): OverlayManager {
    return {
        layers: [],
        layerListeners: new Set(),
        focusLayers: [],
        scrollLocks: new Map(),
        inertElements: new Map(),
    };
}

function emitLayerChange(manager: OverlayManager) {
    for (const listener of manager.layerListeners) listener();
}

export function OverlayProvider({ children, container, zIndex, testId }: OverlayProviderProps) {
    const fallbackRef = useRef<HTMLDivElement | null>(null);
    const [fallbackContainer, setFallbackContainer] = useState<HTMLElement | null>(null);
    const [manager] = useState(createOverlayManager);
    const resolvedZIndex = useMemo(() => ({ ...defaultZIndex, ...zIndex }), [zIndex]);
    const value = useMemo(
        () => ({
            portalContainer: container === undefined ? fallbackContainer : container,
            portalReady: container !== undefined || fallbackContainer !== null,
            portalToBody: container === null,
            zIndex: resolvedZIndex,
            manager,
            lockScroll: (ownerDocument?: Document) =>
                lockOverlayScroll(manager, ownerDocument ?? document),
        }),
        [container, fallbackContainer, manager, resolvedZIndex],
    );

    useEffect(() => {
        setFallbackContainer(fallbackRef.current);
    }, []);

    return (
        <OverlayContext.Provider value={value}>
            {children}
            {container === undefined ? (
                <div ref={fallbackRef} className="oui-overlay-root" data-testid={testId} />
            ) : null}
        </OverlayContext.Provider>
    );
}

export function useOverlayContext() {
    const context = useContext(OverlayContext);
    if (!context) {
        throw new Error('Orcestr UI overlay components must be rendered inside OverlayProvider.');
    }
    return context;
}

export function useOverlayManager() {
    return useOverlayContext().manager;
}

export function useOverlayLayerIndex(active: boolean) {
    const { manager } = useOverlayContext();
    const [id] = useState(() => Symbol('oui-layer'));
    const [index, setIndex] = useState(0);
    const currentIndex = manager.layers.indexOf(id);
    const optimisticIndex = active
        ? currentIndex === -1
            ? manager.layers.length
            : currentIndex
        : index;

    useEffect(() => {
        if (!active) return;
        manager.layers.push(id);
        emitLayerChange(manager);
        const update = () => {
            setIndex(Math.max(0, manager.layers.indexOf(id)));
        };
        manager.layerListeners.add(update);
        update();
        return () => {
            const currentIndex = manager.layers.indexOf(id);
            if (currentIndex !== -1) manager.layers.splice(currentIndex, 1);
            manager.layerListeners.delete(update);
            emitLayerChange(manager);
        };
    }, [active, id, manager]);

    return optimisticIndex;
}

export function overlayLayerZIndex(
    zIndex: OverlayZIndex,
    kind: OverlayLayerKind,
    layerIndex: number,
) {
    if (kind === 'toast') return zIndex.toast;
    if (kind === 'dropdown') {
        const base = Math.max(zIndex.dropdown, zIndex.modal, zIndex.overlay);
        return base + layerIndex * OVERLAY_LAYER_STEP + DROPDOWN_LAYER_OFFSET;
    }
    return zIndex[kind] + layerIndex * OVERLAY_LAYER_STEP;
}

function lockOverlayScroll(manager: OverlayManager, ownerDocument: Document) {
    const existing = manager.scrollLocks.get(ownerDocument);
    if (existing) {
        existing.count += 1;
        return () => unlockOverlayScroll(manager, ownerDocument);
    }

    const body = ownerDocument.body;
    const view = ownerDocument.defaultView;
    const styles = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
    };
    const scrollX = view?.scrollX ?? 0;
    const scrollY = view?.scrollY ?? 0;
    const ios = isIOS(ownerDocument);
    const scrollbarWidth = Math.max(
        0,
        ownerDocument.documentElement.clientWidth > 0
            ? (view?.innerWidth ?? ownerDocument.documentElement.clientWidth) -
                  ownerDocument.documentElement.clientWidth
            : 0,
    );

    if (ios) {
        body.style.position = 'fixed';
        body.style.top = `${-scrollY}px`;
        body.style.left = `${-scrollX}px`;
        body.style.right = '0';
        body.style.width = '100%';
    } else {
        body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) {
            const currentPadding = Number.parseFloat(
                view?.getComputedStyle(body).paddingRight ?? '0',
            );
            body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
        }
    }

    manager.scrollLocks.set(ownerDocument, {
        count: 1,
        scrollX,
        scrollY,
        styles,
        ios,
    });

    return () => {
        unlockOverlayScroll(manager, ownerDocument);
    };
}

function unlockOverlayScroll(manager: OverlayManager, ownerDocument: Document) {
    const state = manager.scrollLocks.get(ownerDocument);
    if (!state) return;
    state.count -= 1;
    if (state.count > 0) return;

    const body = ownerDocument.body;
    Object.assign(body.style, state.styles);
    manager.scrollLocks.delete(ownerDocument);
    if (state.ios) ownerDocument.defaultView?.scrollTo(state.scrollX, state.scrollY);
}

function isIOS(ownerDocument: Document) {
    const navigator = ownerDocument.defaultView?.navigator;
    if (!navigator) return false;
    return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
}

export function registerOverlayFocusLayer(manager: OverlayManager, id: symbol) {
    manager.focusLayers.push(id);
    return () => {
        const index = manager.focusLayers.lastIndexOf(id);
        if (index !== -1) manager.focusLayers.splice(index, 1);
    };
}

export function isTopOverlayFocusLayer(manager: OverlayManager, id: symbol) {
    return manager.focusLayers.at(-1) === id;
}

export function makeOverlayBackgroundInert(manager: OverlayManager, root: HTMLElement) {
    const elements = backgroundElements(root);
    for (const element of elements) addInert(manager, element);
    return () => {
        for (const element of elements) removeInert(manager, element);
    };
}

function backgroundElements(root: HTMLElement) {
    const elements = new Set<HTMLElement>();
    const portalRoot = root.closest<HTMLElement>('.oui-overlay-root');
    const rootLayer = root.closest<HTMLElement>('[data-oui-layer-index]');

    if (portalRoot && rootLayer) {
        const rootIndex = Number(rootLayer.dataset.ouiLayerIndex ?? -1);
        for (const child of portalRoot.children) {
            if (!(child instanceof HTMLElement) || child === rootLayer) continue;
            const childIndex = Number(child.dataset.ouiLayerIndex ?? Number.POSITIVE_INFINITY);
            if (childIndex < rootIndex) elements.add(child);
        }
    }

    let branch: HTMLElement | null = portalRoot ?? rootLayer ?? root;
    while (branch.parentElement) {
        for (const sibling of branch.parentElement.children) {
            if (sibling instanceof HTMLElement && sibling !== branch) elements.add(sibling);
        }
        if (branch.parentElement === root.ownerDocument.body) break;
        branch = branch.parentElement;
    }
    return elements;
}

function addInert(manager: OverlayManager, element: HTMLElement) {
    const existing = manager.inertElements.get(element);
    if (existing) {
        existing.count += 1;
        return;
    }
    manager.inertElements.set(element, {
        count: 1,
        inert: element.inert,
        ariaHidden: element.getAttribute('aria-hidden'),
    });
    element.inert = true;
    element.setAttribute('aria-hidden', 'true');
}

function removeInert(manager: OverlayManager, element: HTMLElement) {
    const state = manager.inertElements.get(element);
    if (!state) return;
    state.count -= 1;
    if (state.count > 0) return;
    element.inert = state.inert;
    if (state.ariaHidden === null) element.removeAttribute('aria-hidden');
    else element.setAttribute('aria-hidden', state.ariaHidden);
    manager.inertElements.delete(element);
}
