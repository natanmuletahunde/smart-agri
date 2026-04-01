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
type BuyerOrderRow = {
  id: string;
  buyer_id: string;
  total_price: number | null;
  status: string | null;
  created_at: string;
  order_items: {
    quantity: number | null;
    price: number | null;
    products:
      | { name: string | null }
      | { name: string | null }[]
      | null;
  }[] | null;
};

export default async function BuyerOrdersPage() {
  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect("/login");
  }

  if (profile?.role !== "buyer") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-xl font-semibold">My orders</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          This page is for buyer accounts.{" "}
          <Link href="/marketplace" className="text-primary underline">
            Browse the marketplace
          </Link>{" "}
          or switch to a buyer profile in Supabase if you are testing.
        </p>
      </div>
    );
  }

  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      buyer_id,
      total_price,
      status,
      created_at,
      order_items (
        quantity,
        price,
        products ( name )
      )
    `
    )
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  const list = (orders ?? []) as unknown as BuyerOrderRow[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">My orders</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Orders you have placed as a buyer.
      </p>

      {error ? (
        <p className="text-destructive mt-4 text-sm">{error.message}</p>
      ) : null}

      {!list.length && !error ? (
        <p className="text-muted-foreground mt-6 text-sm">
          No orders yet.{" "}
          <Link href="/marketplace" className="text-primary underline">
            Browse products
          </Link>
        </p>
      ) : null}

      {list.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((o) => {
                const items = o.order_items ?? [];
                const line = items
                  .map((i) => {
                    const p = i.products;
                    const prod = Array.isArray(p) ? p[0] : p;
                    const n = prod?.name ?? "Product";
                    const q = i.quantity ?? 0;
                    return `${n} × ${q}`;
                  })
                  .join("; ");
                const total = Number(o.total_price);
                return (
                  <TableRow key={o.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(o.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="max-w-[280px] text-sm">
                      {line || "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {Number.isFinite(total) ? `${total.toFixed(2)} ETB` : "—"}
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
