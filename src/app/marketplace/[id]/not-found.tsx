import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-xl font-semibold">Product not found</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        This listing may have been removed.
      </p>
      <Link
        href="/marketplace"
        className={cn(buttonVariants(), "mt-6 inline-flex")}
      >
        Back to marketplace
      </Link>
    </div>
  );
}
