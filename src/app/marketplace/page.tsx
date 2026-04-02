import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/marketplace/product-card";
import type { Product, Profile } from "@/types/database";

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Browse listings from farmers across Ethiopia.
        </p>
      </div>

      {error ? (
        <p className="text-destructive text-sm">
          Could not load products. Check Supabase URL/key and RLS policies.
        </p>
      ) : null}

      {!products?.length && !error ? (
        <p className="text-muted-foreground text-sm">
          No products yet. Farmers can add listings from My products.
        </p>
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
