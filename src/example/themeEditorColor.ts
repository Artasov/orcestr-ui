export type EditableThemeColor = {
    hex: string;
    opacity: number;
};

export function parseEditableThemeColor(value: string): EditableThemeColor | null {
    const color = value.trim().toLowerCase();
    if (color === 'transparent') return { hex: '#000000', opacity: 0 };

    const shortHex = color.match(/^#([0-9a-f]{3})([0-9a-f])?$/i);
    if (shortHex) {
        const [red, green, blue] = shortHex[1];
        return {
            hex: `#${red}${red}${green}${green}${blue}${blue}`,
            opacity: shortHex[2]
                ? parseInt(`${shortHex[2]}${shortHex[2]}`, 16) / 255
                : 1,
        };
    }

    const longHex = color.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
    if (longHex) {
        return {
            hex: `#${longHex[1]}`,
            opacity: longHex[2] ? parseInt(longHex[2], 16) / 255 : 1,
        };
    }

    const rgb = color.match(
        /^rgba?\(\s*(\d+(?:\.\d+)?)\s*(?:,|\s)\s*(\d+(?:\.\d+)?)\s*(?:,|\s)\s*(\d+(?:\.\d+)?)(?:\s*(?:,|\/)\s*(\d+(?:\.\d+)?)(%)?)?\s*\)$/i,
    );
    if (!rgb) return null;
    const opacity = rgb[4] ? Number(rgb[4]) / (rgb[5] === '%' ? 100 : 1) : 1;
    return {
        hex: `#${toHex(Number(rgb[1]))}${toHex(Number(rgb[2]))}${toHex(Number(rgb[3]))}`,
        opacity: clampOpacity(opacity),
    };
}

export function serializeEditableThemeColor(hex: string, opacity: number) {
    const normalizedOpacity = clampOpacity(opacity);
    if (normalizedOpacity >= 1) return hex;
    const [red, green, blue] = hexToRgb(hex);
    return `rgb(${red} ${green} ${blue} / ${Math.round(normalizedOpacity * 100)}%)`;
}

function hexToRgb(hex: string) {
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ] as const;
}

function clampOpacity(value: number) {
    return Math.max(0, Math.min(1, value));
}

function toHex(value: number) {
    return Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0');
}
