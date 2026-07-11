import { JSDOM } from 'jsdom';

export function setupDom() {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
        url: 'http://localhost/',
        pretendToBeVisual: true,
    });
    const view = dom.window;
    const properties = [
        'document',
        'navigator',
        'HTMLElement',
        'HTMLInputElement',
        'Node',
        'Event',
        'MouseEvent',
        'KeyboardEvent',
        'FocusEvent',
        'MutationObserver',
        'getComputedStyle',
        'requestAnimationFrame',
        'cancelAnimationFrame',
    ] as const;
    const previous = new Map<string, PropertyDescriptor | undefined>();
    previous.set('window', Object.getOwnPropertyDescriptor(globalThis, 'window'));
    Object.defineProperty(globalThis, 'window', { configurable: true, value: view });
    for (const property of properties) {
        previous.set(property, Object.getOwnPropertyDescriptor(globalThis, property));
        const value = (view as unknown as Record<string, unknown>)[property];
        Object.defineProperty(globalThis, property, {
            configurable: true,
            value:
                typeof value === 'function'
                    ? (value as (...args: unknown[]) => unknown).bind(view)
                    : value,
        });
    }

    class TestResizeObserver implements ResizeObserver {
        readonly observed = new Set<Element>();
        constructor(private readonly callback: ResizeObserverCallback) {}
        observe(target: Element) {
            this.observed.add(target);
        }
        unobserve(target: Element) {
            this.observed.delete(target);
        }
        disconnect() {
            this.observed.clear();
        }
        takeRecords(): ResizeObserverEntry[] {
            return [];
        }
    }

    previous.set('ResizeObserver', Object.getOwnPropertyDescriptor(globalThis, 'ResizeObserver'));
    Object.defineProperty(globalThis, 'ResizeObserver', {
        configurable: true,
        value: TestResizeObserver,
    });
    Object.defineProperty(view, 'ResizeObserver', {
        configurable: true,
        value: TestResizeObserver,
    });
    Object.defineProperty(view, 'matchMedia', {
        configurable: true,
        value: (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => undefined,
            removeEventListener: () => undefined,
            addListener: () => undefined,
            removeListener: () => undefined,
            dispatchEvent: () => true,
        }),
    });
    previous.set(
        'IS_REACT_ACT_ENVIRONMENT',
        Object.getOwnPropertyDescriptor(globalThis, 'IS_REACT_ACT_ENVIRONMENT'),
    );
    Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
        configurable: true,
        writable: true,
        value: true,
    });

    return () => {
        dom.window.close();
        for (const [property, descriptor] of previous) {
            if (descriptor) Object.defineProperty(globalThis, property, descriptor);
            else Reflect.deleteProperty(globalThis, property);
        }
    };
}
