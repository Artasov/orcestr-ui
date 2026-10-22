export function draftNumber(value: string): number | null {
    const text = value.trim().replace(',', '.');
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) return null;
    const number = Number(text);
    if (!Number.isFinite(number)) return null;
    const normalized = text.replace(/^\+/, ''), original = decimalParts(normalized), parsed = decimalParts(String(number));
    const scale = Math.max(0, original.scale, parsed.scale);
    return original.coefficient * 10n ** BigInt(scale - original.scale) === parsed.coefficient * 10n ** BigInt(scale - parsed.scale) ? number : null;
}

export function effectiveStep(modifiers: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }, step: number, shiftStep: number, ctrlShiftStep: number) {
    return modifiers.shiftKey ? modifiers.ctrlKey || modifiers.metaKey ? ctrlShiftStep : shiftStep : step;
}

function decimalParts(value: string | number) {
    const [mantissa, exponent = '0'] = String(value).toLowerCase().split('e');
    const fraction = mantissa.split('.')[1]?.length ?? 0;
    return { coefficient: BigInt(mantissa.replace('.', '')), scale: fraction - Number(exponent) };
}

export function scaleStep(value: number, power: number): number {
    const [mantissa, exponent = '0'] = String(value).toLowerCase().split('e');
    return Number(`${mantissa}e${Number(exponent) + power}`);
}

/** Add decimal values without carrying binary floating-point addition noise into the input. */
export function addStep(value: number, step: number): number {
    if (!Number.isFinite(value) || !Number.isFinite(step)) return Number.NaN;
    const first = decimalParts(value), second = decimalParts(step);
    const scale = Math.max(0, first.scale, second.scale);
    const coefficient = first.coefficient * 10n ** BigInt(scale - first.scale) + second.coefficient * 10n ** BigInt(scale - second.scale);
    const sign = coefficient < 0n ? '-' : '', digits = String(coefficient < 0n ? -coefficient : coefficient).padStart(scale + 1, '0');
    return Number(scale ? `${sign}${digits.slice(0, -scale)}.${digits.slice(-scale)}` : `${sign}${digits}`);
}
