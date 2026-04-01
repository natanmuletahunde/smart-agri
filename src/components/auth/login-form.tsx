"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabasePlaceholderConfig } from "@/lib/supabase/env";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatSupabaseAuthError } from "@/lib/auth/format-auth-error";
import { normalizeAuthEmail } from "@/lib/auth/normalize-email";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = normalizeAuthEmail(String(form.get("email") ?? ""));
    const password = String(form.get("password") ?? "");

    if (isSupabasePlaceholderConfig()) {
      setError(
        "Supabase is not configured. Put NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (Next.js does not load .env.example). Restart the dev server after saving. Values: Supabase → Project Settings → API."
      );
      setLoading(false);
      return;
    }

    try {
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signError) {
        setError(formatSupabaseAuthError(signError));
        return;
      }

      router.refresh();
      router.push("/marketplace");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === "Failed to fetch" || msg.includes("NetworkError")) {
        setError(
          "Cannot reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL, restart the dev server after env changes, and your network."
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Log in"}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        No account?{" "}
        <Link href="/register" className="text-primary underline">
          Register
        </Link>
      </p>
    </form>
  );
}
