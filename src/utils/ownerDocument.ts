export function ownerDocument(node?: Node | null): Document {
    return node?.ownerDocument ?? document;
}
