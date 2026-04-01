import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/data/profile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types/database";

type ItemRow = {
  id: string;
  quantity: number | null;
  price: number | null;
  orders: Order | null;
  products: { name: string | null; farmer_id: string | null } | null;
};

export default async function FarmerOrdersPage() {
  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect("/login");
  }

  if (profile?.role !== "farmer") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-xl font-semibold">Incoming orders</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          This view is for farmers.{" "}
          <Link href="/marketplace" className="text-primary underline">
            Go to marketplace
          </Link>
        </p>
      </div>
    );
  }

  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("order_items")
    .select(
      `
      id,
      quantity,
      price,
      orders ( id, buyer_id, total_price, status, created_at ),
      products ( name, farmer_id )
    `
    )
    .order("id", { ascending: false });

  const items: ItemRow[] = (rows ?? []).map((raw) => {
    const r = raw as unknown as {
      id: string;
      quantity: number | null;
      price: number | null;
      orders: Order | Order[] | null;
      products:
        | { name: string | null; farmer_id: string | null }
        | { name: string | null; farmer_id: string | null }[]
        | null;
    };
    const o = r.orders;
    const order = Array.isArray(o) ? o[0] ?? null : o;
    const p = r.products;
    const product = Array.isArray(p) ? p[0] ?? null : p;
    return {
      id: r.id,
      quantity: r.quantity,
      price: r.price,
      orders: order,
      products: product,
    };
  });
  const mine = items.filter(
    (r) => r.products?.farmer_id === user.id
  );

  const buyerIds = [
    ...new Set(
      mine
        .map((r) => r.orders?.buyer_id)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  let buyerNames = new Map<string, string>();
  if (buyerIds.length) {
    const { data: buyers } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", buyerIds);
    buyerNames = new Map(
      (buyers ?? []).map((b) => [b.id, b.full_name ?? "Buyer"])
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Incoming orders</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Line items for products you listed. Same order may appear as multiple
        rows if it contains several of your products.
      </p>

      {error ? (
        <p className="text-destructive mt-4 text-sm">{error.message}</p>
      ) : null}

      {!mine.length && !error ? (
        <p className="text-muted-foreground mt-6 text-sm">
          No orders for your products yet.
        </p>
      ) : null}

      {mine.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order date</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Line total</TableHead>
                <TableHead>Order status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mine
                .filter((row) => row.orders)
                .map((row) => {
                const o = row.orders!;
                const buyerName =
                  o.buyer_id && buyerNames.get(o.buyer_id)
                    ? buyerNames.get(o.buyer_id)
                    : o.buyer_id?.slice(0, 8) ?? "—";
                const q = Number(row.quantity ?? 0);
                const unit = Number(row.price ?? 0);
                const lineTotal = q * unit;
                return (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(o.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">{buyerName}</TableCell>
                    <TableCell className="text-sm">
                      {row.products?.name ?? "—"}
                    </TableCell>
                    <TableCell>{q}</TableCell>
                    <TableCell>
                      {Number.isFinite(lineTotal)
                        ? `${lineTotal.toFixed(2)} ETB`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {o.status ?? "—"}
                      </Badge>
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
