import Link from "next/link";
import { getSessionProfile } from "@/lib/data/profile";
import { UserMenu } from "@/components/user-menu";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export async function SiteHeader() {
  const { user, profile } = await getSessionProfile();

  return (
    <header className="bg-card border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="text-primary font-semibold tracking-tight"
        >
          Smart Agri
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-2 text-sm md:gap-4">
          <Link
            href="/marketplace"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Marketplace
          </Link>
          {profile?.role === "farmer" ? (
            <>
              <Link
                href="/farmer/products"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                My products
              </Link>
              <Link
                href="/farmer/orders"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Incoming orders
              </Link>
            </>
          ) : null}
          {user && profile?.role === "buyer" ? (
            <Link
              href="/orders"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              My orders
            </Link>
          ) : null}
          {user ? (
            <UserMenu email={user.email} profile={profile} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Log in
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
