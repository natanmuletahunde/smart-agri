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

/**
 * Minimal "likely valid" check before calling Supabase.
 * This prevents confusing `email_address_invalid` 400s when the user input
 * contains whitespace or other characters Supabase rejects.
 */
export function isValidAuthEmail(email: string): boolean {
  if (!email) return false;
  // Supabase rejects any whitespace characters in the email string.
  if (/\s/.test(email)) return false;

  // Common ASCII email pattern; good enough to catch the common invalid cases.
  // (We validate client-side to avoid a round-trip for obviously-invalid input.)
  const AUTH_EMAIL_REGEX =
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;
  return AUTH_EMAIL_REGEX.test(email);
}
