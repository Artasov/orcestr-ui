import {LuCircleAlert, LuCircleCheck, LuCircleX, LuInfo} from 'react-icons/lu';

import type {Tone} from '../../theme/systemProps';

export function stateIcon(tone: Tone) {
    if (tone === 'success') return <LuCircleCheck />;
    if (tone === 'warning') return <LuCircleAlert />;
    if (tone === 'danger') return <LuCircleX />;
    return <LuInfo />;
}
