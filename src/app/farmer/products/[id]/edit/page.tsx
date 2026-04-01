import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/data/profile";
import { EditProductForm } from "@/components/farmer/product-form";
import { deleteProduct } from "@/app/actions/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/database";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect("/login");
  }

  if (profile?.role !== "farmer") {
    redirect("/farmer/products");
  }

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  const p = product as Product;

  if (p.farmer_id !== user.id) {
    redirect("/farmer/products");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        href="/farmer/products"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "mb-4 -ml-2 inline-flex"
        )}
      >
        ← My products
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit listing</CardTitle>
          <CardDescription>Update details or remove the listing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <EditProductForm product={p} />
          <form action={deleteProduct.bind(null, p.id)}>
            <Button type="submit" variant="destructive" className="w-full">
              Delete listing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
