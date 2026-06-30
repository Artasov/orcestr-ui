import type {Ref} from 'react';

export function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
    return (node: T | null) => {
        for (const ref of refs) {
            if (!ref) continue;
            if (typeof ref === 'function') {
                ref(node);
            } else {
                ref.current = node;
            }
        }
    };
}
