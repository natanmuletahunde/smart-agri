"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabasePlaceholderConfig } from "@/lib/supabase/env";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/types/database";
import { formatSupabaseAuthError } from "@/lib/auth/format-auth-error";
import { isValidAuthEmail, normalizeAuthEmail } from "@/lib/auth/normalize-email";
import Link from "next/link";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "farmer", label: "Farmer — sell produce" },
  { value: "buyer", label: "Buyer — purchase products" },
  { value: "transporter", label: "Transporter — deliver orders" },
];

export function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("buyer");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = normalizeAuthEmail(String(form.get("email") ?? ""));
    const password = String(form.get("password") ?? "");
    const full_name = String(form.get("full_name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim() || null;
    const location = String(form.get("location") ?? "").trim() || null;

    if (isSupabasePlaceholderConfig()) {
      setError(
        "Supabase is not configured. Put NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (Next.js does not load .env.example). Restart the dev server. Use the anon public key from Supabase → Project Settings → API."
      );
      setLoading(false);
      return;
    }

    if (!isValidAuthEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signError) {
        setError(formatSupabaseAuthError(signError));
        return;
      }

      const user = data.user;
      if (!user) {
        setError(
          "Check your email to confirm your account, then sign in. Profile will be created on first login if needed."
        );
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        full_name: full_name || null,
        role,
        phone,
        location,
      });

      if (profileError) {
        setError(profileError.message);
        return;
      }

      router.refresh();
      // Supabase may require email confirmation; in that case `session` is null
      // and the user won't be authenticated yet (so we shouldn't redirect).
      if (data.session) {
        router.push("/marketplace");
      } else {
        setError(
          "Check your email to confirm your account, then log in. Your profile was created during registration."
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === "Failed to fetch" || msg.includes("NetworkError")) {
        setError(
          "Cannot reach Supabase. Confirm NEXT_PUBLIC_SUPABASE_URL in .env.local matches your project, restart the dev server after changing env, and check your network."
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
        <Alert variant={error.includes("Check your email") ? "default" : "destructive"}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" autoComplete="name" required />
      </div>
      <div className="space-y-2">
        <Label>I am a</Label>
        <Select
          value={role}
          onValueChange={(v) => setRole(v as UserRole)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
          autoComplete="new-password"
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location (optional)</Label>
        <Input id="location" name="location" autoComplete="address-level1" />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
