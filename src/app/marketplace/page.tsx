import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/marketplace/product-card";
import type { Product, Profile } from "@/types/database";
import Link from "next/link";
import { Store } from "lucide-react";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default async function MarketplacePage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  let profileById = new Map<string, Pick<Profile, "id" | "full_name" | "location">>();

  if (products?.length) {
    const ids = [...new Set(products.map((p) => p.farmer_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, location")
      .in("id", ids);

    profileById = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse listings from farmers across Ethiopia.
          </p>
        </div>
        <Link
          href="/farmer/products/new"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Add product
        </Link>
      </div>

      {error ? (
        <p className="text-destructive text-sm">
          Could not load products. Check Supabase URL/key and RLS policies.
        </p>
      ) : null}

      {!products?.length && !error ? (
        <div className="bg-card flex flex-col items-center rounded-xl border border-dashed px-6 py-14 text-center">
          <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-full">
            <Store className="size-6" />
          </div>
          <h2 className="text-lg font-semibold">No listings yet</h2>
          <p className="text-muted-foreground mt-2 max-w-md text-sm">
            The marketplace is ready. Farmers can publish their first listing so
            buyers can start ordering.
          </p>
          <Link href="/farmer/products/new" className={cn(buttonVariants(), "mt-5")}>
            Add Product
          </Link>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(products as Product[] | null)?.map((product) => {
          const farmer = profileById.get(product.farmer_id);
          return (
            <ProductCard
              key={product.id}
              product={product}
              farmerName={farmer?.full_name}
              farmerLocation={farmer?.location}
            />
          );
        })}
      </div>
    </div>
  );
}
