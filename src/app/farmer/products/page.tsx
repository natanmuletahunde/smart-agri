import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/data/profile";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/database";

export default async function FarmerProductsPage() {
  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect("/login");
  }

  if (profile?.role !== "farmer") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-xl font-semibold">My products</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Only farmer accounts can manage listings.{" "}
          <Link href="/register" className="text-primary underline">
            Register as a farmer
          </Link>{" "}
          or update your role in Supabase for testing.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("farmer_id", user.id)
    .order("created_at", { ascending: false });

  const list = (products ?? []) as Product[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My products</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Listings visible on the marketplace.
          </p>
        </div>
        <Link href="/farmer/products/new" className={cn(buttonVariants())}>
          Add product
        </Link>
      </div>

      {error ? (
        <p className="text-destructive text-sm">{error.message}</p>
      ) : null}

      {!list.length && !error ? (
        <p className="text-muted-foreground text-sm">
          No listings yet.{" "}
          <Link href="/farmer/products/new" className="text-primary underline">
            Create your first product
          </Link>
          .
        </p>
      ) : null}

      {list.length > 0 ? (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => {
                const price = Number(p.price);
                const qty = Number(p.quantity);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      {p.category ? (
                        <Badge variant="secondary">{p.category}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {Number.isFinite(price) ? `${price.toFixed(2)} ETB` : "—"}
                    </TableCell>
                    <TableCell>
                      {Number.isFinite(qty) ? qty : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/farmer/products/${p.id}/edit`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" })
                        )}
                      >
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}
