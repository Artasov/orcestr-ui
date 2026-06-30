import type {ComponentPropsWithoutRef, ElementType, ReactNode} from 'react';

export type PolymorphicProps<T extends ElementType, P = object> = P &
    Omit<ComponentPropsWithoutRef<T>, keyof P | 'as'> & {
        as?: T;
        children?: ReactNode;
    };
