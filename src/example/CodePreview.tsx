'use client';

import {
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
    type WheelEvent as ReactWheelEvent,
} from 'react';
import {LuInfo} from 'react-icons/lu';

import {Flex, IconButton, Modal, ScrollArea} from '..';
import {cn} from '../utils/cn';
import {type CodeExample} from './codeSamples';

function highlightedCode(code: string): ReactNode[] {
    const tokenPattern =
        /(\/\/.*|'.*?'|".*?"|`.*?`|\b(?:import|from|const|let|function|return|true|false|null|undefined|type|satisfies)\b|<\/?[A-Z][A-Za-z0-9.]*)/g;

    return code.split('\n').flatMap((line, lineIndex) => {
        const parts = line.split(tokenPattern).filter(Boolean);
        const rendered = parts.map((part, partIndex) => {
            let className = 'oui-code-token';
            if (/^\/\//.test(part)) className += ' oui-code-comment';
            else if (/^['"`]/.test(part)) className += ' oui-code-string';
            else if (/^(import|from|const|let|function|return|true|false|null|undefined|type|satisfies)$/.test(part)) {
                className += ' oui-code-keyword';
            } else if (/^<\/?[A-Z]/.test(part)) className += ' oui-code-component';

            return (
                <span key={`${lineIndex}-${partIndex}`} className={className}>
                    {part}
                </span>
            );
        });

        return [
            <span key={`line-${lineIndex}`} className='oui-code-line'>
                {rendered.length > 0 ? rendered : ' '}
            </span>,
        ];
    });
}

export function CodeInfoButton({
    title,
    code,
    onOpen,
}: CodeExample & {
    onOpen: (example: CodeExample) => void;
}) {
    return (
        <IconButton
            className='oui-code-info-button'
            size={1}
            v='pad'
            tone='info'
            icon={<LuInfo size={14} />}
            aria-label={`Show ${title} code`}
            onClick={() => onOpen({title, code})}
        />
    );
}

export function ExampleTileHeader({
    title,
    code,
    onOpen,
}: CodeExample & {
    onOpen: (example: CodeExample) => void;
}) {
    return (
        <Flex className='oui-ui-tile-head' a='s' g={1} wrap>
            <CodeInfoButton title={title} code={code} onOpen={onOpen} />
        </Flex>
    );
}

export function ExampleTile({
    id,
    title,
    code,
    onOpen,
    className,
    children,
}: CodeExample & {
    id?: string;
    onOpen: (example: CodeExample) => void;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div id={id} className={cn('oui-section oui-ui-tile', className)}>
            <div className='oui-ui-tile-body'>
                <ExampleTileHeader title={title} code={code} onOpen={onOpen} />
                {children}
            </div>
            <InlineCodeBlock code={code} />
        </div>
    );
}

export function InlineCodeBlock({code}: {code: string}) {
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const collapsedHeight = 180;
    const collapsible = contentHeight > collapsedHeight;
    const panelHeight = collapsible
        ? expanded ? contentHeight + 38 : collapsedHeight
        : contentHeight;
    const measure = useCallback(() => {
        const element = contentRef.current;
        if (!element) return;
        const nextHeight = element.scrollHeight;
        setContentHeight((current) => current === nextHeight ? current : nextHeight);
    }, []);

    useLayoutEffect(() => {
        measure();
    }, [code, measure]);

    useLayoutEffect(() => {
        const element = contentRef.current;
        if (!element || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => measure());
        observer.observe(element);
        return () => observer.disconnect();
    }, [measure]);
    const handleWheelCapture = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
        if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        const scrollRoot = document.querySelector<HTMLElement>(
            '.oui-app-shell-content-scroll .oui-scroll-area-viewport',
        );
        if (!scrollRoot) return;

        event.preventDefault();
        event.stopPropagation();
        scrollRoot.scrollTop += normalizedWheelDeltaY(event);
    }, []);

    return (
        <div
            className='oui-code-inline-panel'
            data-expanded={expanded ? 'true' : 'false'}
            data-collapsible={collapsible ? 'true' : 'false'}
            style={{height: panelHeight || undefined}}
            onWheelCapture={handleWheelCapture}
        >
            <div ref={contentRef} className='oui-code-inline-content'>
                <CodeBlock code={code} />
            </div>
            {collapsible && !expanded ? <div className='oui-code-inline-fade' aria-hidden /> : null}
            {collapsible ? (
                <button
                    type='button'
                    className='oui-code-inline-toggle'
                    aria-expanded={expanded}
                    onClick={() => setExpanded((current) => !current)}
                >
                    {expanded ? 'Hide code' : 'Show code'}
                </button>
            ) : null}
        </div>
    );
}

function normalizedWheelDeltaY(event: ReactWheelEvent) {
    if (event.deltaMode === 1) return event.deltaY * 16;
    if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
    return event.deltaY;
}

export function CodeBlock({code}: {code: string}) {
    return (
        <ScrollArea className='oui-code-preview-scroll'>
            <pre className='oui-code-preview'>
                <code>{highlightedCode(code)}</code>
            </pre>
        </ScrollArea>
    );
}

export function CodePreviewModal({
    example,
    onClose,
}: {
    example: CodeExample | null;
    onClose: () => void;
}) {
    return (
        <Modal
            open={example !== null}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            title={example?.title ?? 'Component code'}
            description='Import and usage example.'
            maxWidth={760}
        >
            {example ? <CodeBlock code={example.code} /> : null}
        </Modal>
    );
}
