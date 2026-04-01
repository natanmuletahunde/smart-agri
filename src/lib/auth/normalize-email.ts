/**
 * Prepare email for Supabase Auth (and align with RFC-like handling).
 * Trims whitespace, normalizes Unicode lookalikes (e.g. fullwidth @), removes
 * zero-width / BOM characters, lowercases — common sources of "invalid email"
 * when the address looks correct on screen.
 */
export function normalizeAuthEmail(raw: string): string {
  return raw
    .trim()
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF\u2060]/g, "")
    .toLowerCase();
}
