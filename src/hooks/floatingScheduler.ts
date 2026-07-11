type Scheduler = {
    callbacks: Map<symbol, () => void>;
    observedElements: Map<Element, number>;
    resizeObserver: ResizeObserver | null;
    frame: number | null;
    schedule: () => void;
    dispose: () => void;
};

const schedulers = new WeakMap<Document, Scheduler>();

export function subscribeFloatingUpdates(
    ownerDocument: Document,
    elements: ReadonlyArray<Element>,
    callback: () => void,
) {
    const scheduler = getScheduler(ownerDocument);
    const id = Symbol('oui-floating-layer');
    scheduler.callbacks.set(id, callback);
    for (const element of elements) observeElement(scheduler, element);
    scheduler.schedule();

    return () => {
        scheduler.callbacks.delete(id);
        for (const element of elements) unobserveElement(scheduler, element);
        if (scheduler.callbacks.size === 0) {
            scheduler.dispose();
            schedulers.delete(ownerDocument);
        }
    };
}

export function scheduleFloatingUpdates(ownerDocument: Document) {
    schedulers.get(ownerDocument)?.schedule();
}

function getScheduler(ownerDocument: Document) {
    const existing = schedulers.get(ownerDocument);
    if (existing) return existing;

    const view = ownerDocument.defaultView;
    let scheduler: Scheduler;
    const schedule = () => {
        if (!view || scheduler.frame !== null) return;
        scheduler.frame = view.requestAnimationFrame(() => {
            scheduler.frame = null;
            for (const callback of scheduler.callbacks.values()) callback();
        });
    };
    const ResizeObserverCtor = view?.ResizeObserver;
    const resizeObserver = ResizeObserverCtor ? new ResizeObserverCtor(() => schedule()) : null;
    const handleViewportChange = () => schedule();
    view?.addEventListener('resize', handleViewportChange);
    ownerDocument.addEventListener('scroll', handleViewportChange, true);

    scheduler = {
        callbacks: new Map(),
        observedElements: new Map(),
        resizeObserver,
        frame: null,
        schedule,
        dispose: () => {
            if (scheduler.frame !== null) view?.cancelAnimationFrame(scheduler.frame);
            scheduler.resizeObserver?.disconnect();
            view?.removeEventListener('resize', handleViewportChange);
            ownerDocument.removeEventListener('scroll', handleViewportChange, true);
        },
    };
    schedulers.set(ownerDocument, scheduler);
    return scheduler;
}

function observeElement(scheduler: Scheduler, element: Element) {
    const count = scheduler.observedElements.get(element) ?? 0;
    scheduler.observedElements.set(element, count + 1);
    if (count === 0) scheduler.resizeObserver?.observe(element);
}

function unobserveElement(scheduler: Scheduler, element: Element) {
    const count = scheduler.observedElements.get(element);
    if (count === undefined) return;
    if (count > 1) {
        scheduler.observedElements.set(element, count - 1);
        return;
    }
    scheduler.observedElements.delete(element);
    scheduler.resizeObserver?.unobserve(element);
}
