import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/data/profile";
import { CreateProductForm } from "@/components/farmer/product-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

export default async function NewProductPage() {
  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect("/login");
  }

  if (profile?.role !== "farmer") {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <p className="text-muted-foreground text-sm">
          Farmers only.{" "}
          <Link href="/farmer/products" className="text-primary underline">
            Back
          </Link>
        </p>
      </div>
    );
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
          <CardTitle>New listing</CardTitle>
          <CardDescription>
            Add a product buyers can find on the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
