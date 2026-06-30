type AnyProps = Record<string, unknown>;

function isHandler(key: string, value: unknown): value is (...args: unknown[]) => void {
    return /^on[A-Z]/.test(key) && typeof value === 'function';
}

export function mergeProps<T extends AnyProps, U extends AnyProps>(
    first: T,
    second: U,
): T & U {
    const result: AnyProps = {...first, ...second};
    for (const key of Object.keys(first)) {
        const firstValue = first[key];
        const secondValue = second[key];
        if (key === 'className') {
            result[key] = [firstValue, secondValue].filter(Boolean).join(' ');
        } else if (key === 'style') {
            result[key] = {
                ...(firstValue as object | undefined),
                ...(secondValue as object | undefined),
            };
        } else if (isHandler(key, firstValue) && isHandler(key, secondValue)) {
            result[key] = (...args: unknown[]) => {
                firstValue(...args);
                secondValue(...args);
            };
        }
    }
    return result as T & U;
}
