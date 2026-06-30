import {forwardRef, type CSSProperties} from 'react';

import {cn} from '../../utils/cn';
import {Flex, type FlexProps} from '../Flex/Flex';

export type SectionProps = FlexProps & {
    sectionColor?: string;
    sectionOpacity?: number | string;
    testId?: string;
};

type SectionStyle = CSSProperties & {
    '--oui-section-bg'?: string;
    '--oui-section-opacity'?: string;
};

function opacityValue(value: number | string): string {
    if (typeof value === 'string') return value;
    if (value <= 1) return `${value * 100}%`;
    return `${value}%`;
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(function Section(
    {
        className,
        style,
        sectionColor,
        sectionOpacity,
        ...props
    },
    ref,
) {
    const sectionStyle: SectionStyle = {...style};
    if (sectionColor !== undefined) sectionStyle['--oui-section-bg'] = sectionColor;
    if (sectionOpacity !== undefined) {
        sectionStyle['--oui-section-opacity'] = opacityValue(sectionOpacity);
    }

    return (
        <Flex
            ref={ref}
            col
            className={cn('oui-section', className)}
            style={sectionStyle}
            {...props}
        />
    );
});
