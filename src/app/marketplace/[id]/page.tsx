import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/data/profile";
import { PlaceOrderForm } from "@/components/marketplace/place-order-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/database";

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { user, profile } = await getSessionProfile();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  const p = product as Product;

  const { data: farmer } = await supabase
    .from("profiles")
    .select("full_name, location, phone")
    .eq("id", p.farmer_id)
    .maybeSingle();

  const price = Number(p.price);
  const qty = Number(p.quantity);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/marketplace"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "mb-6 -ml-2 inline-flex"
        )}
      >
        ← Back to marketplace
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{p.name}</h1>
          {p.category ? (
            <Badge variant="secondary">{p.category}</Badge>
          ) : null}
        </div>
        <p className="text-muted-foreground mt-2">
          {p.description ?? "No description provided."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Listing</CardTitle>
            <CardDescription>Price and availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Price:</span>{" "}
              {Number.isFinite(price) ? `${price.toFixed(2)} ETB` : "—"}
            </p>
            <p>
              <span className="font-medium">In stock:</span>{" "}
              {Number.isFinite(qty) ? qty : "—"}
            </p>
            {p.location ? (
              <p>
                <span className="font-medium">Location:</span> {p.location}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Seller</CardTitle>
            <CardDescription>Farmer profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{farmer?.full_name ?? "Unknown"}</p>
            {farmer?.location ? (
              <p className="text-muted-foreground">{farmer.location}</p>
            ) : null}
            {farmer?.phone ? (
              <p className="text-muted-foreground">Phone: {farmer.phone}</p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Place order</CardTitle>
          <CardDescription>
            Buyers order here; delivery is recorded for transporters to pick up
            later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!user ? (
            <p className="text-muted-foreground text-sm">
              <Link href="/login" className="text-primary underline">
                Log in
              </Link>{" "}
              as a buyer to place an order.
            </p>
          ) : profile?.role !== "buyer" ? (
            <p className="text-muted-foreground text-sm">
              Only buyer accounts can place orders. Your role:{" "}
              <span className="capitalize">{profile?.role ?? "unknown"}</span>.
            </p>
          ) : p.farmer_id === user.id ? (
            <p className="text-muted-foreground text-sm">
              This is your own listing.
            </p>
          ) : !Number.isFinite(qty) || qty <= 0 ? (
            <p className="text-muted-foreground text-sm">Out of stock.</p>
          ) : (
            <PlaceOrderForm
              productId={p.id}
              maxQuantity={Math.floor(qty)}
              unitPrice={Number.isFinite(price) ? price : 0}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
