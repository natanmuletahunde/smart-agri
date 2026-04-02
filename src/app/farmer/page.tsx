import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/data/profile";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function FarmerDashboardPage() {
  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect("/login");
  }

  if (profile?.role !== "farmer") {
    redirect("/marketplace");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Farmer dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your listings and track incoming buyer orders.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My products</CardTitle>
            <CardDescription>
              Create, update, and manage your marketplace listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/farmer/products" className={cn(buttonVariants())}>
              Open products
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incoming orders</CardTitle>
            <CardDescription>
              Review order line items and buyer demand for your products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/farmer/orders"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Open orders
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
