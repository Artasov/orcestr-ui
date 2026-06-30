'use client';

import {Button, CommandPalette, Flex, Field, Modal, Stack, Text, TextField} from '..';
import {getCommandItems} from './exampleData';
import {type OrcestrUiLocale} from '..';

type ToastTone = 'info' | 'success' | 'danger';
type SetOpen = (open: boolean) => void;

type ExampleOverlaysProps = {
    locale: OrcestrUiLocale;
    modalOpen: boolean;
    setModalOpen: SetOpen;
    nestedOpen: boolean;
    setNestedOpen: SetOpen;
    blurModalOpen: boolean;
    setBlurModalOpen: SetOpen;
    blurNestedOpen: boolean;
    setBlurNestedOpen: SetOpen;
    blurFinalOpen: boolean;
    setBlurFinalOpen: SetOpen;
    fastModalOpen: boolean;
    setFastModalOpen: SetOpen;
    slowModalOpen: boolean;
    setSlowModalOpen: SetOpen;
    riseModalOpen: boolean;
    setRiseModalOpen: SetOpen;
    dangerModalOpen: boolean;
    setDangerModalOpen: SetOpen;
    paletteOpen: boolean;
    setPaletteOpen: SetOpen;
    onToast: (title: string, tone?: ToastTone) => void;
};

export function ExampleOverlays({
    locale,
    modalOpen,
    setModalOpen,
    nestedOpen,
    setNestedOpen,
    blurModalOpen,
    setBlurModalOpen,
    blurNestedOpen,
    setBlurNestedOpen,
    blurFinalOpen,
    setBlurFinalOpen,
    fastModalOpen,
    setFastModalOpen,
    slowModalOpen,
    setSlowModalOpen,
    riseModalOpen,
    setRiseModalOpen,
    dangerModalOpen,
    setDangerModalOpen,
    paletteOpen,
    setPaletteOpen,
    onToast,
}: ExampleOverlaysProps) {
    const commandItems = getCommandItems(locale);

    return (
        <>
            <Modal
                open={modalOpen}
                onOpenChange={setModalOpen}
                title='Custom modal'
                description='First modal layer with the default theme blur backdrop.'
                footer={
                    <Flex g={2} j='e' w='100%'>
                        <Button v='surface' onClick={() => setModalOpen(false)}>Close</Button>
                        <Button onClick={() => setNestedOpen(true)}>Open nested</Button>
                    </Flex>
                }
            >
                <Stack g={3}>
                    <Text color='var(--oui-muted)' lh={1.5}>
                        Nested modals stack above the previous layer and keep independent smooth open and close animations.
                    </Text>
                    <Field label='Modal field'>
                        <TextField placeholder='Focus stays inside modal' />
                    </Field>
                </Stack>
            </Modal>

            <Modal
                open={nestedOpen}
                onOpenChange={setNestedOpen}
                title='Nested modal'
                description='Second layer with the same default modal animation.'
                maxWidth={440}
            >
                <Stack g={3}>
                    <Text color='var(--oui-muted)' lh={1.5}>
                        This checks layer indexes, focus trap and escape handling.
                    </Text>
                    <Button onClick={() => onToast('Nested modal action completed', 'success')}>
                        Show toast
                    </Button>
                </Stack>
            </Modal>

            <Modal
                open={blurModalOpen}
                onOpenChange={setBlurModalOpen}
                title='Blur modal'
                description='Default modal surface with pure backdrop blur and no overlay tint.'
                maxWidth={560}
                overlayColor='transparent'
                overlayOpacity={0}
                overlayBlur={10}
                borderColor='color-mix(in srgb, var(--oui-brand) 34%, var(--oui-border))'
                radius={10}
                shadow='0 24px 90px rgb(0 0 0 / 44%)'
                footer={
                    <Flex g={2} j='e' w='100%'>
                        <Button v='surface' onClick={() => setBlurModalOpen(false)}>Close</Button>
                        <Button onClick={() => setBlurNestedOpen(true)}>Open nested blur</Button>
                    </Flex>
                }
            >
                <Stack g={3}>
                    <Text color='var(--oui-muted)' lh={1.5}>
                        This variant checks a strong backdrop blur while the overlay tint stays fully transparent.
                    </Text>
                    <Field label='Reference'>
                        <TextField placeholder='ORD-2048' />
                    </Field>
                </Stack>
            </Modal>

            <Modal
                open={blurNestedOpen}
                onOpenChange={setBlurNestedOpen}
                title='Nested blur modal'
                description='Second blur layer without overlay tint.'
                maxWidth={500}
                overlayColor='transparent'
                overlayOpacity={0}
                overlayBlur={8}
                borderColor='color-mix(in srgb, var(--oui-brand) 38%, var(--oui-border))'
                radius={10}
                footer={
                    <Flex g={2} j='e' w='100%'>
                        <Button v='surface' onClick={() => setBlurNestedOpen(false)}>Close</Button>
                        <Button onClick={() => setBlurFinalOpen(true)}>Open final blur</Button>
                    </Flex>
                }
            >
                <Stack g={3}>
                    <Text color='var(--oui-muted)' lh={1.5}>
                        This layer keeps the backdrop blur transparent while stacking above the first blur modal.
                    </Text>
                    <TextField placeholder='Nested value' />
                </Stack>
            </Modal>

            <Modal
                open={blurFinalOpen}
                onOpenChange={setBlurFinalOpen}
                title='Final blur modal'
                description='Top blur layer. Toast must appear above this modal.'
                maxWidth={440}
                overlayColor='transparent'
                overlayOpacity={0}
                overlayBlur={6}
                borderColor='color-mix(in srgb, var(--oui-brand) 42%, var(--oui-border))'
                radius={10}
            >
                <Stack g={3}>
                    <Text color='var(--oui-muted)' lh={1.5}>
                        Use this modal to verify blur stacking and toast z-index.
                    </Text>
                    <Button onClick={() => onToast('Toast above nested blur modals', 'success')}>
                        Show toast
                    </Button>
                </Stack>
            </Modal>

            <Modal
                open={fastModalOpen}
                onOpenChange={setFastModalOpen}
                title='Fast modal'
                description='Short animationDuration passed directly to the modal.'
                maxWidth={460}
                overlayColor='#0b1020'
                overlayOpacity={0.28}
                overlayBlur={4}
                animationDuration='160ms'
            >
                <Stack g={3}>
                    <Text color='var(--oui-muted)' lh={1.5}>
                        This variant opens and closes quickly while still animating the backdrop blur.
                    </Text>
                    <Button onClick={() => setFastModalOpen(false)}>Close</Button>
                </Stack>
            </Modal>

            <Modal
                open={slowModalOpen}
                onOpenChange={setSlowModalOpen}
                title='Very slow modal'
                description='Long animationDuration for checking smooth blur ramp.'
                maxWidth={520}
                overlayColor='transparent'
                overlayOpacity={0}
                overlayBlur={14}
                animationDuration='1200ms'
                borderColor='color-mix(in srgb, var(--oui-brand) 42%, var(--oui-border))'
                radius={10}
            >
                <Stack g={3}>
                    <Text color='var(--oui-muted)' lh={1.5}>
                        The backdrop blur should build up and fade out gradually during the whole animation.
                    </Text>
                    <Button onClick={() => setSlowModalOpen(false)}>Close</Button>
                </Stack>
            </Modal>

            <Modal
                open={riseModalOpen}
                onOpenChange={setRiseModalOpen}
                title='Rise modal'
                description='Legacy rise animation kept as an explicit modal animation variant.'
                maxWidth={480}
                overlayColor='#0b1020'
                overlayOpacity={0.28}
                overlayBlur={4}
                animation='rise'
            >
                <Stack g={3}>
                    <Text color='var(--oui-muted)' lh={1.5}>
                        This keeps the previous small scale and vertical movement without content blur.
                    </Text>
                    <Button onClick={() => setRiseModalOpen(false)}>Close</Button>
                </Stack>
            </Modal>

            <Modal
                open={dangerModalOpen}
                onOpenChange={setDangerModalOpen}
                title='Danger modal'
                description='Strong colored overlay, danger border and compact radius.'
                maxWidth={500}
                overlayColor='#3b0712'
                overlayOpacity={0.48}
                overlayBlur={3}
                borderColor='color-mix(in srgb, var(--oui-danger) 46%, var(--oui-border))'
                radius={8}
                footer={
                    <Flex g={2} j='e' w='100%'>
                        <Button v='surface' onClick={() => setDangerModalOpen(false)}>Cancel</Button>
                        <Button
                            tone='danger'
                            onClick={() => {
                                setDangerModalOpen(false);
                                onToast('Danger action confirmed', 'danger');
                            }}
                        >
                            Confirm
                        </Button>
                    </Flex>
                }
            >
                <Stack g={3}>
                    <Text color='var(--oui-muted)' lh={1.5}>
                        This variant checks a colored backdrop without a hard flash on open or close.
                    </Text>
                    <TextField value='Archive selected record' readOnly />
                </Stack>
            </Modal>

            <CommandPalette
                open={paletteOpen}
                onOpenChange={setPaletteOpen}
                items={commandItems}
                recentItems={commandItems.slice(1, 3)}
                globalOpenEvents={['orcestr:open-command-palette']}
                onSelect={(value) => onToast(`Command selected: ${value}`, 'info')}
            />
        </>
    );
}
