'use client';

import {
    forwardRef,
    useCallback,
    useId,
    useLayoutEffect,
    useRef,
    useState,
    type ChangeEvent,
    type CSSProperties,
    type FocusEvent,
    type ReactNode,
    type TextareaHTMLAttributes,
} from 'react';

import { FloatingFieldDecoration } from '../Field/FloatingFieldDecoration.js';
import { cn } from '../../utils/cn.js';
import { composeRefs } from '../../utils/composeRefs.js';
import { splitSystemProps, type SystemProps, type UiSize } from '../../theme/systemProps.js';

type TextAreaInputStyle = CSSProperties & {
    '--oui-text-area-resizer-rest-color'?: string;
    '--oui-text-area-resizer-hover-color'?: string;
    '--oui-text-area-resizer-focus-color'?: string;
};

export type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> &
    SystemProps & {
        size?: UiSize;
        invalid?: boolean;
        fullWidth?: boolean;
        autoResize?: boolean;
        /** Minimum visible line count while auto-resizing. Falls back to `rows`, then one row. */
        minRows?: number;
        /** Maximum visible line count while auto-resizing. */
        maxRows?: number;
        /** Renders an animated label inside the control that moves into the outline. */
        floatingLabel?: ReactNode;
        /** Applies an arbitrary CSS color to the floating label and its outline. */
        floatingColor?: string;
        testId?: string;
    };

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
    {
        className,
        style,
        size = 3,
        invalid = false,
        fullWidth = true,
        autoResize = false,
        minRows,
        maxRows,
        floatingLabel,
        floatingColor,
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
        disabled,
        id,
        rows,
        testId,
        children: _children,
        dangerouslySetInnerHTML: _dangerouslySetInnerHTML,
        ...props
    },
    ref,
) {
    const generatedId = useId();
    const textAreaId = id ?? generatedId;
    const localRef = useRef<HTMLTextAreaElement | null>(null);
    const measurementRef = useRef<HTMLTextAreaElement | null>(null);
    const measuredRef = useRef(false);
    const targetHeightRef = useRef<number | null>(null);
    const { systemStyle, restProps } = splitSystemProps(props);
    const [internalValue, setInternalValue] = useState<
        TextareaHTMLAttributes<HTMLTextAreaElement>['value']
    >(defaultValue ?? '');
    const actualValue = value ?? internalValue;
    const [focused, setFocused] = useState(false);
    const filled = String(actualValue ?? '').length > 0;
    const mergedStyle = { ...systemStyle, ...style };
    const floatingInputStyle: TextAreaInputStyle | undefined =
        floatingLabel !== undefined
            ? {
                  height: mergedStyle.height,
                  minHeight: mergedStyle.minHeight,
                  maxHeight: mergedStyle.maxHeight,
                  ...(floatingColor
                      ? {
                            '--oui-text-area-resizer-rest-color': floatingColor,
                            '--oui-text-area-resizer-hover-color': floatingColor,
                            '--oui-text-area-resizer-focus-color': floatingColor,
                        }
                      : {}),
              }
            : undefined;

    const resizeToContent = useCallback(() => {
        const element = localRef.current;
        if (!autoResize || !element) return;

        const ownerWindow = element.ownerDocument.defaultView;
        if (!ownerWindow) return;
        const computed = ownerWindow.getComputedStyle(element);
        const lineHeight = cssPixels(computed.lineHeight) || cssPixels(computed.fontSize) * 1.35;
        const paddingHeight = cssPixels(computed.paddingTop) + cssPixels(computed.paddingBottom);
        const borderHeight =
            cssPixels(computed.borderTopWidth) + cssPixels(computed.borderBottomWidth);
        const chromeHeight = paddingHeight + borderHeight;
        const minimumRows = positiveInteger(minRows ?? rows, 1);
        const maximumRows = positiveInteger(maxRows, Number.POSITIVE_INFINITY);
        const declaredMinHeight = cssConstraint(computed.minHeight, 0);
        const declaredMaxHeight = cssConstraint(computed.maxHeight, Number.POSITIVE_INFINITY);
        const minimumHeight = Math.max(declaredMinHeight, lineHeight * minimumRows + chromeHeight);
        const maximumHeight = Math.max(
            minimumHeight,
            Math.min(declaredMaxHeight, lineHeight * maximumRows + chromeHeight),
        );
        const currentHeight = element.getBoundingClientRect().height;
        const previousTransition = element.style.transition;
        const contentHeight = measureContentHeight(element, computed, measurementRef) + borderHeight;
        const nextHeight = Math.min(maximumHeight, Math.max(minimumHeight, contentHeight));
        const previousTargetHeight = targetHeightRef.current;
        const targetChanged =
            previousTargetHeight === null || Math.abs(previousTargetHeight - nextHeight) >= 0.5;

        if (!measuredRef.current) {
            element.style.transition = 'none';
            element.style.height = `${nextHeight}px`;
            void element.offsetHeight;
            element.style.transition = previousTransition;
        } else if (targetChanged && Math.abs(currentHeight - nextHeight) >= 0.5) {
            element.style.transition = 'none';
            element.style.height = `${currentHeight}px`;
            void element.offsetHeight;
            element.style.transition = previousTransition;
            element.style.height = `${nextHeight}px`;
        } else if (targetChanged) {
            element.style.height = `${nextHeight}px`;
        }
        element.style.overflowY = contentHeight > maximumHeight + 0.5 ? 'auto' : 'hidden';
        targetHeightRef.current = nextHeight;
        measuredRef.current = true;
    }, [autoResize, maxRows, minRows, rows]);

    useLayoutEffect(() => {
        if (!autoResize) {
            measuredRef.current = false;
            targetHeightRef.current = null;
            if (localRef.current) {
                localRef.current.style.height = '';
                localRef.current.style.overflowY = '';
            }
            return;
        }
        resizeToContent();
    }, [actualValue, autoResize, resizeToContent, size, mergedStyle.maxHeight, mergedStyle.minHeight]);

    useLayoutEffect(() => {
        const element = localRef.current;
        const ownerWindow = element?.ownerDocument.defaultView;
        if (!autoResize || !element || !ownerWindow?.ResizeObserver) return;
        let previousWidth = element.getBoundingClientRect().width;
        const observer = new ownerWindow.ResizeObserver(() => {
            const nextWidth = element.getBoundingClientRect().width;
            if (Math.abs(previousWidth - nextWidth) < 0.5) return;
            previousWidth = nextWidth;
            resizeToContent();
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [autoResize, resizeToContent]);

    useLayoutEffect(
        () => () => {
            measurementRef.current?.remove();
            measurementRef.current = null;
        },
        [],
    );

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (value === undefined) setInternalValue(event.target.value);
        onChange?.(event);
        // The browser has already applied the new value at this point. Measuring here makes a
        // newly inserted line start expanding in the same input event instead of one render later.
        resizeToContent();
    };

    const textArea = (
        <textarea
            ref={composeRefs(ref, localRef)}
            id={textAreaId}
            className={cn(
                'oui-text-area',
                floatingLabel !== undefined &&
                    'oui-text-area-input oui-text-area-floating-input',
                !floatingLabel && fullWidth && 'oui-text-area-full',
                floatingLabel === undefined && className,
            )}
            data-size={size}
            data-invalid={invalid ? 'true' : undefined}
            data-auto-resize={autoResize ? 'true' : undefined}
            data-testid={testId}
            aria-invalid={invalid || undefined}
            value={actualValue}
            rows={rows}
            disabled={disabled}
            onChange={handleChange}
            onFocus={(event: FocusEvent<HTMLTextAreaElement>) => {
                setFocused(true);
                onFocus?.(event);
            }}
            onBlur={(event: FocusEvent<HTMLTextAreaElement>) => {
                setFocused(false);
                onBlur?.(event);
            }}
            style={floatingLabel === undefined ? mergedStyle : floatingInputStyle}
            {...restProps}
        />
    );

    if (floatingLabel === undefined) return textArea;

    return (
        <span
            className={cn(
                'oui-text-area-field',
                'oui-floating-field',
                fullWidth && 'oui-text-area-full',
                className,
            )}
            data-size={size}
            data-invalid={invalid ? 'true' : undefined}
            data-disabled={disabled ? 'true' : undefined}
            data-floating={focused || filled ? 'true' : undefined}
            data-focused={focused ? 'true' : undefined}
            style={mergedStyle}
        >
            <FloatingFieldDecoration
                label={floatingLabel}
                htmlFor={textAreaId}
                color={floatingColor}
            />
            {textArea}
        </span>
    );
});

function cssPixels(value: string): number {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function cssConstraint(value: string, fallback: number): number {
    if (!value || value === 'none') return fallback;
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function positiveInteger(value: number | undefined, fallback: number): number {
    if (value === undefined || !Number.isFinite(value) || value < 1) return fallback;
    return Math.floor(value);
}

function measureContentHeight(
    element: HTMLTextAreaElement,
    computed: CSSStyleDeclaration,
    measurementRef: { current: HTMLTextAreaElement | null },
): number {
    const ownerDocument = element.ownerDocument;
    let measurement = measurementRef.current;
    if (!measurement || measurement.ownerDocument !== ownerDocument) {
        measurement?.remove();
        measurement = ownerDocument.createElement('textarea');
        measurement.setAttribute('aria-hidden', 'true');
        measurement.tabIndex = -1;
        ownerDocument.body.appendChild(measurement);
        measurementRef.current = measurement;
    }

    const width = element.getBoundingClientRect().width;
    measurement.value = element.value;
    measurement.placeholder = '';
    measurement.style.position = 'fixed';
    measurement.style.inset = '0 auto auto 0';
    measurement.style.zIndex = '-1';
    measurement.style.width = `${width}px`;
    measurement.style.height = '0';
    measurement.style.minHeight = '0';
    measurement.style.maxHeight = 'none';
    measurement.style.padding = computed.padding;
    measurement.style.borderWidth = computed.borderWidth;
    measurement.style.borderStyle = computed.borderStyle;
    measurement.style.boxSizing = computed.boxSizing;
    measurement.style.font = computed.font;
    measurement.style.letterSpacing = computed.letterSpacing;
    measurement.style.lineHeight = computed.lineHeight;
    measurement.style.textIndent = computed.textIndent;
    measurement.style.textTransform = computed.textTransform;
    measurement.style.whiteSpace = computed.whiteSpace;
    measurement.style.overflowWrap = computed.overflowWrap;
    measurement.style.wordBreak = computed.wordBreak;
    measurement.style.overflow = 'hidden';
    measurement.style.resize = 'none';
    measurement.style.visibility = 'hidden';
    measurement.style.pointerEvents = 'none';
    measurement.style.transition = 'none';

    return measurement.scrollHeight;
}
