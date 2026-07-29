'use client';

import { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

import {
    Button,
    Dialog,
    Drawer,
    Flex,
    Popover,
    Stack,
    Text,
    Tooltip,
    useToast,
    type ToastPosition,
    type ToastTone,
} from '../index.js';
import { ExampleTile } from './CodePreview.js';
import { codeSamples, type CodeExample } from './codeSamples.js';
import { UiExampleSection } from './UiExampleSection.js';

type SetOpen = (open: boolean) => void;

type OverlaysSectionProps = {
    setModalOpen: SetOpen;
    setBlurModalOpen: SetOpen;
    setFastModalOpen: SetOpen;
    setRiseModalOpen: SetOpen;
    setSlowModalOpen: SetOpen;
    setDangerModalOpen: SetOpen;
    onOpenCode: (example: CodeExample) => void;
};

const toastPositions: Array<{ position: ToastPosition; label: string }> = [
    { position: 'top-left', label: 'Top left' },
    { position: 'top-center', label: 'Top center' },
    { position: 'top-right', label: 'Top right' },
    { position: 'bottom-left', label: 'Bottom left' },
    { position: 'bottom-center', label: 'Bottom center' },
    { position: 'bottom-right', label: 'Bottom right' },
];

const toastPositionVariants: Array<{
    position: ToastPosition;
    label: string;
    tone: ToastTone;
    message: string;
}> = [
    {
        position: 'top-left',
        label: 'Status synced',
        tone: 'success',
        message: 'Default glass toast from the left edge.',
    },
    {
        position: 'top-center',
        label: 'Command ready',
        tone: 'info',
        message: 'Centered toast uses the same glass surface.',
    },
    {
        position: 'top-right',
        label: 'Needs attention',
        tone: 'warning',
        message: 'Right edge toast keeps the same translucent surface.',
    },
    {
        position: 'bottom-left',
        label: 'Import queued',
        tone: 'info',
        message: 'Bottom left toast keeps the same theme blur.',
    },
    {
        position: 'bottom-center',
        label: 'Batch completed',
        tone: 'success',
        message: 'Bottom center toast uses the theme defaults.',
    },
    {
        position: 'bottom-right',
        label: 'Export failed',
        tone: 'danger',
        message: 'Actionable toast from the right edge.',
    },
];

export function OverlaysSection({
    setModalOpen,
    setBlurModalOpen,
    setFastModalOpen,
    setRiseModalOpen,
    setSlowModalOpen,
    setDangerModalOpen,
    onOpenCode,
}: OverlaysSectionProps) {
    const toast = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <UiExampleSection
                id="overlay-primitives-example"
                title="Overlay primitives"
                description="Popover, Tooltip and Modal entry points."
            >
                <ExampleTile
                    title="Popover, tooltip and modal"
                    code={codeSamples.overlays}
                    onOpen={onOpenCode}
                >
                    <div className="oui-ui-row">
                        <Popover
                            trigger={
                                <Button v="surface" rightIcon={<LuChevronDown size={16} />}>
                                    Open popover
                                </Button>
                            }
                        >
                            <Stack g={2} p={1}>
                                <Text fw={700}>Popover content</Text>
                                <Text color="var(--oui-muted)" fs="13px">
                                    Shared positioning and presence.
                                </Text>
                            </Stack>
                        </Popover>
                        <Tooltip content="Tooltip uses the same floating layer">
                            <Button v="outline">Hover me</Button>
                        </Tooltip>
                        <Button v="surface" onClick={() => setDialogOpen(true)}>
                            Dialog
                        </Button>
                        <Button v="surface" onClick={() => setDrawerOpen(true)}>
                            Drawer
                        </Button>
                    </div>
                    <div className="oui-ui-row">
                        <Button onClick={() => setModalOpen(true)}>Default modal</Button>
                        <Button v="surface" onClick={() => setBlurModalOpen(true)}>
                            Blur modal
                        </Button>
                        <Button v="outline" onClick={() => setFastModalOpen(true)}>
                            Fast modal
                        </Button>
                        <Button v="outline" onClick={() => setRiseModalOpen(true)}>
                            Rise modal
                        </Button>
                        <Button v="outline" onClick={() => setSlowModalOpen(true)}>
                            Very slow modal
                        </Button>
                        <Button v="soft" tone="danger" onClick={() => setDangerModalOpen(true)}>
                            Danger modal
                        </Button>
                    </div>
                </ExampleTile>
            </UiExampleSection>
            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Content maxWidth={460}>
                    <Stack g={3}>
                        <Stack g={1}>
                            <Dialog.Title>Dialog title</Dialog.Title>
                            <Dialog.Description>
                                Dialog keeps the Modal layer but owns accessible title and
                                description.
                            </Dialog.Description>
                        </Stack>
                        <Flex g={2} j="e">
                            <Dialog.Close>
                                <Button v="surface">Cancel</Button>
                            </Dialog.Close>
                            <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
                        </Flex>
                    </Stack>
                </Dialog.Content>
            </Dialog.Root>
            <Drawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                title="Drawer title"
                description="Drawer uses the same overlay stack and focus behavior."
                footer={
                    <Flex g={2} j="e">
                        <Button v="surface" onClick={() => setDrawerOpen(false)}>
                            Close
                        </Button>
                        <Button>Apply</Button>
                    </Flex>
                }
            >
                <Stack g={2}>
                    <Text tone="muted" fs="13px">
                        Use Drawer for side panels and contextual forms.
                    </Text>
                    <Button v="soft">Panel action</Button>
                </Stack>
            </Drawer>
            <UiExampleSection
                id="toast-example"
                title="Toast"
                description="Toast positions, actions, progress, dedupe and glass background."
            >
                <ExampleTile title="Toast" code={codeSamples.toast} onOpen={onOpenCode}>
                    <Stack g={2}>
                        <div className="oui-ui-row">
                            <Button
                                v="soft"
                                tone="success"
                                onClick={() =>
                                    toast.success({
                                        title: 'Saved successfully',
                                        message: 'The settings are synced with the current theme.',
                                        position: 'bottom-right',
                                    })
                                }
                            >
                                Success
                            </Button>
                            <Button
                                v="soft"
                                tone="success"
                                onClick={() =>
                                    toast.success({
                                        title: 'Endless',
                                        message: 'This success toast stays until you click it.',
                                        position: 'bottom-right',
                                        duration: null,
                                        dedupeKey: 'endless-success-toast',
                                    })
                                }
                            >
                                Endless
                            </Button>
                            <Button
                                v="soft"
                                tone="warning"
                                onClick={() =>
                                    toast.warning({
                                        title: 'Needs attention',
                                        message: 'Only 4 items need attention in this view.',
                                        dedupeKey: 'needs-attention',
                                        position: 'top-right',
                                    })
                                }
                            >
                                Warning dedupe
                            </Button>
                            <Button
                                v="soft"
                                tone="danger"
                                onClick={() =>
                                    toast.error({
                                        title: 'Export failed',
                                        message:
                                            'The report can be retried without closing this page.',
                                        position: 'bottom-right',
                                        action: {
                                            label: 'Retry',
                                            onClick: () => toast.info('Retry queued'),
                                        },
                                    })
                                }
                            >
                                Error action
                            </Button>
                            <Button
                                v="surface"
                                onClick={() =>
                                    toast.info({
                                        title: 'Pinned note',
                                        message: 'duration: null keeps this toast visible.',
                                        position: 'top-center',
                                        duration: null,
                                        closeButton: true,
                                    })
                                }
                            >
                                Pinned
                            </Button>
                            <Button
                                v="surface"
                                onClick={() =>
                                    toast.info({
                                        title: 'Glass background',
                                        message: 'Theme blur and translucent background.',
                                        position: 'bottom-right',
                                        duration: 5200,
                                    })
                                }
                            >
                                Glass
                            </Button>
                        </div>
                        <Text color="var(--oui-muted)" fs="13px" lh={1.45}>
                            Toasts support typed helpers, controlled position, progress line, dedupe
                            keys, actions and fixed viewport above modals.
                        </Text>
                        <div className="oui-ui-row">
                            {toastPositions.map((item) => (
                                <Button
                                    key={item.position}
                                    size={1}
                                    v="surface"
                                    onClick={() =>
                                        toast.info({
                                            title: item.label,
                                            message:
                                                'Positioned toast with the default glass surface.',
                                            position: item.position,
                                            duration: 3600,
                                        })
                                    }
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                        <div className="oui-ui-row">
                            <Button
                                size={1}
                                tone="success"
                                v="soft"
                                onClick={() => {
                                    toastPositionVariants.forEach((item, index) => {
                                        window.setTimeout(() => {
                                            toast.push({
                                                title: item.label,
                                                message: item.message,
                                                position: item.position,
                                                tone: item.tone,
                                                duration: 4200 + index * 220,
                                            });
                                        }, index * 120);
                                    });
                                }}
                            >
                                Show all positions
                            </Button>
                            <Button
                                size={1}
                                tone="warning"
                                v="soft"
                                onClick={() =>
                                    toast.warning({
                                        title: 'Long task queued',
                                        message:
                                            'A longer duration shows the progress strip clearly.',
                                        position: 'bottom-center',
                                        duration: 9000,
                                    })
                                }
                            >
                                Long progress
                            </Button>
                        </div>
                    </Stack>
                </ExampleTile>
            </UiExampleSection>
            <UiExampleSection
                id="overlay-settings-example"
                title="Overlay settings"
                description="Modal overlay color, opacity, blur and animation settings."
            >
                <ExampleTile
                    title="Overlay settings"
                    code={codeSamples.overlaySettings}
                    onOpen={onOpenCode}
                >
                    <Text color="var(--oui-muted)" lh={1.5}>
                        The modal accepts overlay color, opacity, blur, animation and
                        animationDuration props. Default animation and duration come from the theme.
                    </Text>
                </ExampleTile>
            </UiExampleSection>
        </>
    );
}
