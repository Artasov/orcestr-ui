'use client';

import {
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import {LuInfo, LuX} from 'react-icons/lu';

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
    const collapsible = code.split('\n').length > 9;

    return (
        <div
            className='oui-code-inline-panel'
            data-expanded={expanded ? 'true' : 'false'}
            data-collapsible={collapsible ? 'true' : 'false'}
        >
            <div className='oui-code-inline-content'>
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

export function CodeBlock({code}: {code: string}) {
    const content = useMemo(() => highlightedCode(code), [code]);
    return (
        <ScrollArea className='oui-code-preview-scroll'>
            <pre className='oui-code-preview'>
                <code>{content}</code>
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
            maxWidth={760}
        >
            <Modal.Header>
                <div className='oui-modal-title-wrap'>
                    <h2 className='oui-modal-title'>
                        {example?.title ?? 'Component code'}
                    </h2>
                    <p className='oui-modal-description'>
                        Import and usage example.
                    </p>
                </div>
                <IconButton
                    v='ghost'
                    icon={<LuX size={18} />}
                    aria-label='Close'
                    onClick={onClose}
                />
            </Modal.Header>
            <Modal.Body>
                {example ? <CodeBlock code={example.code} /> : null}
            </Modal.Body>
        </Modal>
    );
}
