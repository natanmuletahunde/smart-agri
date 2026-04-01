/**
 * Turns Supabase Auth API errors into clearer copy for the UI.
 * @see https://supabase.com/docs/guides/auth/rate-limits
 */
export function formatSupabaseAuthError(error: {
  message: string;
  code?: string;
}): string {
  const code = error.code;
  const msg = error.message.toLowerCase();

  if (
    code === "over_email_send_rate_limit" ||
    (msg.includes("email") && msg.includes("rate limit"))
  ) {
    return (
      "Supabase has stopped sending emails for now (built-in email has a strict hourly cap). " +
      "You can wait and try again later. To develop without confirmation emails, open the Supabase dashboard → " +
      "Authentication → Providers → Email and disable \"Confirm email\". " +
      "For production, add custom SMTP under Project Settings → Authentication."
    );
  }

  if (code === "over_request_rate_limit" || msg.includes("rate limit")) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  return error.message;
}
