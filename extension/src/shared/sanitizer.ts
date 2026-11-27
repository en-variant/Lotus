
import type { Snapshot, SnapshotElement } from "./types";

// Day 1 privacy sanitizer for the fictional demo portal.
export function sanitizeSnapshot(
  snapshot: Snapshot,
  approvedText: ReadonlySet<string>
): Snapshot {
  const safeText = (text: string): string =>
    approvedText.has(text) ? text : "";

  const elements: SnapshotElement[] = snapshot.elements
    .filter(element => element.visible)
    .map(element => ({
      id: element.id,
      role: element.role,
      name: safeText(element.name),
      type: element.type
        ? safeText(element.type)
        : undefined,
      visible: true,
      options: element.options?.filter(option =>
        approvedText.has(option)
      ),
      context: element.context
        ? safeText(element.context)
        : undefined
    }));

  // Input values and raw URLs are never exported.
  return {
    url: "",
    title: safeText(snapshot.title),
    elements,
    text_blocks: snapshot.text_blocks.filter(text =>
      approvedText.has(text)
    )
  };
}
