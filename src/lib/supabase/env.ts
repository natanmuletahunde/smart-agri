/** Placeholders allow `next build` without a local `.env`; set real values in production. */
export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";

export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjAsImV4cCI6MjI1NDQ5NjAwMH0.placeholder";

/** True when env was not set — browser auth calls will fail with "Failed to fetch". */
export function isSupabasePlaceholderConfig(): boolean {
  return (
    supabaseUrl.includes("placeholder.supabase.co") ||
    supabaseAnonKey.endsWith(".placeholder")
  );
}
