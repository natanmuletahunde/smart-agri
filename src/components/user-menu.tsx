"use client";

import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({
  email,
  profile,
}: {
  email?: string;
  profile: Profile | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  const dropdownLabel =
    profile?.full_name?.trim() || email?.split("@")[0] || "Account";

  // Show first-name initial in the header (e.g. "(N)").
  const triggerInitial = (() => {
    const fullName = profile?.full_name?.trim() ?? "";
    const firstName =
      fullName.split(/\s+/).filter(Boolean)[0] ??
      email?.split("@")[0]?.split(/[._-]/)[0] ??
      "";

    const firstChar = firstName.trim().charAt(0);
    return firstChar ? firstChar.toUpperCase() : "?";
  })();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "size-9 rounded-full p-0 text-sm font-semibold"
        )}
      >
        <span
          className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full"
          aria-hidden
        >
          {triggerInitial}
        </span>
        <span className="sr-only">Open account menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {dropdownLabel}
              </p>
              {email ? (
                <p className="text-muted-foreground text-xs leading-none">{email}</p>
              ) : null}
              {profile?.role ? (
                <p className="text-muted-foreground text-xs capitalize">
                  {profile.role}
                </p>
              ) : null}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
