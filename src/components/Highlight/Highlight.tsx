import {forwardRef, type ComponentPropsWithoutRef, type CSSProperties} from 'react';

import {splitSystemProps, type SystemProps} from '../../theme/systemProps';
import {cn} from '../../utils/cn';

export type HighlightProps = ComponentPropsWithoutRef<'div'> &
    SystemProps & {
        h?: number | string;
        color?: string;
        visible?: boolean;
        testId?: string;
    };

type HighlightStyle = CSSProperties & {
    '--oui-highlight-height'?: string;
    '--oui-highlight-color'?: string;
};

export const TopHighlight = forwardRef<HTMLDivElement, HighlightProps>(
    function TopHighlight({className, style, h = 32, color, visible, ...props}, ref) {
        return (
            <Highlight
                ref={ref}
                className={cn('oui-highlight-top', className)}
                h={h}
                color={color}
                visible={visible}
                style={style}
                {...props}
            />
        );
    },
);

export const BottomHighlight = forwardRef<HTMLDivElement, HighlightProps>(
    function BottomHighlight({className, style, h = 32, color, visible, ...props}, ref) {
        return (
            <Highlight
                ref={ref}
                className={cn('oui-highlight-bottom', className)}
                h={h}
                color={color}
                visible={visible}
                style={style}
                {...props}
            />
        );
    },
);

export const DownHighlight = BottomHighlight;

const Highlight = forwardRef<HTMLDivElement, HighlightProps>(function Highlight(
    {className, style, h = 32, color, visible = true, testId, ...props},
    ref,
) {
    if (!visible) return null;

    const {systemStyle, restProps} = splitSystemProps(props);
    const highlightStyle: HighlightStyle = {
        ...systemStyle,
        ...style,
        '--oui-highlight-height': highlightHeight(h),
        ...(color ? {'--oui-highlight-color': color} : null),
    };

    return (
        <div
            ref={ref}
            aria-hidden='true'
            className={cn('oui-highlight', className)}
            data-testid={testId}
            style={highlightStyle}
            {...restProps}
        />
    );
});

function highlightHeight(value: number | string) {
    return typeof value === 'number' ? `${value}px` : value;
}
