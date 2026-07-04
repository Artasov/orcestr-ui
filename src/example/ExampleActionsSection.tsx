'use client';

import {
    LuBell,
    LuCheck,
    LuCommand,
    LuCopy,
    LuDownload,
    LuEllipsis,
    LuExternalLink,
    LuInfo,
    LuMessageSquare,
    LuPackagePlus,
    LuRefreshCw,
    LuSearch,
    LuSettings,
    LuShield,
    LuTrash2,
    LuTriangleAlert,
    LuUpload,
} from 'react-icons/lu';

import {
    Button,
    ContextMenu,
    CopyButton,
    CopyIconButton,
    Flex,
    IconButton,
    IconTextButton,
    Menu,
    Spinner,
    Text,
    Tooltip,
    type MenuItem,
} from '..';
import { ExampleTile } from './CodePreview';
import { codeSamples, type CodeExample } from './codeSamples';
import { UiExampleSection } from './UiExampleSection';

type ActionsSectionProps = {
    menuItems: ReadonlyArray<MenuItem>;
    onOpenCode: (example: CodeExample) => void;
    onOpenPalette: () => void;
};

export function ActionsSection({ menuItems, onOpenCode, onOpenPalette }: ActionsSectionProps) {
    return (
        <>
            <UiExampleSection
                id="buttons-example"
                title="Buttons"
                description="Button variants, tones, sizes, loading states and press animation."
            >
                <ExampleTile title="Buttons" code={codeSamples.buttons} onOpen={onOpenCode}>
                    <div className="oui-ui-row">
                        <Button size={3}>Solid</Button>
                        <Button size={3} v="soft">
                            Soft
                        </Button>
                        <Button size={3} v="surface">
                            Surface
                        </Button>
                        <Button size={3} v="pad">
                            Pad
                        </Button>
                        <Button size={3} v="outline">
                            Outline
                        </Button>
                        <Button size={3} v="ghost">
                            Ghost
                        </Button>
                    </div>
                    <div className="oui-ui-row">
                        <Button size={3} tone="success" leftIcon={<LuCheck size={16} />}>
                            Success
                        </Button>
                        <Button
                            size={3}
                            tone="warning"
                            v="soft"
                            leftIcon={<LuTriangleAlert size={16} />}
                        >
                            Warning
                        </Button>
                        <Button size={3} tone="info" v="soft" leftIcon={<LuInfo size={16} />}>
                            Info
                        </Button>
                        <Button size={3} tone="danger" v="soft" leftIcon={<LuTrash2 size={16} />}>
                            Delete
                        </Button>
                        <Button size={3} loading>
                            Loading
                        </Button>
                        <Button size={3} v="surface" loading leftIcon={<LuCheck size={16} />}>
                            Save
                        </Button>
                        <Button size={3} tone="success" loading leftIcon={<LuCheck size={16} />}>
                            Success
                        </Button>
                        <Spinner />
                    </div>
                    <div className="oui-ui-row">
                        <Button size={1} v="surface">
                            Size 1
                        </Button>
                        <Button size={2} v="surface">
                            Size 2
                        </Button>
                        <Button size={3} v="surface">
                            Size 3
                        </Button>
                        <Button size={4} v="surface">
                            Size 4
                        </Button>
                    </div>
                    <div className="oui-ui-row">
                        <Button size={1}>Solid 1</Button>
                        <Button size={2} v="soft">
                            Soft 2
                        </Button>
                        <Button size={3} v="surface">
                            Surface 3
                        </Button>
                        <Button size={3} v="pad">
                            Pad 3
                        </Button>
                        <Button size={4} v="outline">
                            Outline 4
                        </Button>
                        <Button size={2} v="ghost">
                            Ghost 2
                        </Button>
                    </div>
                    <div className="oui-ui-row">
                        <Button v="surface" pressAnimation="translate">
                            Press translate
                        </Button>
                        <Button v="surface" pressAnimation="scale">
                            Press scale
                        </Button>
                        <Button v="surface" pressAnimation="soft">
                            Press soft
                        </Button>
                        <Button v="surface" pressAnimation="none">
                            Press none
                        </Button>
                    </div>
                    <div className="oui-ui-row">
                        <CopyButton
                            text="https://orcestr.dev/requests/PR-2026-0900"
                            label="Copy link"
                            successMessage="Link copied"
                            v="surface"
                        />
                        <CopyIconButton
                            text="PR-2026-0900"
                            label="Copy request number"
                            successMessage="Request number copied"
                            v="surface"
                        />
                    </div>
                </ExampleTile>
            </UiExampleSection>
            <UiExampleSection
                id="icon-text-buttons-example"
                title="Icon text buttons"
                description="Button and link-button behavior with library-owned icon spacing."
            >
                <ExampleTile
                    title="IconTextButton"
                    code={codeSamples.iconTextButton}
                    onOpen={onOpenCode}
                >
                    <Flex g={2} a="c" wrap>
                        <IconTextButton icon={<LuPackagePlus size={16} />}>
                            Create PO
                        </IconTextButton>
                        <IconTextButton v="soft" tone="info" icon={<LuCopy size={16} />}>
                            Duplicate
                        </IconTextButton>
                        <IconTextButton
                            href="#icon-text-buttons-example"
                            v="surface"
                            icon={<LuExternalLink size={16} />}
                        >
                            Link action
                        </IconTextButton>
                        <IconTextButton
                            v="outline"
                            iconSide="end"
                            icon={<LuExternalLink size={16} />}
                        >
                            Open details
                        </IconTextButton>
                    </Flex>
                </ExampleTile>
            </UiExampleSection>
            <UiExampleSection
                id="icon-buttons-example"
                title="Icon buttons"
                description="Icon-only actions, loading state, menu trigger and command entry."
            >
                <ExampleTile
                    title="Icon buttons"
                    code={codeSamples.iconButtons}
                    onOpen={onOpenCode}
                >
                    <Flex g={2} a="c" wrap>
                        <IconButton
                            v="solid"
                            icon={<LuCheck size={17} />}
                            aria-label="Solid icon"
                        />
                        <IconButton
                            v="soft"
                            icon={<LuSearch size={17} />}
                            aria-label="Search icon"
                        />
                        <IconButton
                            v="surface"
                            icon={<LuUpload size={17} />}
                            aria-label="Upload icon"
                        />
                        <IconButton
                            v="pad"
                            icon={<LuShield size={17} />}
                            aria-label="Security icon"
                        />
                        <IconButton
                            v="outline"
                            icon={<LuInfo size={17} />}
                            aria-label="Outline icon"
                        />
                        <IconButton
                            v="ghost"
                            icon={<LuEllipsis size={17} />}
                            aria-label="Ghost icon"
                        />
                    </Flex>
                    <Flex g={2} a="c" wrap>
                        <IconButton
                            size={1}
                            v="surface"
                            icon={<LuSearch size={13} />}
                            aria-label="Size 1 search"
                        />
                        <IconButton
                            size={2}
                            v="surface"
                            icon={<LuDownload size={15} />}
                            aria-label="Size 2 download"
                        />
                        <IconButton
                            size={3}
                            v="surface"
                            icon={<LuRefreshCw size={17} />}
                            aria-label="Size 3 refresh"
                        />
                        <IconButton
                            size={4}
                            v="surface"
                            icon={<LuSettings size={19} />}
                            aria-label="Size 4 settings"
                        />
                        <IconButton
                            size={3}
                            v="pad"
                            round={false}
                            r={3}
                            icon={<LuCommand size={17} />}
                            aria-label="Square pad icon"
                        />
                        <IconButton
                            size={3}
                            v="outline"
                            loading
                            icon={<LuRefreshCw size={17} />}
                            aria-label="Loading icon"
                        />
                    </Flex>
                    <Flex g={2} a="c" wrap>
                        <IconButton
                            v="surface"
                            icon={<LuBell size={17} />}
                            badge={64}
                            aria-label="Notifications"
                        />
                        <IconButton
                            v="surface"
                            icon={<LuMessageSquare size={17} />}
                            badge={99}
                            aria-label="Unread chats"
                        />
                        <IconButton
                            v="pad"
                            icon={<LuShield size={17} />}
                            badge={3}
                            badgeTone="warning"
                            aria-label="Security warnings"
                        />
                        <IconButton
                            v="ghost"
                            icon={<LuDownload size={17} />}
                            badge="new"
                            badgeTone="info"
                            aria-label="New export"
                        />
                    </Flex>
                    <Flex g={2} a="c" wrap>
                        <IconButton
                            size={1}
                            v="ghost"
                            icon={<LuEllipsis size={13} />}
                            aria-label="Ghost size 1"
                        />
                        <IconButton
                            size={2}
                            v="ghost"
                            icon={<LuEllipsis size={15} />}
                            aria-label="Ghost size 2"
                        />
                        <IconButton
                            size={3}
                            v="ghost"
                            icon={<LuEllipsis size={17} />}
                            aria-label="Ghost size 3"
                        />
                        <IconButton
                            size={4}
                            v="ghost"
                            icon={<LuEllipsis size={19} />}
                            aria-label="Ghost size 4"
                        />
                    </Flex>
                    <div className="oui-ui-row">
                        <Tooltip content="Notifications">
                            <IconButton
                                v="surface"
                                icon={<LuBell size={17} />}
                                badge={8}
                                aria-label="Notifications"
                            />
                        </Tooltip>
                        <IconButton
                            v="surface"
                            loading
                            icon={<LuRefreshCw size={17} />}
                            aria-label="Loading action"
                        />
                        <IconButton
                            v="pad"
                            icon={<LuSettings size={17} />}
                            aria-label="Pad action"
                        />
                        <Menu
                            trigger={
                                <IconButton
                                    v="surface"
                                    icon={<LuEllipsis size={17} />}
                                    aria-label="Actions"
                                />
                            }
                            items={menuItems}
                        />
                        <Button
                            v="surface"
                            leftIcon={<LuCommand size={16} />}
                            onClick={onOpenPalette}
                        >
                            Commands
                        </Button>
                    </div>
                </ExampleTile>
            </UiExampleSection>
            <UiExampleSection
                id="context-menu-example"
                title="Context menu"
                description="Right-click menu layer using shared action menu items."
            >
                <ExampleTile title="ContextMenu" code={codeSamples.contextMenu} onOpen={onOpenCode}>
                    <ContextMenu items={menuItems}>
                        <div className="oui-ui-context-menu-demo">
                            <Text fs="13px" fw={760}>
                                Right-click this row
                            </Text>
                            <Text fs="12px" tone="muted">
                                ContextMenu reuses Menu item sizing, tones and confirm actions.
                            </Text>
                        </div>
                    </ContextMenu>
                </ExampleTile>
            </UiExampleSection>
        </>
    );
}
