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
    zIndex: OverlayZIndex;
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

const OverlayContext = createContext<OverlayContextValue>({
    portalContainer: null,
    zIndex: defaultZIndex,
});

const layerIds: symbol[] = [];
const listeners = new Set<() => void>();

function emitLayerChange() {
    for (const listener of listeners) listener();
}

export function OverlayProvider({
    children,
    container,
    zIndex,
    testId,
}: OverlayProviderProps) {
    const fallbackRef = useRef<HTMLDivElement | null>(null);
    const [fallbackContainer, setFallbackContainer] = useState<HTMLElement | null>(
        null,
    );
    const resolvedZIndex = useMemo(
        () => ({...defaultZIndex, ...zIndex}),
        [zIndex],
    );
    const value = useMemo(
        () => ({
            portalContainer: container ?? fallbackContainer,
            zIndex: resolvedZIndex,
        }),
        [container, fallbackContainer, resolvedZIndex],
    );

    useEffect(() => {
        setFallbackContainer(fallbackRef.current);
    }, []);

    return (
        <OverlayContext.Provider value={value}>
            {children}
            {container === undefined ? (
                <div
                    ref={fallbackRef}
                    className='oui-overlay-root'
                    data-testid={testId}
                />
            ) : null}
        </OverlayContext.Provider>
    );
}

export function useOverlayContext() {
    return useContext(OverlayContext);
}

export function useOverlayLayerIndex(active: boolean) {
    const [id] = useState(() => Symbol('oui-layer'));
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!active) return;
        layerIds.push(id);
        emitLayerChange();
        const update = () => {
            setIndex(Math.max(0, layerIds.indexOf(id)));
        };
        listeners.add(update);
        update();
        return () => {
            const currentIndex = layerIds.indexOf(id);
            if (currentIndex !== -1) layerIds.splice(currentIndex, 1);
            listeners.delete(update);
            emitLayerChange();
        };
    }, [active, id]);

    return index;
}

let scrollLockCount = 0;
let previousBodyOverflow = '';

export function lockOverlayScroll() {
    if (scrollLockCount === 0) {
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }
    scrollLockCount += 1;
    return () => {
        scrollLockCount = Math.max(0, scrollLockCount - 1);
        if (scrollLockCount === 0) {
            document.body.style.overflow = previousBodyOverflow;
        }
    };
}
