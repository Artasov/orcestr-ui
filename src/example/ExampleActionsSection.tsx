'use client';

import {
    LuBell,
    LuCheck,
    LuCommand,
    LuEllipsis,
    LuInfo,
    LuTrash2,
    LuTriangleAlert,
} from 'react-icons/lu';

import {Button, Flex, IconButton, Menu, Spinner, Tooltip, type MenuItem} from '..';
import {ExampleTile} from './CodePreview';
import {codeSamples, type CodeExample} from './codeSamples';
import {UiExampleSection} from './UiExampleSection';

type ActionsSectionProps = {
    menuItems: ReadonlyArray<MenuItem>;
    onOpenCode: (example: CodeExample) => void;
    onOpenPalette: () => void;
};

export function ActionsSection({
    menuItems,
    onOpenCode,
    onOpenPalette,
}: ActionsSectionProps) {
    return (
        <>
        <UiExampleSection
            id='buttons-example'
            title='Buttons'
            description='Button variants, tones, sizes, loading states and press animation.'
        >
                <ExampleTile
                    title='Buttons'
                    code={codeSamples.buttons}
                    onOpen={onOpenCode}
                >
                    <div className='oui-ui-row'>
                        <Button size={3}>Solid</Button>
                        <Button size={3} v='soft'>Soft</Button>
                        <Button size={3} v='surface'>Surface</Button>
                        <Button size={3} v='pad'>Pad</Button>
                        <Button size={3} v='outline'>Outline</Button>
                        <Button size={3} v='ghost'>Ghost</Button>
                    </div>
                    <div className='oui-ui-row'>
                        <Button size={3} tone='success' leftIcon={<LuCheck size={16} />}>Success</Button>
                        <Button size={3} tone='warning' v='soft' leftIcon={<LuTriangleAlert size={16} />}>Warning</Button>
                        <Button size={3} tone='info' v='soft' leftIcon={<LuInfo size={16} />}>Info</Button>
                        <Button size={3} tone='danger' v='soft' leftIcon={<LuTrash2 size={16} />}>Delete</Button>
                        <Button size={3} loading>Loading</Button>
                        <Button size={3} v='surface' loading leftIcon={<LuCheck size={16} />}>Save</Button>
                        <Button size={3} tone='success' loading leftIcon={<LuCheck size={16} />}>Success</Button>
                        <Spinner />
                    </div>
                    <div className='oui-ui-row'>
                        <Button size={1} v='surface'>Size 1</Button>
                        <Button size={2} v='surface'>Size 2</Button>
                        <Button size={3} v='surface'>Size 3</Button>
                        <Button size={4} v='surface'>Size 4</Button>
                    </div>
                    <div className='oui-ui-row'>
                        <Button size={1}>Solid 1</Button>
                        <Button size={2} v='soft'>Soft 2</Button>
                        <Button size={3} v='surface'>Surface 3</Button>
                        <Button size={3} v='pad'>Pad 3</Button>
                        <Button size={4} v='outline'>Outline 4</Button>
                        <Button size={2} v='ghost'>Ghost 2</Button>
                    </div>
                    <div className='oui-ui-row'>
                        <Button v='surface' pressAnimation='translate'>Press translate</Button>
                        <Button v='surface' pressAnimation='scale'>Press scale</Button>
                        <Button v='surface' pressAnimation='soft'>Press soft</Button>
                        <Button v='surface' pressAnimation='none'>Press none</Button>
                    </div>
                </ExampleTile>
        </UiExampleSection>
        <UiExampleSection
            id='icon-buttons-example'
            title='Icon buttons'
            description='Icon-only actions, loading state, menu trigger and command entry.'
        >
                <ExampleTile
                    title='Icon buttons'
                    code={codeSamples.iconButtons}
                    onOpen={onOpenCode}
                >
                    <Flex g={2} a='c' wrap>
                        <IconButton v='solid' icon={<LuCheck size={17} />} aria-label='Solid icon' />
                        <IconButton v='soft' icon={<LuBell size={17} />} aria-label='Soft icon' />
                        <IconButton v='surface' icon={<LuBell size={17} />} aria-label='Surface icon' />
                        <IconButton v='pad' icon={<LuBell size={17} />} aria-label='Pad icon' />
                        <IconButton v='outline' icon={<LuInfo size={17} />} aria-label='Outline icon' />
                        <IconButton v='ghost' icon={<LuEllipsis size={17} />} aria-label='Ghost icon' />
                    </Flex>
                    <Flex g={2} a='c' wrap>
                        <IconButton size={1} v='surface' icon={<LuBell size={13} />} aria-label='Size 1 icon' />
                        <IconButton size={2} v='surface' icon={<LuBell size={15} />} aria-label='Size 2 icon' />
                        <IconButton size={3} v='surface' icon={<LuBell size={17} />} aria-label='Size 3 icon' />
                        <IconButton size={4} v='surface' icon={<LuBell size={19} />} aria-label='Size 4 icon' />
                        <IconButton size={3} v='pad' round={false} r={3} icon={<LuCommand size={17} />} aria-label='Square pad icon' />
                        <IconButton size={3} v='outline' loading icon={<LuBell size={17} />} aria-label='Loading icon' />
                    </Flex>
                    <Flex g={2} a='c' wrap>
                        <IconButton size={1} v='ghost' icon={<LuEllipsis size={13} />} aria-label='Ghost size 1' />
                        <IconButton size={2} v='ghost' icon={<LuEllipsis size={15} />} aria-label='Ghost size 2' />
                        <IconButton size={3} v='ghost' icon={<LuEllipsis size={17} />} aria-label='Ghost size 3' />
                        <IconButton size={4} v='ghost' icon={<LuEllipsis size={19} />} aria-label='Ghost size 4' />
                    </Flex>
                    <div className='oui-ui-row'>
                        <Tooltip content='Notifications'>
                            <IconButton v='surface' icon={<LuBell size={17} />} aria-label='Notifications' />
                        </Tooltip>
                        <IconButton v='surface' loading icon={<LuBell size={17} />} aria-label='Loading action' />
                        <IconButton v='pad' icon={<LuBell size={17} />} aria-label='Pad action' />
                        <Menu
                            trigger={
                                <IconButton v='surface' icon={<LuEllipsis size={17} />} aria-label='Actions' />
                            }
                            items={menuItems}
                        />
                        <Button
                            v='surface'
                            leftIcon={<LuCommand size={16} />}
                            onClick={onOpenPalette}
                        >
                            Commands
                        </Button>
                    </div>
                </ExampleTile>
        </UiExampleSection>
        </>
    );
}
